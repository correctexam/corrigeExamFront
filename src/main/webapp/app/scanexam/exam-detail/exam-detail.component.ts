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
import { AccountService } from '../../core/auth/account.service';
import { ExportOptions } from 'dexie-export-import';
import { MessageService } from 'primeng/api';
import { CacheUploadService } from './cacheUpload.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class ExamDetailComponent implements OnInit {
  blocked = false;
  farCircle = farCircle as IconProp;
  fasMotorcycle = fasMotorcycle as IconProp;
  faGraduationCap = faGraduationCap as IconProp;
  faBookOpenReader = faBookOpenReader as IconProp;
  examId = '';
  exam: IExam | undefined;
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
    public accountService: AccountService,
    private messageService: MessageService,
    public cacheUploadService: CacheUploadService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.blocked = true;
        this.examId = params.get('examid')!;
        this.examService.find(+this.examId).subscribe(ex => {
          this.exam = ex.body!;

          this.courseService.find(this.exam.courseId!).subscribe(
            e => (this.course = e.body!),
            () => {
              this.router.navigateByUrl('/');
            }
          );

          //          this.examSheetService.

          db.exams
            .where('id')
            .equals(+this.examId)
            .count()
            .then(c => {
              if (c !== 0) {
                this.blocked = true;
                this.showAssociation = true;
                this.initTemplate();
              } else {
                db.removeElementForExam(+this.examId).then(() => {
                  this.cacheUploadService.getCache(this.examId + 'indexdb.json').subscribe(
                    data => {
                      db.import(data)
                        .then(() => {
                          this.messageService.add({
                            severity: 'success',
                            summary: 'Download file from server',
                            detail: 'Import de la base de données locales réussi',
                          });
                          this.showAssociation = true;
                          this.initTemplate();
                        })
                        .catch(() => {
                          this.blocked = false;
                        });
                    },
                    () => {
                      this.blocked = false;
                    }
                  );
                });
              }
            });
        });

        this.translateService.get('scanexam.removeexam').subscribe(() => {
          this.initCmpt();
        });
        this.translateService.onLangChange.subscribe(() => {
          this.initCmpt();
        });
      }
    });
  }

  initCmpt(): void {
    this.dockItems = [
      {
        label: this.translateService.instant('scanexam.removeexam'),
        icon: this.appConfig.getFrontUrl() + 'content/images/remove-rubbish.svg',
        title: this.translateService.instant('scanexam.removeexamdetail'),
        command1: () => {
          this.confirmeDelete();
        },
      },
      {
        label: this.translateService.instant('scanexam.cleancache'),
        icon: this.appConfig.getFrontUrl() + 'content/images/Font_Awesome_5_solid_eraser.svg',
        title: this.translateService.instant('scanexam.cleancachedetail'),
        command1: () => {
          this.confirmeCleanCache();
        },
      },

      {
        label: this.translateService.instant('scanexam.synchrobrowserserver'),
        icon: this.appConfig.getFrontUrl() + 'content/images/upload-solid.svg',
        title: this.translateService.instant('scanexam.synchrobrowserserverdetail'),
        command1: () => {
          this.confirmUpload();
        },
      },
      {
        label: this.translateService.instant('scanexam.synchroserverbrowser'),
        icon: this.appConfig.getFrontUrl() + 'content/images/download-solid.svg',
        title: this.translateService.instant('scanexam.synchroserverbrowserdetail'),
        command1: () => {
          this.confirmDownload();
        },
      },
    ];
  }

  initTemplate(): void {
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

            this.studentService.query({ courseId: this.exam!.courseId }).subscribe(
              studentsbody => {
                this.blocked = false;

                this.students = studentsbody.body!;
                const ex2 = (this.students.map(s => s.examSheets) as any)
                  .flat()
                  .filter((ex1: any) => ex1.scanId === this.exam!.scanfileId && ex1.pagemin !== -1).length;
                console.log(ex2);
                this.showCorrection = ex2 === this.numberPagesInScan / this.nbreFeuilleParCopie;
              },
              () => {
                console.log('pass par la4');
                this.blocked = false;
              }
            );
          });
      });
  }

  confirmeDelete(): any {
    this.translateService.get('scanexam.removexamveverify').subscribe(data => {
      this.confirmationService.confirm({
        message: data,
        accept: () => {
          this.examService.delete(this.exam!.id!).subscribe(() => {
            db.removeElementForExam(+this.examId)
              .then(() => {
                this.router.navigateByUrl('/course/' + this.course.id);
              })
              .catch(() => {
                this.messageService.add({
                  severity: 'error',
                  summary: this.translateService.instant('scanexam.deletecacheko'),
                  detail: this.translateService.instant('scanexam.deletecachekodetail'),
                });
                this.router.navigateByUrl('/course/' + this.course.id);
              });
          });
        },
      });
    });
  }

  confirmeCleanCache(): any {
    this.translateService.get('scanexam.confirmcleancache').subscribe(data => {
      this.confirmationService.confirm({
        message: data,
        // eslint-disable-next-line object-shorthand
        accept: () => {
          db.removeElementForExam(+this.examId).then(() => {
            this.showAssociation = false;
            this.showCorrection = false;
          });
        },
      });
    });
  }

  confirmUpload(): any {
    this.translateService.get('scanexam.confirmuploadcache').subscribe(data => {
      this.confirmationService.confirm({
        message: data,
        // eslint-disable-next-line object-shorthand
        accept: () => {
          const o: ExportOptions = {};
          o.filter = (table: string, value: any) =>
            (table === 'exams' && value.id === +this.examId) ||
            (table === 'templates' && value.examId === +this.examId) ||
            (table === 'nonAlignImages' && value.examId === +this.examId) ||
            (table === 'alignImages' && value.examId === +this.examId);
          this.blocked = true;
          db.export(o).then((value: Blob) => {
            const file = new File([value], this.examId + 'indexdb.json');
            this.cacheUploadService.uploadCache(file).subscribe(
              e => {
                if (e.type === 4) {
                  this.blocked = false;
                  this.messageService.add({
                    severity: 'success',
                    summary: this.translateService.instant('scanexam.uploadcacheok'),
                    detail: this.translateService.instant('scanexam.uploadcacheokdetail'),
                  });
                }
              },
              () => {
                this.messageService.add({
                  severity: 'error',
                  summary: this.translateService.instant('scanexam.uploadcacheko'),
                  detail: this.translateService.instant('scanexam.uploadcachekodetail'),
                });

                this.blocked = false;
              }
            );
          });
        },
      });
    });
  }

  confirmDownload(): any {
    this.translateService.get('scanexam.confirmuploadcache').subscribe(data1 => {
      this.confirmationService.confirm({
        message: data1,
        // eslint-disable-next-line object-shorthand
        accept: () => {
          this.blocked = true;
          db.removeElementForExam(+this.examId).then(() => {
            this.cacheUploadService.getCache(this.examId + 'indexdb.json').subscribe(
              data => {
                db.import(data)
                  .then(() => {
                    this.messageService.add({
                      severity: 'success',
                      summary: this.translateService.instant('scanexam.downloadcacheok'),
                      detail: this.translateService.instant('scanexam.downloadcacheokdetail'),
                    });
                    this.blocked = false;
                    this.showAssociation = true;
                    this.showCorrection = true;
                  })
                  .catch(() => {
                    this.messageService.add({
                      severity: 'error',
                      summary: this.translateService.instant('scanexam.downloadcacheko'),
                      detail: this.translateService.instant('scanexam.downloadcachekodetail'),
                    });
                    this.blocked = false;
                  });
              },
              () => {
                this.messageService.add({
                  severity: 'error',
                  summary: this.translateService.instant('scanexam.downloadcacheko'),
                  detail: this.translateService.instant('scanexam.downloadcachekodetail'),
                });

                this.blocked = false;
              }
            );
          });
        },
      });
    });
  }

  hasCache(): boolean {
    return true;
  }

  couldAnswer(): boolean {
    return true;
  }
}
