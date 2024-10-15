/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IStudentResponse, StudentResponse } from '../student-response.model';
import { StudentResponseService } from '../service/student-response.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { IExamSheet } from 'app/entities/exam-sheet/exam-sheet.model';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';

import { ITextComment } from 'app/entities/text-comment/text-comment.model';
import { TextCommentService } from 'app/entities/text-comment/service/text-comment.service';
import { IGradedComment } from 'app/entities/graded-comment/graded-comment.model';
import { GradedCommentService } from 'app/entities/graded-comment/service/graded-comment.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgFor } from '@angular/common';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { TranslateDirective } from '../../../shared/language/translate.directive';

type SelectableEntity = IQuestion | IExamSheet;

@Component({
  selector: 'jhi-student-response-update',
  templateUrl: './student-response-update.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateDirective, AlertErrorComponent, NgFor, FaIconComponent],
})
export class StudentResponseUpdateComponent implements OnInit {
  isSaving = false;
  questions: IQuestion[] = [];
  sheets: IExamSheet[] = [];
  textCommentsSharedCollection: ITextComment[] = [];
  gradedCommentsSharedCollection: IGradedComment[] = [];

  editForm: UntypedFormGroup;

  constructor(
    protected studentResponseService: StudentResponseService,
    protected questionService: QuestionService,
    protected examSheetService: ExamSheetService,
    protected textCommentService: TextCommentService,
    protected gradedCommentService: GradedCommentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder,
  ) {
    this.editForm = this.fb.group({
      id: [],
      note: [],
      star: [],
      worststar: [],
      questionId: [],
      sheetId: [],
      textcomments: [],
      gradedcomments: [],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ studentResponse }) => {
      this.updateForm(studentResponse);

      this.questionService.query().subscribe((res: HttpResponse<IQuestion[]>) => (this.questions = res.body || []));

      this.examSheetService.query().subscribe((res: HttpResponse<IExamSheet[]>) => (this.sheets = res.body || []));
    });
  }

  updateForm(studentResponse: IStudentResponse): void {
    this.editForm.patchValue({
      id: studentResponse.id,
      note: studentResponse.note,
      star: studentResponse.star,
      worststar: studentResponse.worststar,
      questionId: studentResponse.questionId,
      sheetId: studentResponse.sheetId,
      textcomments: studentResponse.textcomments,
      gradedcomments: studentResponse.gradedcomments,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const studentResponse = this.createFromForm();
    if (studentResponse.id !== undefined) {
      this.subscribeToSaveResponse(this.studentResponseService.update(studentResponse));
    } else {
      this.subscribeToSaveResponse(this.studentResponseService.create(studentResponse));
    }
  }

  private createFromForm(): IStudentResponse {
    return {
      ...new StudentResponse(),
      id: this.editForm.get(['id'])!.value,
      note: this.editForm.get(['note'])!.value,
      star: this.editForm.get(['star'])!.value,
      worststar: this.editForm.get(['worststar'])!.value,
      questionId: this.editForm.get(['questionId'])!.value,
      sheetId: this.editForm.get(['sheetId'])!.value,
      textcomments: this.editForm.get(['textcomments'])!.value,
      gradedcomments: this.editForm.get(['gradedcomments'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStudentResponse>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError(),
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
