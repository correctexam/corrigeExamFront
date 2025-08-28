import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IStudentResponse } from '../student-response.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'jhi-student-response-detail',
  templateUrl: './student-response-detail.component.html',
  standalone: true,
  imports: [NgIf, AlertErrorComponent, AlertComponent, RouterLink, NgFor, FaIconComponent],
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
