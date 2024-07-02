/* eslint-disable no-console */
import { Pipe, PipeTransform, Signal } from '@angular/core';
import { IGradedComment } from 'app/entities/graded-comment/graded-comment.model';
import { ITextComment } from 'app/entities/text-comment/text-comment.model';
import { PreferenceService } from './preference-page/preference.service';
import { IHybridGradedComment } from 'app/entities/hybrid-graded-comment/hybrid-graded-comment.model';

@Pipe({
  name: 'commentsort',
  pure: false,
  standalone: true,
})
export class CommentSortPipe implements PipeTransform {
  constructor(public preferenceService: PreferenceService) {}

  transform(
    array: (Signal<IHybridGradedComment> | Signal<ITextComment> | Signal<IGradedComment>)[] | undefined,
    examId: string,
    qId: number,
  ): any[] {
    const examId_qId = examId + '_' + qId;
    if (array === undefined || !Array.isArray(array) || array.length === 0) {
      return [];
    }
    const m = this.preferenceService.getCommentSort4Question(examId_qId);
    if (m.size > 0) {
      // eslint-disable-next-line arrow-body-style
      const r = array.sort(
        (
          a: Signal<IHybridGradedComment> | Signal<ITextComment> | Signal<IGradedComment>,
          b: Signal<IHybridGradedComment> | Signal<ITextComment> | Signal<IGradedComment>,
        ) => {
          if (m.has(a().id!) && m.has(b().id!)) {
            return m.get(a().id!)! - m.get(b().id!)!;
          } else if (m.has(a().id!)) {
            return -1;
          } else if (m.has(b().id!)) {
            return 1;
          } else {
            return 0;
          }
        },
      );
      if (m.size < array.length) {
        for (let i = m.size; i < array.length; i++) {
          m.set(array[i]().id!, i);
        }
        this.preferenceService.saveCommentSort4Question(examId_qId, m);
      } else if (m.size > array.length) {
        this.preferenceService.saveCommentSort4Question(examId_qId, new Map());
      }
      return r.map(e => e());
    } else {
      array.forEach((e, index) => {
        m.set(e().id!, index);
      });
      this.preferenceService.saveCommentSort4Question(examId_qId, m);
      return array.map(e => e());
    }
  }
}
