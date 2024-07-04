/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input, OnInit } from '@angular/core';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';
import { faMotorcycle as fasMotorcycle } from '@fortawesome/free-solid-svg-icons';
import { faGraduationCap as faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { CourseService } from '../../entities/course/service/course.service';
import { ICourse } from '../../entities/course/course.model';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { HasAnyAuthorityDirective } from '../../shared/auth/has-any-authority.directive';
import { FaStackComponent, FaIconComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { TranslateDirective } from '../../shared/language/translate.directive';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'jhi-mes-cours',
  templateUrl: './mes-cours.component.html',
  styleUrls: ['./mes-cours.component.scss'],
  providers: [CourseService],
  standalone: true,
  imports: [
    NgIf,
    TranslateDirective,
    NgFor,
    ButtonDirective,
    RouterLink,
    FaStackComponent,
    FaIconComponent,
    FaStackItemSizeDirective,
    HasAnyAuthorityDirective,
  ],
})
export class MesCoursComponent implements OnInit {
  farCircle = farCircle as IconProp;
  fasMotorcycle = fasMotorcycle as IconProp;
  faGraduationCap = faGraduationCap as IconProp;
  courses!: ICourse[];

  @Input()
  showImage = true;

  constructor(public courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.query().subscribe(data => {
      this.courses = data.body!;
    });
  }
}
