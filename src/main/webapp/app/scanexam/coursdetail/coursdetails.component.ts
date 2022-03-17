/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
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
  selector: 'jhi-coursdetails',
  templateUrl: './coursdetails.component.html',
  styleUrls: ['./coursdetails.component.scss'],
  providers: [ConfirmationService],
})
export class CoursdetailsComponent implements OnInit {
  farCircle = farCircle as IconProp;
  fasMotorcycle = fasMotorcycle as IconProp;
  faGraduationCap = faGraduationCap as IconProp;
  faBookOpenReader = faBookOpenReader as IconProp;
  exams!: IExam[];
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
      if (params.get('courseid') !== null) {
        this.examService.query({ courseId: params.get('courseid') }).subscribe(data => {
          this.exams = data.body!;
        });
        this.courseService.find(+params.get('courseid')!).subscribe(e => (this.course = e.body!));
        this.dockItems = [
          {
            label: 'Créer exam',
            icon: 'content/images/exam.svg',
            title: 'Créer exam',
            route: '/creerexam/' + params.get('courseid'),
          },
          {
            label: 'Enregistrer liste étudiants',
            icon: 'content/images/students.svg',
            title: 'Enregistrer liste étudiants',
            route: '/registerstudents/' + params.get('courseid'),
          },
          {
            label: 'Voir liste étudiants',
            icon: 'content/images/studentslist.svg',
            title: 'Voir liste étudiants',
            route: '/liststudents/' + params.get('courseid'),
          },
          {
            label: 'Supprimer UE',
            icon: 'content/images/remove-rubbish.svg',
            title: 'Supprimer cet UE (groupes, examsn templates, ...)',
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
        // eslint-disable-next-line no-console
        console.log('will delete ' + this.course.id!);
        this.courseService.delete(this.course.id!).subscribe(e => {
          // eslint-disable-next-line no-console
          console.log(e);
          this.router.navigateByUrl('/');
        });
      },
    });
  }
}
