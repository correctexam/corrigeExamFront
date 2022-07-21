/* eslint-disable no-console */
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
import { ExamSheetService } from '../../entities/exam-sheet/service/exam-sheet.service';
import { StudentService } from '../../entities/student/service/student.service';
import { IStudent } from 'app/entities/student/student.model';
import { db } from '../db/db';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ScanService } from '../../entities/scan/service/scan.service';
import { IScan } from '../../entities/scan/scan.model';
import { AccountService } from '../../core/auth/account.service';

@Component({
  selector: 'jhi-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss'],
  providers: [ConfirmationService],
})
export class ExamDetailComponent implements OnInit {
  blocked = false;
  farCircle = farCircle as IconProp;
  fasMotorcycle = fasMotorcycle as IconProp;
  faGraduationCap = faGraduationCap as IconProp;
  faBookOpenReader = faBookOpenReader as IconProp;
  examId = '';
  exam!: IExam;
  course!: ICourse;
  dockItems!: any[];
  showAssociation = false;
  showCorrection = false;
  nbreFeuilleParCopie = 0;
  numberPagesInScan = 0;
  students: IStudent[] | undefined;
  constructor(
    public courseService: CourseService,
    public examService: ExamService,
    protected activatedRoute: ActivatedRoute,
    public confirmationService: ConfirmationService,
    public examSheetService: ExamSheetService,
    public studentService: StudentService,
    public router: Router,
    public appConfig: ApplicationConfigService,
    public scanService: ScanService,
    public accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.blocked = true;
        this.examId = params.get('examid')!;
        db.exams
          .where('id')
          .equals(+this.examId)
          .count()
          .then(c => {
            if (c !== 0) {
              this.showAssociation = true;
            }
          });

        this.examService.find(+this.examId).subscribe(data => {
          this.exam = data.body!;

          this.courseService.find(this.exam.courseId!).subscribe(
            e => (this.course = e.body!),
            () => {
              this.router.navigateByUrl('/');
            }
          );

          db.templates
            .where('examId')
            .equals(+this.examId)
            .count()
            .then(e2 => {
              this.nbreFeuilleParCopie = e2;
              // Step 2 Query Scan in local DB

              db.alignImages
                .where('examId')
                .equals(+this.examId)
                .count()
                .then(e1 => {
                  this.numberPagesInScan = e1;

                  this.studentService.query({ courseId: this.exam.courseId }).subscribe(studentsbody => {
                    this.blocked = false;

                    this.students = studentsbody.body!;
                    const ex2 = (this.students.map(s => s.examSheets) as any)
                      .flat()
                      .filter((ex1: any) => ex1.scanId === this.exam.scanfileId && ex1.pagemin !== -1).length;
                    this.showCorrection = ex2 === this.numberPagesInScan / this.nbreFeuilleParCopie;
                  });
                });
            });

          //          this.examSheetService.
        });
        this.dockItems = [
          {
            label: 'Supprimer cet Examen',
            icon: this.appConfig.getFrontUrl() + 'content/images/remove-rubbish.svg',
            title: 'Supprimer cet Examen (templates, questions, corrections ...)',
            command1: () => {
              this.confirmeDelete();
            },
          },
          {
            label: 'Nettoyer le cache du browser pour cet exam',
            icon: this.appConfig.getFrontUrl() + 'content/images/Font_Awesome_5_solid_eraser.svg',
            title: 'Nettoyer le cache du browser pour cet exam (images dans la base de données locale)',
            command1: () => {
              this.confirmeCleanCache();
            },
          },

          {
            label: 'Synchroniser le cache du browser vers le serveur pour une correction sur un autre device',
            icon: this.appConfig.getFrontUrl() + 'content/images/upload-solid.svg',
            title:
              'Synchroniser le cache du browser vers le serveur pour une correction sur un autre device (images dans la base de données locale)',
            command1: () => {
              this.confirmUpload();
            },
          },
          {
            label: 'Synchroniser le cache du browser avec celui du serveur',
            icon: this.appConfig.getFrontUrl() + 'content/images/download-solid.svg',
            title:
              "Synchroniser le cache du browser avec celui du serveur (permet d'importer un ensemble d'images préalablement alignées sur un autre équipement)",
            command1: () => {
              this.confirmDownload();
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

  confirmeCleanCache(): any {
    this.confirmationService.confirm({
      message: 'Etes vous sur de vouloir supprimer le cache dans le navigateur. Vous devrez réalignez les images',
      // eslint-disable-next-line object-shorthand
      accept: () => {
        db.resetDatabase().then(() => {
          this.showAssociation = false;
          this.showCorrection = false;
        });
      },
    });
  }

  confirmUpload(): any {
    this.confirmationService.confirm({
      message: 'Etes vous sur de vouloir télécharger le cache du navigateur vers le serveur.',
      // eslint-disable-next-line object-shorthand
      accept: () => {
        db.export().then((value: Blob) => {
          if (this.accountService.isAuthenticated()) {
            this.blocked = true;

            this.accountService.identity().subscribe(account => {
              const reader = new FileReader();
              reader.readAsDataURL(value);
              reader.onloadend = () => {
                const base64data = '' + reader.result;
                const s: IScan = {};
                s.name = account?.login + 'indexdb.json';
                s.contentContentType = 'application/json';
                s.content = base64data.substr(base64data.indexOf(',') + 1)!;
                this.scanService.create(s).subscribe(() => {
                  this.blocked = false;
                });
              };
            });
          }

          /* const url = window.URL.createObjectURL(value);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = 'indexdb.json';
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();*/
        });
      },
    });
  }

  confirmDownload(): any {
    this.confirmationService.confirm({
      message:
        "Etes vous sur de vouloir télécharger le cache du serveur vers le navigateur. Cela supprimera votre base d'images locale à cet équipement préalablement alignées.",
      // eslint-disable-next-line object-shorthand
      accept: () => {
        this.blocked = true;
        db.resetDatabase().then(() => {
          this.accountService.identity().subscribe(account => {
            this.scanService.query({ name: account?.login + 'indexdb.json' }).subscribe(scan => {
              if (scan.body !== null && scan.body.length > 0) {
                const s = scan.body[0];
                const byteCharacters = atob(s.content!);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: s.contentContentType! });
                db.import(blob).then(() => {
                  this.blocked = false;
                  this.showAssociation = true;
                  this.showCorrection = true;
                });
              }
            });
          });
        });
      },
    });
  }

  hasCache(): boolean {
    return true;
  }

  couldAnswer(): boolean {
    return true;
  }
}
