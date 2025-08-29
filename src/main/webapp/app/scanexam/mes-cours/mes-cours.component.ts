import { Component, computed, Input, OnInit, Signal, signal, WritableSignal } from '@angular/core';
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
import { DragDropModule } from 'primeng/dragdrop';
import { firstValueFrom } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';

import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'jhi-mes-cours',
  templateUrl: './mes-cours.component.html',
  styleUrls: ['./mes-cours.component.scss'],
  providers: [CourseService],
  standalone: true,
  imports: [
    TooltipModule,
    DragDropModule,
    ButtonDirective,
    RouterLink,
    FaStackComponent,
    FaIconComponent,
    FaStackItemSizeDirective,
    HasAnyAuthorityDirective,
    TranslateDirective,
    TranslatePipe,
  ],
})
export class MesCoursComponent implements OnInit {
  farCircle = farCircle as IconProp;
  fasMotorcycle = fasMotorcycle as IconProp;
  faGraduationCap = faGraduationCap as IconProp;
  courses: WritableSignal<ICourse[]> = signal([]);
  coursesnonarchived: Signal<ICourse[]> = computed(() => this.courses().filter(c => !c.archived));
  coursesarchived: Signal<ICourse[]> = computed(() => this.courses().filter(c => c.archived));
  @Input()
  showImage = true;
  currentCourse?: ICourse;

  constructor(public courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.query().subscribe(data => {
      this.courses.update(() => [...data.body!]);
    });
  }

  dragStart(c: ICourse): void {
    this.currentCourse = c;
  }

  dragEnd(): void {
    console.error('dragEnd');
  }
  drop(archived: boolean): void {
    if (this.currentCourse && this.currentCourse.archived !== archived) {
      this.currentCourse.archived = archived;
      firstValueFrom(this.courseService.update(this.currentCourse)).then(() => {
        this.courses.update(courses => {
          const filtercourses = courses.filter(e => e.id === this.currentCourse?.id);
          if (filtercourses.length > 0) {
            filtercourses[0].archived = archived;
          }
          this.currentCourse = undefined;
          return [...courses];
        });
      });
    }
  }
}
