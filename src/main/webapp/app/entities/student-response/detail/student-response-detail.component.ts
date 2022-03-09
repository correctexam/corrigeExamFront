import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStudentResponse } from '../student-response.model';

@Component({
  selector: 'jhi-student-response-detail',
  templateUrl: './student-response-detail.component.html',
})
export class StudentResponseDetailComponent implements OnInit {
  studentResponse: IStudentResponse | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ studentResponse }) => {
      this.studentResponse = studentResponse;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
