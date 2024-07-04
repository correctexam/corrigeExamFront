import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ICourseGroup } from '../course-group.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { TranslateDirective } from '../../../shared/language/translate.directive';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'jhi-course-group-detail',
  templateUrl: './course-group-detail.component.html',
  standalone: true,
  imports: [NgIf, TranslateDirective, AlertErrorComponent, AlertComponent, NgFor, RouterLink, FaIconComponent],
})
export class CourseGroupDetailComponent implements OnInit {
  courseGroup: ICourseGroup | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ courseGroup }) => {
      this.courseGroup = courseGroup;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
