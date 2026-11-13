import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SelectButton } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';

import { StudentAccess } from 'app/entities/enumerations/student-access.model';
import { IExam } from 'app/entities/exam/exam.model';
import { ExamService } from 'app/entities/exam/service/exam.service';

interface AccessOption {
  value: StudentAccess;
  labelKey: string;
  tooltipKey: string;
  icon: string;
}

/** Order of the choices, from the most restricted to the most open. */
const OPTIONS: AccessOption[] = [
  {
    value: StudentAccess.HIDDEN,
    labelKey: 'scanexam.studentaccess_hidden',
    tooltipKey: 'scanexam.studentaccess_hiddenTooltip',
    icon: 'pi pi-eye-slash',
  },
  {
    value: StudentAccess.SHEET,
    labelKey: 'scanexam.studentaccess_sheet',
    tooltipKey: 'scanexam.studentaccess_sheetTooltip',
    icon: 'pi pi-file',
  },
  {
    value: StudentAccess.GRADED,
    labelKey: 'scanexam.studentaccess_graded',
    tooltipKey: 'scanexam.studentaccess_gradedTooltip',
    icon: 'pi pi-check-circle',
  },
];

/**
 * What the students of the exam see in the student portal /my (ADR 0003): nothing, the scanned sheet, or the corrected
 * sheet with its grade. The links sent by e-mail (/copie/{uuid}) are not affected.
 */
@Component({
  selector: 'jhi-student-access-selector',
  standalone: true,
  imports: [FormsModule, SelectButton, TooltipModule, TranslateDirective, TranslatePipe],
  template: `
    <div class="flex flex-column align-items-center gap-2 mt-3" data-cy="studentAccessSelector">
      <span class="font-bold" [translate]="'scanexam.studentaccess_title'"></span>
      <p-selectbutton
        [options]="options"
        optionValue="value"
        [allowEmpty]="false"
        [disabled]="saving()"
        [ngModel]="access()"
        (ngModelChange)="change($event)"
      >
        <ng-template #item let-option>
          <span [pTooltip]="option.tooltipKey | translate" tooltipPosition="bottom" [tooltipZIndex]="'3000'">
            <i [class]="option.icon"></i>&nbsp;{{ option.labelKey | translate }}
          </span>
        </ng-template>
      </p-selectbutton>
      <small class="text-color-secondary">{{ helpKey() | translate }}</small>
    </div>
  `,
})
export class StudentAccessSelectorComponent {
  readonly exam = input.required<IExam>();
  /** Emitted with the exam returned by the server once the access changed. */
  readonly changed = output<IExam>();

  protected readonly options = OPTIONS;
  protected readonly saving = signal(false);
  protected readonly access = computed(() => this.chosen() ?? this.exam().studentAccess ?? StudentAccess.SHEET);
  protected readonly helpKey = computed(() => OPTIONS.find(o => o.value === this.access())!.tooltipKey);

  /** Value chosen in this component, until the exam input reflects it. */
  private readonly chosen = signal<StudentAccess | undefined>(undefined);
  private readonly examService = inject(ExamService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  async change(access: StudentAccess): Promise<void> {
    const examId = this.exam().id;
    if (examId === undefined || access === this.access()) {
      return;
    }
    const previous = this.access();
    this.chosen.set(access);
    this.saving.set(true);
    try {
      const res = await firstValueFrom(this.examService.updateStudentAccess(examId, access));
      if (res.body) {
        // The parent updates its exam with the answer: the input becomes the reference again
        this.changed.emit(res.body);
        this.chosen.set(undefined);
      }
    } catch {
      this.chosen.set(previous);
      this.messageService.add({ severity: 'error', summary: this.translate.instant('scanexam.studentaccess_error') });
    } finally {
      this.saving.set(false);
    }
  }
}
