import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { ExamEdition, ExamPrintService } from '../typst/exam-print.service';
import { ExamVersion, ExamVersionsService } from '../typst/exam-versions.service';

/**
 * Prints the copies of an exam written in Typst (T25d, ADR 0004): new print run or a previous one again. The PDF is
 * assembled in the browser from the template of the exam; each page carries its code `CE1|print run|copy|page`.
 * With several versions (T25e, ADR 0005), copy c is printed from version (c − 1) mod K; the first print run of
 * several versions freezes the versions of the exam.
 */
@Component({
  selector: 'jhi-print-copies',
  standalone: true,
  templateUrl: './print-copies.component.html',
  styleUrls: ['./print-copies.component.scss'],
  imports: [FormsModule, TranslateDirective, TranslatePipe, DatePipe],
})
export class PrintCopiesComponent implements OnInit {
  readonly examId = input.required<number>();
  readonly templateId = input.required<number>();
  readonly examName = input('');

  readonly editions = signal<ExamEdition[]>([]);
  readonly pages = signal<number | undefined>(undefined);
  readonly copies = signal(30);
  readonly busy = signal(false);
  readonly progress = signal<{ done: number; total: number } | undefined>(undefined);
  readonly error = signal<string | undefined>(undefined);
  /** Stored versions of the exam with their PDF, A first (empty: a single version). */
  readonly versions = signal<ExamVersion[]>([]);
  /** Versions used by the next print run. */
  readonly versionCount = signal(1);
  readonly versionChoices = computed(() => this.versions().map((_, i) => i + 1));
  /** Letters of the versions of the next print run, in the order the copies take them (A, B, C, A…). */
  readonly versionLetters = computed(() =>
    Array.from({ length: Math.max(1, this.versionCount()) + 1 }, (_, i) => this.versions()[i % this.versionCount()]?.label ?? 'A').join(
      ', ',
    ),
  );

  private readonly printService = inject(ExamPrintService);
  private readonly versionsService = inject(ExamVersionsService);
  private template?: Uint8Array;
  private readonly versionPdfs = new Map<number, Uint8Array>();

  ngOnInit(): void {
    void this.load();
  }

  validCopies(): boolean {
    const n = this.copies();
    return Number.isInteger(n) && n >= 1 && n <= 2000;
  }

  async printNew(): Promise<void> {
    const pages = this.pages();
    if (!this.validCopies() || pages === undefined || this.busy()) {
      return;
    }
    await this.run(async () => {
      const edition = await this.printService.createEdition(this.examId(), this.copies(), pages, this.versionCount());
      this.editions.set([...this.editions(), edition]);
      await this.download(edition);
    });
  }

  async printAgain(edition: ExamEdition): Promise<void> {
    if (!this.busy()) {
      await this.run(() => this.download(edition));
    }
  }

  private async load(): Promise<void> {
    try {
      const [editions, template, versions] = await Promise.all([
        this.printService.listEditions(this.examId()),
        this.printService.templatePdf(this.templateId()),
        this.loadVersions(),
      ]);
      this.editions.set(editions);
      this.template = template;
      this.versions.set(versions);
      this.versionCount.set(Math.max(1, versions.length));
      this.pages.set(await this.printService.pageCount(template));
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : String(e));
    }
  }

  /** Versions A, B… that have their PDF; none when the server has no versions for this exam (or no storage). */
  private async loadVersions(): Promise<ExamVersion[]> {
    let stored: ExamVersion[];
    try {
      stored = await this.versionsService.list(this.examId());
    } catch (e) {
      // printing with a single version stays possible
      console.warn('Versions of the exam not available', e);
      return [];
    }
    const usable: ExamVersion[] = [];
    for (const v of [...stored].sort((a, b) => a.index - b.index)) {
      if (v.index !== usable.length || !v.hasPdf) {
        break;
      }
      usable.push(v);
    }
    return usable.length > 1 ? usable : [];
  }

  /** Templates of a print run: the template of the exam, or the PDF of each of its versions. */
  private async templates(edition: ExamEdition): Promise<{ templates: Uint8Array[]; labels?: string[] }> {
    const k = edition.versions ?? 1;
    if (k <= 1) {
      if (!this.template) {
        throw new Error('template not loaded');
      }
      // the worker receives a copy: the template stays usable for another print run
      return { templates: [this.template.slice()] };
    }
    const versions = this.versions().slice(0, k);
    if (versions.length < k) {
      throw new Error(`print run ${edition.id}: ${k} versions, ${versions.length} available`);
    }
    if (versions.some(v => v.pages !== edition.pagesPerCopy)) {
      throw new Error(`print run ${edition.id}: ${edition.pagesPerCopy} pages per copy, versions ${versions[0].pages}`);
    }
    const templates: Uint8Array[] = [];
    for (const v of versions) {
      let pdf = this.versionPdfs.get(v.index);
      if (!pdf) {
        pdf = await this.versionsService.pdf(this.examId(), v.index);
        this.versionPdfs.set(v.index, pdf);
      }
      templates.push(pdf.slice());
    }
    return { templates, labels: versions.map(v => v.label) };
  }

  private async run(action: () => Promise<void>): Promise<void> {
    this.busy.set(true);
    this.error.set(undefined);
    try {
      await action();
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : String(e));
    } finally {
      this.busy.set(false);
      this.progress.set(undefined);
    }
  }

  private async download(edition: ExamEdition): Promise<void> {
    if (edition.pagesPerCopy !== this.pages()) {
      // the template changed since this print run: its codes would no longer match the pages
      throw new Error(`print run ${edition.id}: ${edition.pagesPerCopy} pages per copy, template ${this.pages()}`);
    }
    const { templates, labels } = await this.templates(edition);
    const pdf = await this.printService.assemble(templates, edition, p => this.progress.set(p), labels);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
    a.download = `${this.examName().trim() || 'exam'}-tirage-${edition.id}.pdf`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 10000);
  }
}
