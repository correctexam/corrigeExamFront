import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IStudent } from '../student.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'jhi-student-detail',
  templateUrl: './student-detail.component.html',
  standalone: true,
  imports: [NgIf, AlertErrorComponent, AlertComponent, NgFor, RouterLink, FaIconComponent],
})
export class StudentDetailComponent implements OnInit {
  student: IStudent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ student }) => {
      this.student = student;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
