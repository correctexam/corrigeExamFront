import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'ngx-webstorage';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Compartment, EditorState, Extension } from '@codemirror/state';
import { EditorView, highlightActiveLine, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { completionKeymap } from '@codemirror/autocomplete';
import { Diagnostic as CmDiagnostic, lintGutter, setDiagnostics } from '@codemirror/lint';

import { CourseService } from 'app/entities/course/service/course.service';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { PreferenceService } from '../preference-page/preference.service';
import { TypstCompilerService } from '../typst/typst-compiler.service';
import { TypstBinaryFile, TypstCompileResponse, TypstDiagnostic } from '../typst/typst-worker.protocol';
import { buildLayout, GeneratedLayout, parseZoneMetadata, TypstZoneError } from '../typst/typst-zones';
import { checkLayout, LayoutIssue, padForRectoVerso, parseCopyPages, planExam, templatePlan } from '../typst/exam-from-subject';
import { ExamFromSubjectService } from '../typst/exam-from-subject.service';
import { buildVersions, BuiltVersions, MAX_VERSIONS, newSeed } from '../typst/subject-versions';
import { ExamVersionsService } from '../typst/exam-versions.service';
import { DIAGRAM_INPUT, DiagramError, DiagramRequest, DiagramStore, parseDiagramRequests } from '../typst/subject-diagrams';
import {
  fromCompilerPath,
  isSubjectTextFile,
  normalizeSubjectPath,
  sha256Hex,
  sortSubjectPaths,
  SUBJECT_FILE_ACCEPT,
  SUBJECT_MAIN_FILE,
  suggestSubjectPath,
  toCompilerPath,
} from '../typst/subject-files';
import { ExamSubject, SubjectApiError, SubjectService, SubjectSummary, toSubjectApiError } from '../typst/subject.service';
import { SUBJECT_SNIPPETS, SUBJECT_STARTER } from './subject-starter';
import { typstEditorLanguage } from './typst-editor-language';

const COMPILE_DELAY_MS = 600;
const SAVE_DELAY_MS = 1500;
/** Lock renewal while the page is open (the server lock lasts 15 min). */
const LOCK_RENEW_MS = 5 * 60 * 1000;

interface BinaryFile {
  key: string;
  data: Uint8Array;
}

/** Text files of a draft kept in this browser (images are not kept). */
interface StoredDraft {
  format: 2;
  files: Record<string, string>;
}

export type SaveState = 'saved' | 'dirty' | 'saving' | 'error';

/**
 * Writes an exam subject in Typst (T25b, T25c, ADR 0004).
 *
 * - `creerexam/:courseid/typst`: new subject, kept as a draft in this browser (optionally copied from another exam),
 *   live preview, then creation of the exam with its template, zones and questions; the subject is stored with it.
 * - `exam/:examid/subject`: subject stored with an exam. One teacher edits at a time (lock renewed while the page is
 *   open, taken over explicitly); every change is saved with the revision the editor knows (`If-Match`). Changing the
 *   subject of an existing exam does not change its template nor its zones.
 *
 * Text diagrams (`#diagram(...)`) are rendered by the platform (Kroki) and given to the compiler as SVG.
 */
@Component({
  selector: 'jhi-subject-editor',
  standalone: true,
  templateUrl: './subject-editor.component.html',
  styleUrls: ['./subject-editor.component.scss'],
  providers: [MessageService],
  imports: [FormsModule, TranslateDirective, TranslatePipe, ToastModule],
})
export class SubjectEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly snippets = SUBJECT_SNIPPETS;
  readonly accept = SUBJECT_FILE_ACCEPT;
  readonly mainFile = SUBJECT_MAIN_FILE;

  readonly courseId = signal<number | undefined>(undefined);
  /** Set when editing the subject stored with an exam. */
  readonly examId = signal<number | undefined>(undefined);
  readonly courseName = signal('');
  readonly examName = signal('');
  readonly compiling = signal(false);
  readonly creating = signal(false);
  readonly result = signal<TypstCompileResponse | undefined>(undefined);
  readonly layout = signal<GeneratedLayout | undefined>(undefined);
  readonly layoutError = signal<string | undefined>(undefined);
  readonly failure = signal<string | undefined>(undefined);
  readonly pdfUrl = signal<SafeResourceUrl | undefined>(undefined);

  /** Versions of the subject (T25e): number, seed of the draw, last result. */
  readonly maxVersions = MAX_VERSIONS;
  readonly versionCount = signal(1);
  readonly versionSeed = signal(newSeed());
  readonly versionsBuilding = signal(false);
  readonly versions = signal<BuiltVersions | undefined>(undefined);
  /** The subject changed since the versions were built. */
  readonly versionsStale = signal(false);
  /** Version shown in the preview instead of the subject (index), undefined for the subject. */
  readonly previewVersion = signal<number | undefined>(undefined);
  /** Versions built from the current subject, without any problem: the exam is created with them. */
  readonly versionsReady = computed(() => {
    const v = this.versions();
    return (
      this.versionCount() > 1 &&
      v !== undefined &&
      !this.versionsStale() &&
      v.versions.length === this.versionCount() &&
      v.issues.length === 0 &&
      v.diagnostics === undefined
    );
  });
  /** Several versions asked for, but not (or no longer) built and checked: no exam can be created. */
  readonly versionsBlocking = computed(() => this.versionCount() > 1 && !this.versionsReady());
  readonly previewLabel = computed(() => {
    const i = this.previewVersion();
    return i === undefined ? undefined : this.versions()?.versions[i]?.plan.label;
  });
  readonly previewUrl = computed(() => (this.previewVersion() === undefined ? this.pdfUrl() : this.versionPdfUrl()));

  /** Files of the subject, main file first. */
  readonly paths = signal<string[]>([SUBJECT_MAIN_FILE]);
  readonly current = signal(SUBJECT_MAIN_FILE);
  readonly newFilePath = signal('');

  readonly subject = signal<ExamSubject | undefined>(undefined);
  /** Stored mode: the exam has no subject on the server (a draft of this browser may be saved there). */
  readonly noSubject = signal(false);
  /** Stored mode without subject: this browser kept the subject (it could not be stored when the exam was created). */
  readonly hasLocalDraft = signal(false);
  readonly loading = signal(false);
  readonly saveState = signal<SaveState>('saved');
  readonly saveError = signal<string | undefined>(undefined);
  /** Another tab or teacher saved meanwhile: read-only until reloaded. */
  readonly conflict = signal(false);
  readonly storageUnavailable = signal(false);

  readonly reusable = signal<SubjectSummary[]>([]);
  readonly reuseFrom = signal<number | undefined>(undefined);

  readonly diagramErrors = signal<DiagramError[]>([]);
  readonly diagramsPending = signal(0);

  readonly stored = computed(() => this.examId() !== undefined);
  readonly lock = computed(() => this.subject()?.lock);
  /** Local time at which the lock of another teacher expires. */
  readonly lockUntil = computed(() => {
    const at = this.lock()?.expiresAt;
    return at ? new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  });
  readonly editable = computed(() => {
    if (!this.stored()) {
      return true;
    }
    return !this.loading() && !this.conflict() && this.subject()?.lock.mine === true;
  });
  readonly diagnostics = computed<TypstDiagnostic[]>(() => this.result()?.diagnostics ?? []);
  readonly issues = computed<LayoutIssue[]>(() => {
    const layout = this.layout();
    return layout ? checkLayout(layout) : [];
  });
  readonly diagramsReady = computed(() => this.diagramsPending() === 0 && this.diagramErrors().length === 0);
  readonly canCreate = computed(
    () =>
      !this.stored() &&
      !this.creating() &&
      this.examName().trim() !== '' &&
      this.result()?.ok === true &&
      this.layout() !== undefined &&
      this.diagramsReady() &&
      !this.versionsBlocking() &&
      !this.issues().some(i => i.level === 'error'),
  );

  protected readonly compiler = inject(TypstCompilerService);
  private readonly editorHost = viewChild.required<ElementRef<HTMLDivElement>>('editor');
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly storage = inject(LocalStorageService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);
  private readonly titleService = inject(Title);
  private readonly courseService = inject(CourseService);
  private readonly examService = inject(ExamService);
  private readonly preferences = inject(PreferenceService);
  private readonly examFromSubject = inject(ExamFromSubjectService);
  private readonly examVersions = inject(ExamVersionsService);
  private readonly subjects = inject(SubjectService);
  private readonly destroyRef = inject(DestroyRef);

  private view?: EditorView;
  private readonly readOnly = new Compartment();
  /** Editor state of each text file (content, history, selection). */
  private readonly texts = new Map<string, EditorState>();
  private readonly binaries = new Map<string, BinaryFile>();
  private readonly diagrams = new DiagramStore(r => this.subjects.renderDiagram(r));
  private diagramRequests: DiagramRequest[] = [];
  private objectUrl?: string;
  private versionObjectUrl?: string;
  private readonly versionPdfUrl = signal<SafeResourceUrl | undefined>(undefined);
  private compileTimer?: ReturnType<typeof setTimeout>;
  private saveTimer?: ReturnType<typeof setTimeout>;
  private lockTimer?: ReturnType<typeof setInterval>;
  /** Only the answer to the last request is shown: an older compilation may finish later. */
  private sequence = 0;
  /** Stored mode: files changed since the last save. */
  private readonly dirty = new Set<string>();
  private saving?: Promise<void>;

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const examId = Number(params.get('examid'));
      const courseId = Number(params.get('courseid'));
      if (Number.isInteger(examId) && examId > 0) {
        this.examId.set(examId);
        this.examService.find(examId).subscribe(e => {
          this.examName.set(e.body?.name ?? '');
          this.courseId.set(e.body?.courseId);
          this.updateTitle();
        });
      } else if (Number.isInteger(courseId) && courseId > 0) {
        this.courseId.set(courseId);
        this.courseService.find(courseId).subscribe(c => {
          this.courseName.set(c.body?.name ?? '');
          this.updateTitle();
        });
        this.subjects
          .listReusable()
          .then(list => this.reusable.set(list))
          .catch(() => this.reusable.set([]));
      }
    });
    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateTitle());
  }

  ngAfterViewInit(): void {
    const examId = this.examId();
    if (examId === undefined) {
      this.setProject(this.loadDraft(this.draftKey()), new Map());
      void this.compile();
    } else {
      this.view = new EditorView({ parent: this.editorHost().nativeElement, state: this.createState(SUBJECT_MAIN_FILE, '') });
      void this.loadStored(examId);
      this.lockTimer = setInterval(() => void this.renewLock(), LOCK_RENEW_MS);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.compileTimer);
    clearTimeout(this.saveTimer);
    clearInterval(this.lockTimer);
    const examId = this.examId();
    if (examId !== undefined && this.subject()?.lock.mine) {
      // last changes first, then the lock is released for the other teachers
      void this.flush()
        .catch(() => undefined)
        .then(() => this.subjects.unlock(examId))
        .catch(() => undefined);
    }
    this.view?.destroy();
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
    if (this.versionObjectUrl) {
      URL.revokeObjectURL(this.versionObjectUrl);
    }
  }

  // ------------------------------------------------------------------------------------------------
  // Files

  /** Text of a file (the edited one comes from the editor). */
  text(path: string): string {
    if (path === this.current() && this.view) {
      return this.view.state.doc.toString();
    }
    return this.texts.get(path)?.doc.toString() ?? '';
  }

  /** Kept for the specs and the download of the main file. */
  source(): string {
    return this.text(SUBJECT_MAIN_FILE);
  }

  isText(path: string): boolean {
    return isSubjectTextFile(path);
  }

  select(path: string): void {
    if (!this.view || path === this.current() || !this.texts.has(path)) {
      return;
    }
    this.texts.set(this.current(), this.view.state);
    this.current.set(path);
    this.view.setState(this.texts.get(path)!);
    this.applyEditable();
    this.showDiagnosticsInEditor(this.diagnostics());
  }

  addFile(): void {
    if (!this.editable()) {
      return;
    }
    const path = normalizeSubjectPath(this.newFilePath().trim());
    if (path === undefined || !isSubjectTextFile(path)) {
      this.showError('typstsubject.files.badPath', new Error(this.newFilePath()));
      return;
    }
    if (!this.paths().includes(path)) {
      this.texts.set(path, this.createState(path, ''));
      this.paths.set(sortSubjectPaths([...this.paths(), path]));
      this.changed(path);
    }
    this.newFilePath.set('');
    this.select(path);
  }

  async upload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (!this.editable()) {
      return;
    }
    for (const file of files) {
      const path = suggestSubjectPath(file.name);
      if (path === undefined || path === SUBJECT_MAIN_FILE) {
        this.showError('typstsubject.files.badPath', new Error(file.name));
        continue;
      }
      try {
        if (isSubjectTextFile(path)) {
          this.texts.set(path, this.createState(path, await file.text()));
          if (path === this.current()) {
            this.view?.setState(this.texts.get(path)!);
          }
        } else {
          const data = new Uint8Array(await file.arrayBuffer());
          this.binaries.set(path, { key: await sha256Hex(data), data });
        }
        this.paths.set(sortSubjectPaths(new Set([...this.paths(), path])));
        this.changed(path);
      } catch (e) {
        this.showError('typstsubject.openFailed', e);
      }
    }
    this.scheduleCompile(0);
  }

  async remove(path: string): Promise<void> {
    if (path === SUBJECT_MAIN_FILE || !this.editable()) {
      return;
    }
    const examId = this.examId();
    if (examId !== undefined) {
      try {
        await this.flush();
        this.subject.set(await this.subjects.deleteFile(examId, path, this.subject()?.revision));
      } catch (e) {
        this.onSaveError(e);
        return;
      }
    }
    if (this.current() === path) {
      this.select(SUBJECT_MAIN_FILE);
    }
    this.texts.delete(path);
    this.binaries.delete(path);
    this.dirty.delete(path);
    this.paths.set(this.paths().filter(p => p !== path));
    this.saveDraft();
    this.scheduleCompile(0);
  }

  /** Inserts in the main file the Typst code that uses a file of the subject. */
  insertReference(path: string): void {
    const ext = path.slice(path.lastIndexOf('.') + 1);
    let code: string;
    if (!isSubjectTextFile(path)) {
      code = `#image("${path}", width: 60%)`;
    } else if (ext === 'typ') {
      code = `#include "${path}"`;
    } else if (ext === 'puml') {
      code = `#diagram("plantuml", read("${path}"))`;
    } else if (ext === 'mmd') {
      code = `#diagram("mermaid", read("${path}"))`;
    } else if (ext === 'd2') {
      code = `#diagram("d2", read("${path}"))`;
    } else {
      code = `#raw(read("${path}"), lang: "${ext}", block: true)`;
    }
    this.select(SUBJECT_MAIN_FILE);
    this.insertSnippet(code);
  }

  // ------------------------------------------------------------------------------------------------
  // Editor actions

  insertSnippet(code: string): void {
    if (!this.view || !this.editable()) {
      return;
    }
    const { from, to } = this.view.state.selection.main;
    this.view.dispatch({ changes: { from, to, insert: code }, selection: { anchor: from + code.length } });
    this.view.focus();
  }

  goTo(d: TypstDiagnostic): void {
    const path = this.pathOf(d);
    if (!this.view || d.line === undefined || path === undefined || !this.texts.has(path)) {
      return;
    }
    this.select(path);
    const pos = this.offset(d.line, d.column ?? 1);
    this.view.dispatch({ selection: { anchor: pos }, scrollIntoView: true });
    this.view.focus();
  }

  /** File of the subject a diagnostic points to (undefined for a package). */
  pathOf(d: TypstDiagnostic): string | undefined {
    return d.path === '' ? SUBJECT_MAIN_FILE : fromCompilerPath(d.path);
  }

  resetToStarter(): void {
    this.replaceText(SUBJECT_MAIN_FILE, SUBJECT_STARTER);
  }

  download(): void {
    const blob = new Blob([this.source()], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${this.examName().trim() || 'sujet'}.typ`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  open(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      file
        .text()
        .then(text => this.replaceText(SUBJECT_MAIN_FILE, text))
        .catch((e: unknown) => this.showError('typstsubject.openFailed', e));
    }
    input.value = '';
  }

  retryDiagrams(): void {
    this.diagrams.retry();
    this.scheduleCompile(0);
  }

  /** Draft mode: replaces the draft by a copy of the subject of another exam. */
  async reuse(): Promise<void> {
    const from = this.reuseFrom();
    if (from === undefined) {
      return;
    }
    this.loading.set(true);
    try {
      const subject = await this.subjects.find(from);
      if (subject === undefined) {
        throw new SubjectApiError('NOT_FOUND', 404, String(from));
      }
      const { texts, binaries } = await this.readFiles(from, subject);
      this.setProject(texts, binaries);
      this.saveDraft();
      this.scheduleCompile(0);
    } catch (e) {
      this.showError('typstsubject.storage.loadFailed', e);
    } finally {
      this.loading.set(false);
    }
  }

  // ------------------------------------------------------------------------------------------------
  // Stored subject: lock, saves, conflicts

  async takeOver(): Promise<void> {
    const examId = this.examId();
    if (examId === undefined) {
      return;
    }
    try {
      await this.subjects.lock(examId, true);
      // the other teacher may have saved: start again from the server
      await this.loadStored(examId);
    } catch (e) {
      this.showError('typstsubject.storage.lockFailed', e);
    }
  }

  async reload(): Promise<void> {
    const examId = this.examId();
    if (examId !== undefined) {
      this.dirty.clear();
      await this.loadStored(examId);
    }
  }

  /** Stored mode, exam without subject: stores the draft kept by this browser for this exam. */
  async storeLocalDraft(): Promise<void> {
    const examId = this.examId();
    if (examId === undefined) {
      return;
    }
    this.loading.set(true);
    try {
      await this.storeSubject(examId);
      this.storage.clear(this.examDraftKey(examId));
      await this.loadStored(examId);
    } catch (e) {
      this.onSaveError(e);
    } finally {
      this.loading.set(false);
    }
  }

  /** Saves the changed files now (also called before leaving). */
  flush(): Promise<void> {
    clearTimeout(this.saveTimer);
    this.saving ??= this.saveDirty().finally(() => (this.saving = undefined));
    return this.saving;
  }

  // ------------------------------------------------------------------------------------------------
  // Exam creation

  async createExam(): Promise<void> {
    const courseId = this.courseId();
    if (!this.canCreate() || courseId === undefined) {
      return;
    }
    this.creating.set(true);
    try {
      const built = this.versionsReady() ? this.versions() : undefined;
      if (built) {
        // T25e: version A (identity plan, common number of pages) is the template; the versions are stored with the exam
        const a = built.versions[0];
        await this.createFrom(courseId, a.pdf, a.zones, examId => this.examVersions.store(examId, built));
        return;
      }
      // compile again: the exam must match exactly the subject currently written. The template keeps the code area
      // empty (codes stamped on each printed copy, T25d) and gets an even number of pages (recto-verso).
      const compileTemplate = (pad: number): Promise<TypstCompileResponse> =>
        this.compiler.compile(this.compilerFiles(), {
          withPdf: true,
          binaries: this.compilerBinaries(),
          inputs: { [DIAGRAM_INPUT]: this.diagrams.input(), 'ce-plan': templatePlan(pad) },
        });
      let res = await compileTemplate(0);
      const pad = res.ok ? padForRectoVerso(parseCopyPages(res.copies) ?? 0) : 0;
      if (pad > 0) {
        // blank pages at the end: the zones of the first compilation stay the same
        res = await compileTemplate(pad);
      }
      if (!res.ok || !res.pdf) {
        this.applyResult(res, ++this.sequence);
        return;
      }
      await this.createFrom(courseId, res.pdf, res.zones);
    } catch (e) {
      this.showError('typstsubject.createFailed', e);
    } finally {
      this.creating.set(false);
    }
  }

  // ------------------------------------------------------------------------------------------------
  // Versions (T25e)

  setVersionCount(value: unknown): void {
    const n = Number(value);
    this.versionCount.set(Number.isInteger(n) ? Math.min(MAX_VERSIONS, Math.max(1, n)) : 1);
  }

  setVersionSeed(value: unknown): void {
    const n = Number(value);
    if (Number.isInteger(n) && n >= 0) {
      this.versionSeed.set(n);
    }
  }

  newVersionSeed(): void {
    this.versionSeed.set(newSeed());
  }

  /** Compiles every version with its plan, checks that their copies can be rebuilt in the layout of version A. */
  async buildVersions(): Promise<void> {
    if (this.versionsBuilding()) {
      return;
    }
    this.versionsBuilding.set(true);
    this.showVersion(undefined);
    try {
      const files = this.compilerFiles();
      const binaries = this.compilerBinaries();
      const diagrams = this.diagrams.input();
      const built = await buildVersions(
        cePlan =>
          this.compiler.compile(files, {
            withPdf: true,
            binaries,
            inputs: { [DIAGRAM_INPUT]: diagrams, 'ce-plan': JSON.stringify(cePlan) },
          }),
        this.versionCount(),
        this.versionSeed(),
      );
      this.versions.set(built);
      this.versionsStale.set(false);
    } catch (e) {
      this.showError('typstsubject.versions.failed', e);
    } finally {
      this.versionsBuilding.set(false);
    }
  }

  /** Shows a version in the preview (index), or the subject (undefined). */
  showVersion(index: number | undefined): void {
    if (this.versionObjectUrl) {
      URL.revokeObjectURL(this.versionObjectUrl);
      this.versionObjectUrl = undefined;
    }
    const version = index === undefined ? undefined : this.versions()?.versions[index];
    if (version === undefined) {
      this.previewVersion.set(undefined);
      this.versionPdfUrl.set(undefined);
      return;
    }
    this.versionObjectUrl = URL.createObjectURL(new Blob([version.pdf], { type: 'application/pdf' }));
    // URL created here from a compiled version: safe to show in the frame
    this.versionPdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.versionObjectUrl));
    this.previewVersion.set(index);
  }

  back(): void {
    const examId = this.examId();
    if (examId !== undefined) {
      void this.router.navigateByUrl(`/exam/${examId}`);
      return;
    }
    const id = this.courseId();
    if (id !== undefined) {
      void this.router.navigateByUrl(`/course/${id}`);
    }
  }

  // ------------------------------------------------------------------------------------------------
  // Internals

  private createState(path: string, doc: string): EditorState {
    const extensions: Extension[] = [
      lineNumbers(),
      ...(path.endsWith('.typ') ? typstEditorLanguage() : []),
      history(),
      highlightActiveLine(),
      lintGutter(),
      EditorView.lineWrapping,
      this.readOnly.of(this.readOnlyExtension()),
      keymap.of([...completionKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          this.changed(path);
        }
      }),
    ];
    return EditorState.create({ doc, extensions });
  }

  private readOnlyExtension(): Extension {
    const ro = !this.editable();
    return [EditorState.readOnly.of(ro), EditorView.editable.of(!ro)];
  }

  private applyEditable(): void {
    this.view?.dispatch({ effects: this.readOnly.reconfigure(this.readOnlyExtension()) });
  }

  /** Replaces all the files (draft loaded, subject copied or loaded from the server). */
  private setProject(texts: Map<string, string>, binaries: Map<string, BinaryFile>): void {
    if (!texts.has(SUBJECT_MAIN_FILE)) {
      texts.set(SUBJECT_MAIN_FILE, '');
    }
    this.texts.clear();
    for (const [path, content] of texts) {
      this.texts.set(path, this.createState(path, content));
    }
    this.binaries.clear();
    for (const [path, b] of binaries) {
      this.binaries.set(path, b);
    }
    this.paths.set(sortSubjectPaths([...texts.keys(), ...binaries.keys()]));
    this.current.set(SUBJECT_MAIN_FILE);
    const main = this.texts.get(SUBJECT_MAIN_FILE)!;
    if (this.view) {
      this.view.setState(main);
    } else {
      this.view = new EditorView({ parent: this.editorHost().nativeElement, state: main });
    }
  }

  private replaceText(path: string, text: string): void {
    if (!this.editable()) {
      return;
    }
    this.select(path);
    this.view?.dispatch({ changes: { from: 0, to: this.view.state.doc.length, insert: text } });
  }

  /** A file changed (typed, added, uploaded): compiled again, saved a moment later. */
  private changed(path: string): void {
    this.scheduleCompile();
    if (this.versions() !== undefined) {
      this.versionsStale.set(true);
    }
    if (!this.stored()) {
      this.saveDraft();
      return;
    }
    this.dirty.add(path);
    this.saveState.set('dirty');
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => void this.flush().catch(() => undefined), SAVE_DELAY_MS);
  }

  private async saveDirty(): Promise<void> {
    const examId = this.examId();
    if (examId === undefined || this.dirty.size === 0 || !this.editable()) {
      return;
    }
    this.saveState.set('saving');
    try {
      while (this.dirty.size > 0) {
        const path = this.dirty.values().next().value as string;
        this.dirty.delete(path);
        try {
          this.subject.set(await this.write(examId, path, this.subject()?.revision));
        } catch (e) {
          this.dirty.add(path);
          throw e;
        }
      }
      this.saveState.set('saved');
      this.saveError.set(undefined);
    } catch (e) {
      this.onSaveError(e);
      throw e;
    }
  }

  private write(examId: number, path: string, revision: number | undefined): Promise<ExamSubject> {
    const binary = this.binaries.get(path);
    return this.subjects.writeFile(examId, path, binary ? binary.data : this.text(path), revision);
  }

  /** Creates the subject of a new exam and writes every file. */
  private async storeSubject(examId: number): Promise<void> {
    let subject = await this.subjects.create(examId);
    for (const path of this.paths()) {
      subject = await this.write(examId, path, subject.revision);
    }
    await this.subjects.unlock(examId);
  }

  private onSaveError(e: unknown): void {
    const error = toSubjectApiError(e);
    this.saveState.set('error');
    this.saveError.set(error.message);
    if (error.code === 'REVISION_CONFLICT') {
      this.conflict.set(true);
      this.applyEditable();
    } else if (error.code === 'LOCKED') {
      // the lock expired and another teacher took it: show who, read-only
      void this.refreshSubject();
    } else if (error.code === 'STORAGE_UNAVAILABLE') {
      this.storageUnavailable.set(true);
    }
  }

  private async refreshSubject(): Promise<void> {
    const examId = this.examId();
    if (examId === undefined) {
      return;
    }
    try {
      this.subject.set(await this.subjects.find(examId));
      this.applyEditable();
    } catch {
      // keep the current state, the next action will tell
    }
  }

  private async renewLock(): Promise<void> {
    const examId = this.examId();
    if (examId === undefined || !this.subject()?.lock.mine || this.conflict()) {
      return;
    }
    try {
      this.subject.set(await this.subjects.lock(examId));
    } catch (e) {
      this.onSaveError(e);
    }
  }

  private async loadStored(examId: number): Promise<void> {
    this.loading.set(true);
    this.applyEditable();
    try {
      let subject = await this.subjects.find(examId);
      if (subject === undefined) {
        this.noSubject.set(true);
        this.subject.set(undefined);
        const draft = this.storage.retrieve(this.examDraftKey(examId)) as unknown;
        this.hasLocalDraft.set(draft !== null && draft !== undefined);
        this.setProject(this.hasLocalDraft() ? this.loadDraft(this.examDraftKey(examId)) : new Map(), new Map());
        void this.compile();
        return;
      }
      this.noSubject.set(false);
      if (!subject.lock.held || subject.lock.mine) {
        try {
          subject = await this.subjects.lock(examId);
        } catch (e) {
          // taken by someone else between the two calls: read-only
          if (!(e instanceof SubjectApiError && e.code === 'LOCKED')) {
            throw e;
          }
          subject = (await this.subjects.find(examId)) ?? subject;
        }
      }
      const { texts, binaries } = await this.readFiles(examId, subject);
      this.subject.set(subject);
      this.conflict.set(false);
      this.saveState.set('saved');
      this.saveError.set(undefined);
      this.setProject(texts, binaries);
      void this.compile();
    } catch (e) {
      const error = toSubjectApiError(e);
      this.storageUnavailable.set(error.code === 'STORAGE_UNAVAILABLE');
      this.showError('typstsubject.storage.loadFailed', error);
    } finally {
      this.loading.set(false);
      this.applyEditable();
    }
  }

  private async readFiles(
    examId: number,
    subject: ExamSubject,
  ): Promise<{ texts: Map<string, string>; binaries: Map<string, BinaryFile> }> {
    const texts = new Map<string, string>();
    const binaries = new Map<string, BinaryFile>();
    await Promise.all(
      subject.files.map(async f => {
        if (isSubjectTextFile(f.path)) {
          texts.set(f.path, await this.subjects.readText(examId, f.path));
        } else {
          binaries.set(f.path, { key: f.sha256, data: await this.subjects.readBytes(examId, f.path) });
        }
      }),
    );
    return { texts, binaries };
  }

  private compilerFiles(): { path: string; content: string }[] {
    return [...this.texts.keys()].map(path => ({ path: toCompilerPath(path), content: this.text(path) }));
  }

  private compilerBinaries(): TypstBinaryFile[] {
    return [...this.binaries].map(([path, b]) => ({ path: toCompilerPath(path), key: b.key, data: b.data }));
  }

  private scheduleCompile(delay = COMPILE_DELAY_MS): void {
    clearTimeout(this.compileTimer);
    this.compileTimer = setTimeout(() => void this.compile(), delay);
  }

  private async compile(): Promise<void> {
    const seq = ++this.sequence;
    this.compiling.set(true);
    try {
      const res = await this.compiler.compile(this.compilerFiles(), {
        withPdf: true,
        binaries: this.compilerBinaries(),
        inputs: { [DIAGRAM_INPUT]: this.diagrams.input() },
      });
      this.applyResult(res, seq);
      this.failure.set(undefined);
      if (res.ok && seq === this.sequence) {
        await this.renderDiagrams(res, seq);
      }
    } catch (e) {
      if (seq === this.sequence) {
        this.failure.set(e instanceof Error ? e.message : String(e));
      }
    } finally {
      if (seq === this.sequence) {
        this.compiling.set(false);
      }
    }
  }

  /** Has the new diagrams rendered, then compiles again with their SVG. */
  private async renderDiagrams(res: TypstCompileResponse, seq: number): Promise<void> {
    this.diagramRequests = parseDiagramRequests(res.diagrams);
    const missing = this.diagrams.missing(this.diagramRequests);
    this.diagramsPending.set(missing.length);
    this.diagramErrors.set(this.diagrams.errors(this.diagramRequests));
    if (missing.length === 0) {
      return;
    }
    const rendered = await this.diagrams.ensure(missing);
    if (seq !== this.sequence) {
      return;
    }
    this.diagramsPending.set(0);
    this.diagramErrors.set(this.diagrams.errors(this.diagramRequests));
    if (rendered) {
      this.scheduleCompile(0);
    }
  }

  private applyResult(res: TypstCompileResponse, seq: number): void {
    if (seq !== this.sequence) {
      return;
    }
    this.result.set(res);
    this.showDiagnosticsInEditor(res.diagnostics);
    if (!res.ok) {
      // keep the last good preview and summary: the teacher is typing
      return;
    }
    try {
      this.layout.set(buildLayout(parseZoneMetadata(res.zones)));
      this.layoutError.set(undefined);
    } catch (e) {
      this.layout.set(undefined);
      this.layoutError.set(e instanceof TypstZoneError ? e.message : String(e));
    }
    if (res.pdf) {
      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
      }
      this.objectUrl = URL.createObjectURL(new Blob([res.pdf], { type: 'application/pdf' }));
      // URL created here from the compiled document: safe to show in the frame
      this.pdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl));
    }
  }

  private showDiagnosticsInEditor(diagnostics: TypstDiagnostic[]): void {
    if (!this.view) {
      return;
    }
    const cm: CmDiagnostic[] = diagnostics
      .filter(d => this.pathOf(d) === this.current() && d.line !== undefined)
      .map(d => {
        const from = this.offset(d.line!, d.column ?? 1);
        const to = Math.max(from, this.offset(d.endLine ?? d.line!, d.endColumn ?? (d.column ?? 1) + 1));
        return { from, to, severity: d.severity, message: [d.message, ...d.hints].join('\n') };
      });
    this.view.dispatch(setDiagnostics(this.view.state, cm));
  }

  /** Offset in the document of a 1-based line and column, kept inside the document. */
  private offset(line: number, column: number): number {
    const doc = this.view!.state.doc;
    const l = doc.line(Math.min(Math.max(line, 1), doc.lines));
    return Math.min(l.from + Math.max(column - 1, 0), l.to);
  }

  private draftKey(): string {
    return `typstSubjectDraft_${this.courseId() ?? 0}`;
  }

  private examDraftKey(examId: number): string {
    return `typstSubjectDraft_exam_${examId}`;
  }

  /** Text files of a draft; a T25b draft is the main file alone. */
  private loadDraft(key: string): Map<string, string> {
    const draft: unknown = this.storage.retrieve(key);
    const texts = new Map<string, string>();
    if (typeof draft === 'string' && draft.trim() !== '') {
      texts.set(SUBJECT_MAIN_FILE, draft);
    } else if (typeof draft === 'object' && draft !== null && (draft as StoredDraft).format === 2) {
      for (const [path, content] of Object.entries((draft as StoredDraft).files)) {
        const p = normalizeSubjectPath(path);
        if (p !== undefined && isSubjectTextFile(p) && typeof content === 'string') {
          texts.set(p, content);
        }
      }
    }
    if (!texts.has(SUBJECT_MAIN_FILE) || texts.get(SUBJECT_MAIN_FILE)!.trim() === '') {
      texts.set(SUBJECT_MAIN_FILE, SUBJECT_STARTER);
    }
    return texts;
  }

  private saveDraft(): void {
    if (!this.stored()) {
      this.saveDraftTo(this.draftKey());
    }
  }

  private saveDraftTo(key: string): void {
    const draft: StoredDraft = { format: 2, files: {} };
    for (const path of this.texts.keys()) {
      draft.files[path] = this.text(path);
    }
    try {
      this.storage.store(key, draft);
    } catch (e) {
      // full storage: the subject stays in the editor, it can still be downloaded
      console.warn('Typst subject draft not saved', e);
    }
  }

  private updateTitle(): void {
    const key = this.stored() ? 'typstsubject.storage.pageTitle' : 'typstsubject.pageTitle';
    firstValueFrom(this.translate.get(key, { courseName: this.courseName(), examName: this.examName() }))
      .then(t => this.titleService.setTitle(t))
      .catch(() => undefined);
  }

  private showError(key: string, e: unknown): void {
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant(key),
      detail: e instanceof Error ? e.message : String(e),
      life: 10000,
    });
  }

  /** Creates the exam from its template and zones, stores the subject with it and opens the exam. */
  private async createFrom(
    courseId: number,
    pdf: Uint8Array,
    zones: unknown,
    afterCreate?: (examId: number) => Promise<unknown>,
  ): Promise<void> {
    const layout = buildLayout(parseZoneMetadata(zones));
    const examId = await this.examFromSubject.create({
      courseId,
      name: this.examName().trim(),
      pdf,
      plan: planExam(layout, this.preferences.getPreferenceForQuestion()),
      afterCreate,
    });
    try {
      await this.storeSubject(examId);
      this.storage.clear(this.draftKey());
      await this.router.navigateByUrl(`/exam/${examId}`);
    } catch (e) {
      // the exam exists: keep the subject in this browser for this exam and offer to store it again
      console.warn('Typst subject not stored with the exam', e);
      this.saveDraftTo(this.examDraftKey(examId));
      this.storage.clear(this.draftKey());
      await this.router.navigateByUrl(`/exam/${examId}/subject`);
    }
  }
}
