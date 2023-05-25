/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GradeType } from 'app/entities/enumerations/grade-type.model';
import { IGradedComment } from 'app/entities/graded-comment/graded-comment.model';
import { GradedCommentService } from 'app/entities/graded-comment/service/graded-comment.service';
import { Question } from 'app/entities/question/question.model';
import { TextCommentService } from 'app/entities/text-comment/service/text-comment.service';
import { ITextComment } from 'app/entities/text-comment/text-comment.model';
import { saveAs } from 'file-saver';
@Component({
  selector: 'jhi-create-comments',

  templateUrl: './create-comments.component.html',
  styleUrls: ['./create-comments.component.scss'],
})
export class CreateCommentsComponent implements OnInit {
  _q?: Question;
  currentTextComment4Question: ITextComment[] | undefined;
  currentGradedComment4Question: IGradedComment[] | undefined;

  questionStep = 0;
  titreCommentaire = '';
  descCommentaire = '';
  noteCommentaire = 0;
  noteSteps = 0;
  blocked = false;
  @Input()
  set question(q: Question | undefined) {
    this._q = q;
    if (q !== undefined) {
      this.noteSteps = q.point! * q.step!;
      this.questionStep = q.step!;
      this.loadComments();
    } else {
      this.currentTextComment4Question = [];
      this.currentGradedComment4Question = [];
      this.questionStep = 0;
      this.titreCommentaire = '';
      this.descCommentaire = '';
      this.noteCommentaire = 0;
      this.noteSteps = 0;
    }
  }

  get question(): Question | undefined {
    return this._q;
  }

  constructor(
    public gradedCommentService: GradedCommentService,
    public textCommentService: TextCommentService,
    public translate: TranslateService
  ) {}
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  loadComments(): void {
    if (this._q!.gradeType === GradeType.DIRECT) {
      this.textCommentService.query({ questionId: this._q!.id }).subscribe(com => {
        this.currentTextComment4Question = com.body!;
      });
    } else {
      this.gradedCommentService.query({ questionId: this._q!.id }).subscribe(com => {
        this.currentGradedComment4Question = com.body!;
      });
    }
  }

  addComment(): void {
    this.blocked = true;
    if (this._q !== undefined && this._q.gradeType === GradeType.DIRECT) {
      const t: ITextComment = {
        questionId: this._q.id,
        text: this.titreCommentaire,
        description: this.descCommentaire,
        // studentResponses : [{id: this.resp?.id}]
      };
      this.textCommentService.create(t).subscribe(e => {
        const currentComment = e.body!;
        this.currentTextComment4Question?.push(currentComment);
        this.titreCommentaire = '';
        this.descCommentaire = '';
        this.blocked = false;
      });
    } else if (this._q !== undefined && this._q.gradeType !== GradeType.DIRECT) {
      const t: IGradedComment = {
        questionId: this._q.id,
        text: this.titreCommentaire,
        description: this.descCommentaire,
        grade: !this.noteCommentaire ? 0 : this.noteCommentaire,
        // studentResponses: [{ id: this.resp?.id }],
      };
      this.blocked = true;
      this.gradedCommentService.create(t).subscribe(e => {
        const currentComment = e.body!;
        this.currentGradedComment4Question?.push(currentComment);
        this.titreCommentaire = '';
        this.descCommentaire = '';
        this.noteCommentaire = 0;
        this.blocked = false;
      });
    }
  }

  updateComment($event: any, l: IGradedComment | ITextComment, graded: boolean): any {
    if (graded) {
      if ((l as IGradedComment).grade === null) {
        (l as IGradedComment).grade = 0;
      }
      this.gradedCommentService.update(l).subscribe(() => {
        const coms = this.currentGradedComment4Question?.filter(c => c.id === l.id!);
        if (coms !== undefined && coms.length > 0) {
          coms[0].grade = (l as any).grade;
        }
      });
    } else {
      this.textCommentService.update(l).subscribe(() => {});
    }
  }

  removeTextComment(comment: ITextComment): void {
    this.currentTextComment4Question = this.currentTextComment4Question!.filter(e => e.id !== comment.id);
    this.textCommentService.delete(comment.id!).subscribe(() =>
      // eslint-disable-next-line no-console
      console.log('delete')
    );
  }

  removeGradedComment(comment: IGradedComment): void {
    this.currentGradedComment4Question = this.currentGradedComment4Question!.filter(e => e.id !== comment.id);
    this.gradedCommentService.delete(comment.id!).subscribe(() => {
      // eslint-disable-next-line no-console
      console.log('delete');
    });
  }

