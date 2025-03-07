import { Component, OnInit } from '@angular/core';
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';
import { faMotorcycle as fasMotorcycle } from '@fortawesome/free-solid-svg-icons';
import { faGraduationCap as faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faBookOpenReader as faBookOpenReader } from '@fortawesome/free-solid-svg-icons';
import { faCloudArrowUp as faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faDiagramPredecessor as faDiagramPredecessor } from '@fortawesome/free-solid-svg-icons';
import { faPersonArrowDownToLine as faPersonArrowDownToLine } from '@fortawesome/free-solid-svg-icons';
import { faSquarePollVertical as faSquarePollVertical } from '@fortawesome/free-solid-svg-icons';

import { faPenToSquare as faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { CourseService } from '../../entities/course/service/course.service';
import { ICourse } from '../../entities/course/course.model';
import { IExam } from '../../entities/exam/exam.model';
import { ExamService } from '../../entities/exam/service/exam.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ExamSheetService } from '../../entities/exam-sheet/service/exam-sheet.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AccountService } from '../../core/auth/account.service';
import { MessageService } from 'primeng/api';
import { CacheDownloadNotification, CacheUploadNotification, CacheUploadService } from './cacheUpload.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { firstValueFrom } from 'rxjs';
import { PreferenceService } from '../preference-page/preference.service';
import { IExamSheet } from 'app/entities/exam-sheet/exam-sheet.model';
import { Title } from '@angular/platform-browser';
import { FaStackComponent, FaIconComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { UsableTextInputComponent } from '../../shared/usable-text-input/usable-text-input.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule, NgIf } from '@angular/common';
import { DockModule } from 'primeng/dock';
import { ButtonDirective } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TranslateDirective } from '../../shared/language/translate.directive';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'jhi-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss'],
  providers: [ConfirmationService, MessageService],
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    DialogModule,
    TranslateDirective,
    FormsModule,
    PrimeTemplate,
    ButtonDirective,
    NgIf,
    RouterLink,
    TooltipModule,
    ConfirmDialogModule,
    BlockUIModule,
    ProgressSpinnerModule,
    UsableTextInputComponent,
    FaStackComponent,
    FaIconComponent,
    FaStackItemSizeDirective,
    TranslateModule,
    DockModule,
  ],
})
export class ExamDetailComponent implements OnInit, CacheUploadNotification, CacheDownloadNotification {
  blocked = false;
  farCircle = farCircle as IconProp;
  fasMotorcycle = fasMotorcycle as IconProp;
  faGraduationCap = faGraduationCap as IconProp;
  faBookOpenReader = faBookOpenReader as IconProp;
  faCloudArrowUp = faCloudArrowUp as IconProp;
  faDiagramPredecessor = faDiagramPredecessor as IconProp;
  faSquarePollVertical = faSquarePollVertical as IconProp;
  faPersonArrowDownToLine = faPersonArrowDownToLine as IconProp;
  faPenToSquare = faPenToSquare as IconProp;
  examId = '';
  exam: IExam | undefined;
  course: ICourse | undefined;
  dockItems!: any[];
  showAlignement = false;
  showAssociation = false;
  showCorrection = false;
  nbreFeuilleParCopie = 0;
  numberPagesInScan = 0;
  // students: IStudent[] | undefined;
  sheets: IExamSheet[] = [];
  message = '';
  submessage = '';
  progress = 0;
  onExamNameEdit = false;

  firsthelp = false;
  firsthelpvalue = true;
  showInfoExam = false;
  correctionFinish = false;

  infoExamDetail = { nbrepagenonalign: 0, nbrepagealign: 0, nbrepagetemplate: 0, nbrecopie: 0, cond1: false, cond2: false, cond3: false };

