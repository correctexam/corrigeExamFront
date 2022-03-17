/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';
import { faMotorcycle as fasMotorcycle } from '@fortawesome/free-solid-svg-icons';
import { faGraduationCap as faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faBookOpenReader as faBookOpenReader } from '@fortawesome/free-solid-svg-icons';
import { CourseService } from '../../entities/course/service/course.service';
import { ICourse } from '../../entities/course/course.model';
import { IExam } from '../../entities/exam/exam.model';
import { ExamService } from '../../entities/exam/service/exam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
@Component({
  selector: 'jhi-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss'],
  providers: [ConfirmationService],
})
export class ExamDetailComponent implements OnInit {
  farCircle = farCircle as IconProp;
  fasMotorcycle = fasMotorcycle as IconProp;
  faGraduationCap = faGraduationCap as IconProp;
  faBookOpenReader = faBookOpenReader as IconProp;
  examId = '';
  exam!: IExam;
  course!: ICourse;
  dockItems!: any[];

  constructor(
    public courseService: CourseService,
    public examService: ExamService,
    protected activatedRoute: ActivatedRoute,
    public confirmationService: ConfirmationService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.examId = params.get('examid')!;
        this.examService.find(+this.examId).subscribe(data => {
          this.exam = data.body!;
          this.courseService.find(this.exam.courseId!).subscribe(e => (this.course = e.body!));
        });
        this.dockItems = [
          {
            label: 'Supprimer cet Examen',
            icon: 'content/images/remove-rubbish.svg',
            title: 'Supprimer cet Examen (templates, questions, corrections ...)',
            command1: () => {
              this.confirmeDelete();
            },
          },
        ];
      }
    });
  }

  confirmeDelete(): any {
    this.confirmationService.confirm({
      message: "Etes vous sur de vouloir supprimer ce module, les exams, les groupes d'étudiants et les templates associés",
      accept: () => {
        this.examService.delete(this.exam.id!).subscribe(() => {
          this.router.navigateByUrl('/course/' + this.course.id);
        });
      },
    });
  }
}
