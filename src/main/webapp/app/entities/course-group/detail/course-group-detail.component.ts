import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICourseGroup } from '../course-group.model';

@Component({
  selector: 'jhi-course-group-detail',
  templateUrl: './course-group-detail.component.html',
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
