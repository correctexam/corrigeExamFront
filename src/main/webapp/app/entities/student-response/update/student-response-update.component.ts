import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IStudentResponse, StudentResponse } from '../student-response.model';
import { StudentResponseService } from '../service/student-response.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';

@Component({
  selector: 'jhi-student-response-update',
  templateUrl: './student-response-update.component.html',
})
export class StudentResponseUpdateComponent implements OnInit {
  isSaving = false;

  questionsSharedCollection: IQuestion[] = [];
  studentsSharedCollection: IStudent[] = [];

  editForm = this.fb.group({
    id: [],
    note: [],
    question: [],
    student: [],
  });

  constructor(
    protected studentResponseService: StudentResponseService,
    protected questionService: QuestionService,
    protected studentService: StudentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ studentResponse }) => {
      this.updateForm(studentResponse);

      this.loadRelationshipsOptions();
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

  trackQuestionById(index: number, item: IQuestion): number {
    return item.id!;
  }

  trackStudentById(index: number, item: IStudent): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStudentResponse>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(studentResponse: IStudentResponse): void {
    this.editForm.patchValue({
      id: studentResponse.id,
      note: studentResponse.note,
      question: studentResponse.question,
      student: studentResponse.student,
    });

    this.questionsSharedCollection = this.questionService.addQuestionToCollectionIfMissing(
      this.questionsSharedCollection,
      studentResponse.question
    );
    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing(
      this.studentsSharedCollection,
      studentResponse.student
    );
  }

  protected loadRelationshipsOptions(): void {
    this.questionService
      .query()
      .pipe(map((res: HttpResponse<IQuestion[]>) => res.body ?? []))
      .pipe(
        map((questions: IQuestion[]) =>
          this.questionService.addQuestionToCollectionIfMissing(questions, this.editForm.get('question')!.value)
        )
      )
      .subscribe((questions: IQuestion[]) => (this.questionsSharedCollection = questions));

    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(
        map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing(students, this.editForm.get('student')!.value))
      )
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));
  }

  protected createFromForm(): IStudentResponse {
    return {
      ...new StudentResponse(),
      id: this.editForm.get(['id'])!.value,
      note: this.editForm.get(['note'])!.value,
      question: this.editForm.get(['question'])!.value,
      student: this.editForm.get(['student'])!.value,
    };
  }
}
