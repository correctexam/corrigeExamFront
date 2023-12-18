/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GradeType } from 'app/entities/enumerations/grade-type.model';
import { IGradedComment } from 'app/entities/graded-comment/graded-comment.model';
import { GradedCommentService } from 'app/entities/graded-comment/service/graded-comment.service';
import { Question } from 'app/entities/question/question.model';
import { TextCommentService } from 'app/entities/text-comment/service/text-comment.service';
import { ITextComment } from 'app/entities/text-comment/text-comment.model';
import { saveAs } from 'file-saver';
import { HybridGradedCommentService } from '../../../entities/hybrid-graded-comment/service/hybrid-graded-comment.service';
import { IHybridGradedComment, NewHybridGradedComment } from 'app/entities/hybrid-graded-comment/hybrid-graded-comment.model';
import { Inplace } from 'primeng/inplace';
@Component({
  selector: 'jhi-create-comments',

  templateUrl: './create-comments.component.html',
  styleUrls: ['./create-comments.component.scss'],
})
export class CreateCommentsComponent implements OnInit {
  _q?: Question;
  currentTextComment4Question: ITextComment[] | undefined;
  currentGradedComment4Question: IGradedComment[] | undefined;
  currentHybridGradedComment4Question: IHybridGradedComment[] | undefined;

  @Output()
  addTextComment: EventEmitter<ITextComment> = new EventEmitter<ITextComment>();
  @Output()
  addGradedComment: EventEmitter<IGradedComment> = new EventEmitter<IGradedComment>();
  @Output()
  addHybridGradedComment: EventEmitter<IHybridGradedComment> = new EventEmitter<IHybridGradedComment>();
  @Output()
  updateTextComment: EventEmitter<ITextComment> = new EventEmitter<ITextComment>();
  @Output()
  updateGradedComment: EventEmitter<IGradedComment> = new EventEmitter<IGradedComment>();
  @Output()
  updateHybridGradedComment: EventEmitter<IHybridGradedComment> = new EventEmitter<IHybridGradedComment>();

  @Input()
  couldDelete = true;

