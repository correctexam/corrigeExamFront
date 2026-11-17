import { Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { CodeReport } from '../typst/page-codes';
import { CheckProgress, PageCodeCheckService } from '../typst/page-code-check.service';

/** At most this many page numbers in a list; the count is always given. */
const LIST_MAX = 40;

/**
 * Page codes of the scan, before the alignment (T25d2, ADR 0004): shown for the exams printed from CorrectExam
 * (at least one print run). Reads the codes, reports what is mixed, upside down, missing, doubled, foreign or
 * unreadable, and puts the pages back in order in the local cache.
 */
@Component({
  selector: 'jhi-page-codes-check',
  standalone: true,
  templateUrl: './page-codes-check.component.html',
  styleUrls: ['./page-codes-check.component.scss'],
  imports: [TranslateDirective, TranslatePipe],
})
export class PageCodesCheckComponent implements OnInit {
  readonly examId = input.required<number>();
  /** Emitted after the pages were put back in order. */
  readonly reordered = output<void>();

  readonly visible = signal(false);
  readonly busy = signal<'reading' | 'ordering' | undefined>(undefined);
  readonly progress = signal<CheckProgress | undefined>(undefined);
  readonly report = signal<CodeReport | undefined>(undefined);
  readonly aligned = signal(0);
  readonly error = signal<string | undefined>(undefined);

  readonly incomplete = computed(() => this.report()?.copies.filter(c => c.missing.length > 0) ?? []);
  readonly blanks = computed(() => this.report()?.order.filter(s => s.kind === 'blank').length ?? 0);
  readonly complete = computed(() => (this.report()?.copies.length ?? 0) - this.incomplete().length);

  private readonly service = inject(PageCodeCheckService);

  ngOnInit(): void {
    this.service
      .editions(this.examId())
      .then(editions => this.visible.set(editions.length > 0))
      .catch(() => this.visible.set(false));
  }

  list(pages: number[]): string {
    return pages.length > LIST_MAX ? `${pages.slice(0, LIST_MAX).join(', ')}…` : pages.join(', ');
  }

  async check(): Promise<void> {
    await this.run('reading', async () => {
      this.report.set(await this.service.check(this.examId(), p => this.progress.set(p)));
      this.aligned.set(await this.service.alignedPages(this.examId()));
    });
  }

  async reorder(): Promise<void> {
    const report = this.report();
    if (!report || report.inOrder) {
      return;
    }
    await this.run('ordering', async () => {
      await this.service.apply(this.examId(), report, p => this.progress.set(p));
      this.reordered.emit();
    });
    // the new state of the scan
    await this.check();
  }

  private async run(kind: 'reading' | 'ordering', action: () => Promise<void>): Promise<void> {
    this.busy.set(kind);
    this.error.set(undefined);
    try {
      await action();
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : String(e));
    } finally {
      this.busy.set(undefined);
      this.progress.set(undefined);
    }
  }
}
