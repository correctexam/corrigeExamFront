import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { IGradedComment } from 'app/entities/graded-comment/graded-comment.model';
import { GradedCommentService } from 'app/entities/graded-comment/service/graded-comment.service';
import { IQuestion } from 'app/entities/question/question.model';
import { StudentResponseService } from 'app/entities/student-response/service/student-response.service';
import { computeQuestionNote, isStoredInHundredths } from '../grading/question-grading';
import { regradedQcmOption } from '../grading/qcm-option';

export interface QcmRegradeReport {
  /** Options whose percentage or description changed. */
  options: number;
  /** Answers whose note changed. */
  responses: number;
}

/** Answers read per request (the back-end default page size). */
const PAGE_SIZE = 500;

/**
 * Applies a new valid expression (grading DSL, ADR 0002, or former expression) to the QCM already corrected:
 * values every option again, then the note of every answer of the question. New answers named by the DSL, and the
 * `void` option of the copies without any ticked box, are created by the next autocorrection.
 */
@Injectable({ providedIn: 'root' })
export class QcmRegradeService {
  private readonly gradedCommentService = inject(GradedCommentService);
  private readonly studentResponseService = inject(StudentResponseService);

  /** Throws InvalidQcmDslError when the expression is an invalid DSL (nothing is changed then). */
  async regrade(question: IQuestion): Promise<QcmRegradeReport> {
    const report: QcmRegradeReport = { options: 0, responses: 0 };
    const options = (await firstValueFrom(this.gradedCommentService.query({ questionId: question.id }))).body ?? [];

    // Computed before any request, so that an invalid DSL changes nothing
    const regraded = options.map(o => ({ option: o, fields: regradedQcmOption(question, o.text) }));
    const byId = new Map<number, IGradedComment>();
    for (const { option, fields } of regraded) {
      let current = option;
      if (option.description !== fields.description || option.grade !== fields.grade) {
        const updated = { ...option, description: fields.description, grade: fields.grade };
        current = (await firstValueFrom(this.gradedCommentService.update(updated))).body ?? updated;
        report.options++;
      }
      if (current.id !== undefined) {
        byId.set(current.id, current);
      }
    }
    if (report.options === 0) {
      return report;
    }

    for (let page = 0; ; page++) {
      const answers =
        (await firstValueFrom(this.studentResponseService.query({ questionId: question.id, page, size: PAGE_SIZE }))).body ?? [];
      for (const answer of answers) {
        const comments = (answer.gradedcomments ?? []).map(c => (c.id !== undefined ? (byId.get(c.id) ?? c) : c));
        const graded = computeQuestionNote(question, { gradedComments: comments, noteSteps: question.point! * question.step! });
        if (graded === undefined || answer.id === undefined) {
          continue;
        }
        const note = isStoredInHundredths(graded.rule) ? graded.note * 100 : graded.note;
        if (note !== answer.note) {
          await firstValueFrom(this.studentResponseService.partialUpdate({ ...answer, note }));
          report.responses++;
        }
      }
      if (answers.length < PAGE_SIZE) {
        return report;
      }
    }
  }
}