  questionStep = 0;
  titreCommentaire = '';
  descCommentaire = '';
  noteCommentaire = 0;
  noteSteps = 0;
  blocked = false;
  relativeOptions = [
    { label: 'relative', value: true },
    { label: 'absolute', value: false },
  ];
  grade = 0;
  relative = true;
  step = 1;

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
      this.currentHybridGradedComment4Question = [];
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
    public hybridGradedCommentService: HybridGradedCommentService,
    public textCommentService: TextCommentService,
    public translate: TranslateService,
  ) {}
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  loadComments(): void {
    if (this._q!.gradeType === GradeType.DIRECT) {
      this.textCommentService.query({ questionId: this._q!.id }).subscribe(com => {
        this.currentTextComment4Question = com.body!;
      });
    } else if (this._q!.gradeType === GradeType.HYBRID) {
      this.hybridGradedCommentService.query({ questionId: this._q!.id }).subscribe(com => {
        this.currentHybridGradedComment4Question = com.body!;
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
        this.addTextComment.emit(currentComment);
        this.titreCommentaire = '';
        this.descCommentaire = '';
        this.blocked = false;
      });
    } else if (this._q !== undefined && this._q.gradeType !== GradeType.DIRECT && this._q.gradeType !== GradeType.HYBRID) {
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
        this.addGradedComment.emit(currentComment);

        this.titreCommentaire = '';
        this.descCommentaire = '';
        this.noteCommentaire = 0;
        this.blocked = false;
      });
    } else if (this._q !== undefined && this._q.gradeType === GradeType.HYBRID) {
      const t: NewHybridGradedComment = {
        id: null,
        questionId: this._q.id,
        text: this.titreCommentaire,
        description: this.descCommentaire,
        grade: !this.grade ? 0 : this.grade,
        step: !this.step ? 1 : this.step,
        relative: this.relative,
        // studentResponses: [{ id: this.resp?.id }],
      };
      this.blocked = true;
      this.hybridGradedCommentService.create(t).subscribe(e => {
        const currentComment = e.body!;
        this.currentHybridGradedComment4Question?.push(currentComment);
        this.addHybridGradedComment.emit(currentComment);
        this.titreCommentaire = '';
        this.descCommentaire = '';
        this.noteCommentaire = 0;
        this.grade = 0;
        this.step = 1;
        this.relative = true;

        this.blocked = false;
      });
    }
  }

  updateComment($event: any, l: IGradedComment | ITextComment | IHybridGradedComment, graded: boolean, hybrid: boolean): any {
    if (graded && !hybrid) {
      if ((l as IGradedComment).grade === null) {
        (l as IGradedComment).grade = 0;
      }
      this.gradedCommentService.update(l as IGradedComment).subscribe(() => {
        this.updateGradedComment.emit(l as IGradedComment);
        const coms = this.currentGradedComment4Question?.filter(c => c.id === l.id!);
        if (coms !== undefined && coms.length > 0) {
          coms[0].grade = (l as any).grade;
        }
      });
    } else if (hybrid) {
      if ((l as IHybridGradedComment).grade === null) {
        (l as IHybridGradedComment).grade = 0;
      }
      if ((l as IHybridGradedComment).step === null) {
        (l as IHybridGradedComment).step = 1;
      }
      if ((l as IHybridGradedComment).relative === null) {
        (l as IHybridGradedComment).relative = true;
      }

      this.hybridGradedCommentService.update(l as IHybridGradedComment).subscribe(() => {
        this.updateHybridGradedComment.emit(l as IHybridGradedComment);
        const coms = this.currentHybridGradedComment4Question?.filter(c => c.id === l.id!);
        if (coms !== undefined && coms.length > 0) {
          coms[0].grade = (l as any).grade;
          coms[0].step = (l as any).step;
          coms[0].relative = (l as any).relative;
        }
      });
    } else {
      this.textCommentService.update(l as ITextComment).subscribe(() => {
        this.updateTextComment.emit(l as ITextComment);
      });
    }
  }

  removeTextComment(comment: ITextComment): void {
    this.currentTextComment4Question = this.currentTextComment4Question!.filter(e => e.id !== comment.id);
    this.textCommentService.delete(comment.id!).subscribe(() =>
      // eslint-disable-next-line no-console
      console.log('delete'),
    );
  }

  removeGradedComment(comment: IGradedComment): void {
    this.currentGradedComment4Question = this.currentGradedComment4Question!.filter(e => e.id !== comment.id);
    this.gradedCommentService.delete(comment.id!).subscribe(() => {
      // eslint-disable-next-line no-console
      console.log('delete');
    });
  }

  removeHybridComment(comment: IHybridGradedComment): void {
    this.currentHybridGradedComment4Question = this.currentHybridGradedComment4Question!.filter(e => e.id !== comment.id);
    this.hybridGradedCommentService.delete(comment.id).subscribe(() => {
      // eslint-disable-next-line no-console
      console.log('delete');
    });
  }

  exportComment(): void {
    if (this._q !== undefined && this._q.gradeType === GradeType.DIRECT) {
      const coms: ITextComment[] = [];
      this.currentTextComment4Question?.forEach(com => {
        const comCopy = { ...com };
        delete comCopy.id;
        coms.push(comCopy);
      });
      return saveAs(new Blob([JSON.stringify(coms, null, 2)], { type: 'JSON' }), 'commentsQ' + this._q.numero! + '.json');
    } else if (this._q !== undefined && this._q.gradeType !== GradeType.DIRECT && this._q.gradeType !== GradeType.HYBRID) {
      const coms: IGradedComment[] = [];
      this.currentGradedComment4Question?.forEach(com => {
        const comCopy = { ...com };
        delete comCopy.id;
        coms.push(comCopy);
      });
      return saveAs(new Blob([JSON.stringify(coms, null, 2)], { type: 'JSON' }), 'commentsQ' + this._q.numero! + '.json');
    } else if (this._q !== undefined && this._q.gradeType === GradeType.HYBRID) {
      const coms: IHybridGradedComment[] = [];
      this.currentHybridGradedComment4Question?.forEach(com => {
        const comCopy = { ...com } as any;
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
            this.addTextComment.emit(currentComment);
          });
        });
        this.titreCommentaire = '';
        this.descCommentaire = '';
      }
    } else if (this._q !== undefined && this._q.gradeType === GradeType.HYBRID) {
      const comments = JSON.parse(await event.files[0].text()) as IHybridGradedComment[] | undefined | null;
      if (comments !== undefined && comments !== null && comments.length > 0) {
        comments.forEach(com => {
          const t: NewHybridGradedComment = {
            id: null,
            questionId: this._q!.id,
            text: com.text,
            description: com.description,
            relative: com.relative ? com.relative : false,
            grade: com.grade ? com.grade : 0,
            step: com.step ? com.step : 1,
          };

          this.hybridGradedCommentService.create(t).subscribe(e => {
            const currentComment = e.body!;
            this.currentHybridGradedComment4Question?.push(currentComment);
            this.addHybridGradedComment.emit(currentComment);
          });
        });
        this.titreCommentaire = '';
        this.descCommentaire = '';
        this.step = 1;
        this.relative = false;
        this.grade = 0;
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
            this.addGradedComment.emit(currentComment);
          });
        });
        this.titreCommentaire = '';
        this.descCommentaire = '';
        this.noteCommentaire = 0;
      }
    }
    this.blocked = false;
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
            this.addTextComment.emit(currentComment);

            this.titreCommentaire = '';
            this.descCommentaire = '';
            this.blocked = false;
          });
        });
      } else if (this._q !== undefined && this._q.gradeType === GradeType.HYBRID) {
        const comments: NewHybridGradedComment[] = [
          {
            id: null,
            questionId: this._q.id,
            text: this.translate.instant('scanexam.adddefaultexcellent'),
            relative: true,
            grade: 100,
            step: 1,
          },
          {
            id: null,
            questionId: this._q.id,
            text: this.translate.instant('scanexam.adddefaultvide'),
            relative: true,
            grade: -100,
            step: 1,
          },
          {
            id: null,
            questionId: this._q.id,
            text: this.translate.instant('scanexam.adddefaultfaux'),
            relative: true,
            grade: -100,
            step: 1,
          },
        ];
        comments.forEach(com => {
          this.hybridGradedCommentService.create(com).subscribe(e => {
            const currentComment = e.body!;
            this.currentHybridGradedComment4Question?.push(currentComment);
            this.addHybridGradedComment.emit(currentComment);
            this.titreCommentaire = '';
            this.descCommentaire = '';
            this.grade = 0;
            this.step = 1;
            this.relative = true;
            this.blocked = false;
          });
        });
      } else if (this._q !== undefined) {
        const comments = [
          {
            questionId: this._q.id,
            text: this.translate.instant('scanexam.adddefaultexcellent'),
            grade: this._q.gradeType === GradeType.NEGATIVE ? 0 : this._q.step! * this._q.point!,
          },
          {
            questionId: this._q.id,
            text: 'ok',
            grade: this._q.gradeType === GradeType.NEGATIVE ? 0 : this._q.step! * this._q.point!,
          },
          {
            questionId: this._q.id,
            text: this.translate.instant('scanexam.adddefaultvide'),
            grade: this._q.gradeType === GradeType.NEGATIVE ? this._q.step! * this._q.point! : 0,
          },
          {
            questionId: this._q.id,
            text: this.translate.instant('scanexam.adddefaultfaux'),
            grade: this._q.gradeType === GradeType.NEGATIVE ? this._q.step! * this._q.point! : 0,
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
            this.addGradedComment.emit(currentComment);

            this.titreCommentaire = '';
            this.descCommentaire = '';
            this.noteCommentaire = 0;
            this.blocked = false;
          });
        });
      }
    });
  }
  checkEnterOrEscape($event: any, el: Inplace): void {
    if ($event.keyCode === 13 || $event.keyCode === 27) {
      el.deactivate();
    }
  }
}