  exportComment(): void {
    if (this._q !== undefined && this._q.gradeType === GradeType.DIRECT) {
      console.error(this.currentTextComment4Question);
      const coms: ITextComment[] = [];
      this.currentTextComment4Question?.forEach(com => {
        const comCopy = { ...com };
        delete comCopy.id;
        coms.push(comCopy);
      });
      return saveAs(new Blob([JSON.stringify(coms, null, 2)], { type: 'JSON' }), 'commentsQ' + this._q.numero! + '.json');
    } else if (this._q !== undefined) {
      console.error(this.currentGradedComment4Question);
      const coms: IGradedComment[] = [];
      this.currentGradedComment4Question?.forEach(com => {
        const comCopy = { ...com };
        delete comCopy.id;
        coms.push(comCopy);
      });
      return saveAs(new Blob([JSON.stringify(coms, null, 2)], { type: 'JSON' }), 'commentsQ' + this._q.numero! + '.json');
    }
  }

  async onUpload(event: any): Promise<void> {
    if (this._q !== undefined && this._q.gradeType === GradeType.DIRECT) {
      const comments = JSON.parse(await event.files[0].text()) as ITextComment[] | undefined | null;
      if (comments !== undefined && comments !== null && comments.length > 0) {
        comments.forEach(com => {
          const t: ITextComment = {
            questionId: this._q!.id,
            text: com.text,
            description: com.description,
          };
          this.textCommentService.create(t).subscribe(e => {
            const currentComment = e.body!;
            this.currentTextComment4Question?.push(currentComment);
            this.titreCommentaire = '';
            this.descCommentaire = '';
            this.blocked = false;
          });
        });
      }
    } else if (this._q !== undefined) {
      const comments = JSON.parse(await event.files[0].text()) as IGradedComment[] | undefined | null;
      if (comments !== undefined && comments !== null && comments.length > 0) {
        comments.forEach(com => {
          const t: IGradedComment = {
            questionId: this._q!.id,
            text: com.text,
            description: com.description,
            grade: !com.grade ? 0 : com.grade,
          };
          this.gradedCommentService.create(t).subscribe(e => {
            const currentComment = e.body!;
            this.currentGradedComment4Question?.push(currentComment);
            this.titreCommentaire = '';
            this.descCommentaire = '';
            this.noteCommentaire = 0;
            this.blocked = false;
          });
        });
      }
    }
  }

  addDefault(): void {
    this.translate.get('scanexam.adddefaultexcellent').subscribe(() => {
      if (this._q !== undefined && this._q.gradeType === GradeType.DIRECT) {
        const comments = [
          {
            questionId: this._q.id,
            text: this.translate.instant('scanexam.adddefaultexcellent'),
          },
          {
            questionId: this._q.id,
            text: this.translate.instant('scanexam.adddefaultvide'),
          },
          {
            questionId: this._q.id,
            text: this.translate.instant('scanexam.adddefaultfaux'),
          },
        ];
        comments.forEach(com => {
          const t: ITextComment = {
            questionId: this._q!.id,
            text: com.text,
          };
          this.textCommentService.create(t).subscribe(e => {
            const currentComment = e.body!;
            this.currentTextComment4Question?.push(currentComment);
            this.titreCommentaire = '';
            this.descCommentaire = '';
            this.blocked = false;
          });
        });
      } else if (this._q !== undefined) {
        const comments = [
          {
            questionId: this._q.id,
            text: this.translate.instant('scanexam.adddefaultexcellent'),
            grade: this._q.gradeType === GradeType.NEGATIVE ? 0 : this._q.step,
          },
          {
            questionId: this._q.id,
            text: this.translate.instant('scanexam.adddefaultvide'),
            grade: this._q.gradeType === GradeType.NEGATIVE ? this._q.step : 0,
          },
          {
            questionId: this._q.id,
            text: this.translate.instant('scanexam.adddefaultfaux'),
            grade: this._q.gradeType === GradeType.NEGATIVE ? this._q.step : 0,
          },
        ];
        comments.forEach(com => {
          const t: IGradedComment = {
            questionId: this._q!.id,
            text: com.text,
            grade: !com.grade ? 0 : com.grade,
          };
          this.gradedCommentService.create(t).subscribe(e => {
            const currentComment = e.body!;
            this.currentGradedComment4Question?.push(currentComment);
            this.titreCommentaire = '';
            this.descCommentaire = '';
            this.noteCommentaire = 0;
            this.blocked = false;
          });
        });
      }
    });
  }
}
