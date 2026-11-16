import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'ngx-webstorage';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { EditorState } from '@codemirror/state';
import { EditorView, highlightActiveLine, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { Diagnostic as CmDiagnostic, lintGutter, setDiagnostics } from '@codemirror/lint';

import { CourseService } from 'app/entities/course/service/course.service';
import { PreferenceService } from '../preference-page/preference.service';
import { TypstCompilerService } from '../typst/typst-compiler.service';
import { TypstCompileResponse, TypstDiagnostic } from '../typst/typst-worker.protocol';
import { buildLayout, GeneratedLayout, parseZoneMetadata, TypstZoneError } from '../typst/typst-zones';
import { checkLayout, LayoutIssue, planExam } from '../typst/exam-from-subject';
import { ExamFromSubjectService } from '../typst/exam-from-subject.service';
import { SUBJECT_SNIPPETS, SUBJECT_STARTER } from './subject-starter';

const MAIN = '/main.typ';
const COMPILE_DELAY_MS = 600;

/**
 * Writes an exam subject in Typst and creates the exam from it (T25b, ADR 0004): live preview of the PDF to print,
 * diagnostics in the editor, summary of the questions and zones found, then creation of the exam with its template,
 * zones and questions. The subject is kept as a draft in this browser until it is stored with the exam (T25c).
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

  readonly courseId = signal<number | undefined>(undefined);
  readonly courseName = signal('');
  readonly examName = signal('');
  readonly compiling = signal(false);
  readonly creating = signal(false);
  readonly result = signal<TypstCompileResponse | undefined>(undefined);
  readonly layout = signal<GeneratedLayout | undefined>(undefined);
  readonly layoutError = signal<string | undefined>(undefined);
  readonly failure = signal<string | undefined>(undefined);
  readonly pdfUrl = signal<SafeResourceUrl | undefined>(undefined);

  readonly diagnostics = computed<TypstDiagnostic[]>(() => this.result()?.diagnostics ?? []);
  readonly issues = computed<LayoutIssue[]>(() => {
    const layout = this.layout();
    return layout ? checkLayout(layout) : [];
  });
  readonly canCreate = computed(
    () =>
      !this.creating() &&
      this.examName().trim() !== '' &&
      this.result()?.ok === true &&
      this.layout() !== undefined &&
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
  private readonly preferences = inject(PreferenceService);
  private readonly examFromSubject = inject(ExamFromSubjectService);
  private readonly destroyRef = inject(DestroyRef);

  private view?: EditorView;
  private objectUrl?: string;
  private timer?: ReturnType<typeof setTimeout>;
  /** Only the answer to the last request is shown: an older compilation may finish later. */
  private sequence = 0;

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const id = Number(params.get('courseid'));
      if (Number.isInteger(id) && id > 0) {
        this.courseId.set(id);
        this.courseService.find(id).subscribe(c => {
          this.courseName.set(c.body?.name ?? '');
          this.updateTitle();
        });
      }
    });
    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateTitle());
  }

  ngAfterViewInit(): void {
    this.view = new EditorView({
      parent: this.editorHost().nativeElement,
      state: EditorState.create({
        doc: this.loadDraft(),
        extensions: [
          lineNumbers(),
          history(),
          highlightActiveLine(),
          lintGutter(),
          EditorView.lineWrapping,
          keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
          EditorView.updateListener.of(update => {
            if (update.docChanged) {
              this.saveDraft();
              this.scheduleCompile();
            }
          }),
        ],
      }),
    });
    void this.compile();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    this.view?.destroy();
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }

  source(): string {
    return this.view?.state.doc.toString() ?? '';
  }

  insertSnippet(code: string): void {
    if (!this.view) {
      return;
    }
    const { from, to } = this.view.state.selection.main;
    this.view.dispatch({ changes: { from, to, insert: code }, selection: { anchor: from + code.length } });
    this.view.focus();
  }

  goTo(d: TypstDiagnostic): void {
    if (!this.view || d.line === undefined || !this.isMainFile(d)) {
      return;
    }
    const pos = this.offset(d.line, d.column ?? 1);
    this.view.dispatch({ selection: { anchor: pos }, scrollIntoView: true });
    this.view.focus();
  }

  resetToStarter(): void {
    this.replaceSource(SUBJECT_STARTER);
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
        .then(text => this.replaceSource(text))
        .catch((e: unknown) => this.showError('typstsubject.openFailed', e));
    }
    input.value = '';
  }

  async createExam(): Promise<void> {
    const courseId = this.courseId();
    if (!this.canCreate() || courseId === undefined) {
      return;
    }
    this.creating.set(true);
    try {
      // compile again: the exam must match exactly the subject currently written
      const res = await this.compiler.compile([{ path: MAIN, content: this.source() }], { withPdf: true });
      if (!res.ok || !res.pdf) {
        this.applyResult(res, ++this.sequence);
        return;
      }
      const layout = buildLayout(parseZoneMetadata(res.zones));
      const examId = await this.examFromSubject.create({
        courseId,
        name: this.examName().trim(),
        pdf: res.pdf,
        plan: planExam(layout, this.preferences.getPreferenceForQuestion()),
      });
      this.storage.clear(this.draftKey());
      await this.router.navigateByUrl(`/exam/${examId}`);
    } catch (e) {
      this.showError('typstsubject.createFailed', e);
    } finally {
      this.creating.set(false);
    }
  }

  backToCourse(): void {
    const id = this.courseId();
    if (id !== undefined) {
      void this.router.navigateByUrl(`/course/${id}`);
    }
  }

  isMainFile(d: TypstDiagnostic): boolean {
    return d.path === MAIN || d.path === '';
  }

  private replaceSource(text: string): void {
    this.view?.dispatch({ changes: { from: 0, to: this.view.state.doc.length, insert: text } });
  }

  private scheduleCompile(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.compile(), COMPILE_DELAY_MS);
  }

  private async compile(): Promise<void> {
    const seq = ++this.sequence;
    this.compiling.set(true);
    try {
      const res = await this.compiler.compile([{ path: MAIN, content: this.source() }], { withPdf: true });
      this.applyResult(res, seq);
      this.failure.set(undefined);
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
      .filter(d => this.isMainFile(d) && d.line !== undefined)
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

  private loadDraft(): string {
    const draft: unknown = this.storage.retrieve(this.draftKey());
    return typeof draft === 'string' && draft.trim() !== '' ? draft : SUBJECT_STARTER;
  }

  private saveDraft(): void {
    try {
      this.storage.store(this.draftKey(), this.source());
    } catch (e) {
      // full storage: the subject stays in the editor, it can still be downloaded
      console.warn('Typst subject draft not saved', e);
    }
  }

  private updateTitle(): void {
    this.translate.get('typstsubject.pageTitle', { courseName: this.courseName() }).subscribe(t => this.titleService.setTitle(t));
  }

  private showError(key: string, e: unknown): void {
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant(key),
      detail: e instanceof Error ? e.message : String(e),
      life: 10000,
    });
  }
}