  constructor(
    public courseService: CourseService,
    public examService: ExamService,
    protected activatedRoute: ActivatedRoute,
    public confirmationService: ConfirmationService,
    public examSheetService: ExamSheetService,
    //    public studentService: StudentService,
    public router: Router,
    public appConfig: ApplicationConfigService,
    public accountService: AccountService,
    private messageService: MessageService,
    public cacheUploadService: CacheUploadService,
    private translateService: TranslateService,
    private db: CacheServiceImpl,
    private preferenceService: PreferenceService,
    private titleService: Title,
  ) {}
  setShowAlignement(v: boolean): void {
    this.showAlignement = v;
  }
  setShowAssociation(v: boolean): void {
    this.showAssociation = v;
  }

  setShowCorrection(v: boolean): void {
    this.showCorrection = v;
    if (v) {
      this.examService.getExamStatusFinish(+this.examId).then(res => {
        this.correctionFinish = res;
      });
    }
  }

  updateTitle(): void {
    this.activatedRoute.data.subscribe(e => {
      this.translateService.get(e['pageTitle'], { examName: this.exam?.name, courseName: this.exam?.courseName }).subscribe(e1 => {
        this.titleService.setTitle(e1);
      });
    });
  }

  ngOnInit(): void {
    this.firsthelpvalue = this.preferenceService.showFirstCorrectMessage();
    this.firsthelp = this.firsthelpvalue;
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.blocked = true;
        this.examId = params.get('examid')!;
        this.examService.find(+this.examId).subscribe(ex => {
          this.exam = ex.body!;
          this.updateTitle();
          this.courseService.find(this.exam.courseId!).subscribe(
            e => (this.course = e.body!),
            () => {
              this.router.navigateByUrl('/');
            },
          );

          this.db.countPageTemplate(+this.examId).then(c => {
            if (c !== 0) {
              this.blocked = true;
              this.db.countNonAlignImage(+this.examId).then(c1 => {
                if (c1 !== 0) {
                  this.showAlignement = true;

                  this.checkIfAlreadyAlign().then(res => {
                    if (res && this.exam?.scanfileId) {
                      this.showAssociation = true;
                      this.initTemplate();
                    } else {
                      this.blocked = false;
                    }
                  });
                } else {
                  this.blocked = false;
                }
              });
            } else {
              if (this.exam?.scanfileId) {
                this.cacheUploadService.importCache(+this.examId, this.translateService, this.messageService, this, false);
              } else {
                this.blocked = false;
              }
            }
          });
        });

        this.translateService.get('scanexam.removeexam').subscribe(() => {
          this.initCmpt();
        });
        this.translateService.onLangChange.subscribe(() => {
          this.initCmpt();
          this.updateTitle();
        });
      }
    });
  }

  async checkIfAlreadyAlign(): Promise<boolean> {
    const p = await this.db.countNonAlignImage(+this.examId);
    const p1 = await this.db.countAlignImage(+this.examId);
    return p > 0 && p1 > 0 && p === p1;
  }

  initCmpt(): void {
    this.dockItems = [
      {
        label: this.translateService.instant('scanexam.gobacktomodule'),
        icon: this.appConfig.getFrontUrl() + 'content/images/left-arrow.svg',
        title: this.translateService.instant('scanexam.gobacktomoduledetail'),
        command1: () => {
          this.gobacktomodule();
        },
      },
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
      {
        label: this.translateService.instant('scanexam.info'),
        icon: this.appConfig.getFrontUrl() + 'content/images/info-icon.svg',
        title: this.translateService.instant('scanexam.infodetail'),
        command1: () => {
          this.getExamStatus();
        },
      },
    ];
  }

  initTemplate(): void {
    this.db.countPageTemplate(+this.examId).then(e2 => {
      this.nbreFeuilleParCopie = e2;
      // Step 2 Query Scan in local DB
      this.db.countAlignImage(+this.examId).then(e1 => {
        this.numberPagesInScan = e1;
        this.examSheetService
          .query({
            page: 0,
            size: 5000,
            scanId: this.exam!.scanfileId,
            nbreFeuilleParCopie: this.nbreFeuilleParCopie,
            numberPagesInScan: this.numberPagesInScan,
          })
          .subscribe(
            sheetsbody => {
              this.blocked = false;
              this.sheets = sheetsbody.body!.filter(sh => sh.pagemin !== -1);

              this.showCorrection =
                this.sheets.length === this.numberPagesInScan / this.nbreFeuilleParCopie && this.showAssociation && this.showAlignement;

              this.examService.getExamStatusFinish(+this.examId).then(res => {
                this.correctionFinish = res;
              });
            },
            () => {
              this.blocked = false;
            },
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
            this.db
              .removeElementForExam(+this.examId)
              .then(() => {
                this.router.navigateByUrl('/course/' + this.course!.id);
              })
              .catch(() => {
                this.messageService.add({
                  severity: 'error',
                  summary: this.translateService.instant('scanexam.deletecacheko'),
                  detail: this.translateService.instant('scanexam.deletecachekodetail'),
                });
                this.router.navigateByUrl('/course/' + this.course!.id);
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
        accept: () => {
          this.db.removeElementForExam(+this.examId).then(() => {
            this.showAlignement = false;
            this.showAssociation = false;
            this.showCorrection = false;
            this.correctionFinish = false;
          });
        },
      });
    });
  }

  confirmUpload(): any {
    this.translateService.get('scanexam.confirmuploadcache').subscribe(data => {
      this.confirmationService.confirm({
        message: data,
        accept: () => {
          this.cacheUploadService.exportCache(+this.examId, this.translateService, this.messageService, this.numberPagesInScan, this);
        },
      });
    });
  }
  setMessage(v: string): void {
    this.message = v;
  }
  setSubMessage(v: string): void {
    this.submessage = v;
  }
  setBlocked(v: boolean): void {
    this.blocked = v;
  }
  setProgress(v: number): void {
    this.progress = v;
  }

  confirmDownload(): any {
    this.translateService.get('scanexam.confirmdownloadcache').subscribe(data1 => {
      this.confirmationService.confirm({
        message: data1,
        accept: () => {
          this.blocked = true;
          this.cacheUploadService.importCache(+this.examId, this.translateService, this.messageService, this, true);
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

  gobacktomodule(): void {
    const id = this.course?.id;
    if (id !== undefined) {
      this.router.navigateByUrl(`/course/${id}`);
    }
  }

  onExamNameToggleButton(nameInput: HTMLInputElement): void {
    if (this.onExamNameEdit && this.exam?.name !== undefined && this.exam.name !== nameInput.value) {
      const oldName = this.exam.name;

      this.exam.name = nameInput.value;

      firstValueFrom(this.examService.update(this.exam)).catch(() => {
        nameInput.value = oldName;
      });
    }

    this.onExamNameEdit = !this.onExamNameEdit;
  }

  cancelEdit(nameInput: HTMLInputElement): void {
    this.onExamNameEdit = false;
    nameInput.value = this.exam!.name!;
    // Dirty, but required to launch the validation
    nameInput.dispatchEvent(new Event('input'));
  }

  onExamNameChanged(newName: string): void {
    const oldName = this.exam!.name;

    this.exam!.name = newName;

    firstValueFrom(this.examService.update(this.exam!)).catch(() => {
      this.exam!.name = oldName;
    });
  }

  changeStartPreference(): void {
    this.preferenceService.setFirstCorrectMessage(this.firsthelpvalue);
  }

  async getExamStatus(): Promise<void> {
    const dbTemplate = await this.db.countPageTemplate(+this.examId);
    const p = await this.db.countNonAlignImage(+this.examId);
    const p1 = await this.db.countAlignImage(+this.examId);
    const nbreSheet = this.sheets.length;

    const samepage = p > 0 && p1 > 0 && p === p1;
    const cond2 = nbreSheet === p1 / dbTemplate;

    this.infoExamDetail = {
      nbrepagenonalign: p,
      nbrepagealign: p1,
      nbrepagetemplate: dbTemplate,
      nbrecopie: nbreSheet,
      cond1: samepage,
      cond2,
      cond3: samepage && cond2,
    };

    this.showInfoExam = true;
  }
}
