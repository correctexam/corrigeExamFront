/* eslint-disable no-console */
import { Pipe, PipeTransform } from '@angular/core';
import { IGradedComment } from 'app/entities/graded-comment/graded-comment.model';
import { ITextComment } from 'app/entities/text-comment/text-comment.model';
import { PreferenceService } from './preference-page/preference.service';
import { IHybridGradedComment } from 'app/entities/hybrid-graded-comment/hybrid-graded-comment.model';

@Pipe({
  name: 'commentsort',
})
export class CommentSortPipe implements PipeTransform {
  constructor(public preferenceService: PreferenceService) {}

  transform(array: (IHybridGradedComment | ITextComment | IGradedComment)[] | undefined, examId_qId: string): any[] | null {
    if (array === undefined || !Array.isArray(array) || array.length === 0) {
      return [];
    }
    const m = this.preferenceService.getCommentSort4Question(examId_qId);
    if (m.size > 0) {
      // eslint-disable-next-line arrow-body-style
      const r = array.sort(
        (a: IHybridGradedComment | ITextComment | IGradedComment, b: IHybridGradedComment | ITextComment | IGradedComment) => {
          if (m.has(a.id!) && m.has(b.id!)) {
            return m.get(a.id!)! - m.get(b.id!)!;
          } else if (m.has(a.id!)) {
            return -1;
          } else if (m.has(b.id!)) {
            return 1;
          } else {
            return 0;
          }
        },
      );
      if (m.size < array.length) {
        for (let i = m.size; i < array.length; i++) {
          m.set(array[i].id!, i);
        }
        this.preferenceService.saveCommentSort4Question(examId_qId, m);
      } else if (m.size > array.length) {
        this.preferenceService.saveCommentSort4Question(examId_qId, new Map());
      }
      return r;
    } else {
      array.forEach((e, index) => {
        m.set(index, e.id!);
      });
      this.preferenceService.saveCommentSort4Question(examId_qId, m);
      return array;
    }
  }
}
