import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ICourse } from '../course.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';

@Component({
  selector: 'jhi-course-detail',
  templateUrl: './course-detail.component.html',
  standalone: true,
  imports: [AlertErrorComponent, AlertComponent, FaIconComponent, RouterLink],
})
export class CourseDetailComponent implements OnInit {
  course: ICourse | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ course }) => {
      this.course = course;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
