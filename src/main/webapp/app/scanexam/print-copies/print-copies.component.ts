import { Component, OnInit, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { ExamEdition, ExamPrintService } from '../typst/exam-print.service';

/**
 * Prints the copies of an exam written in Typst (T25d, ADR 0004): new print run or a previous one again. The PDF is
 * assembled in the browser from the template of the exam; each page carries its code `CE1|print run|copy|page`.
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

  private readonly printService = inject(ExamPrintService);
  private template?: Uint8Array;

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
      const edition = await this.printService.createEdition(this.examId(), this.copies(), pages);
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
      const [editions, template] = await Promise.all([
        this.printService.listEditions(this.examId()),
        this.printService.templatePdf(this.templateId()),
      ]);
      this.editions.set(editions);
      this.template = template;
      this.pages.set(await this.printService.pageCount(template));
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : String(e));
    }
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
    if (!this.template) {
      throw new Error('template not loaded');
    }
    if (edition.pagesPerCopy !== this.pages()) {
      // the template changed since this print run: its codes would no longer match the pages
      throw new Error(`print run ${edition.id}: ${edition.pagesPerCopy} pages per copy, template ${this.pages()}`);
    }
    // the worker receives a copy: the template stays usable for another print run
    const pdf = await this.printService.assemble(this.template.slice(), edition, p => this.progress.set(p));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
    a.download = `${this.examName().trim() || 'exam'}-tirage-${edition.id}.pdf`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 10000);
  }
}
