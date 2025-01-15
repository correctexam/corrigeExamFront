/* eslint-disable @typescript-eslint/no-unused-vars */

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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ApplicationConfigService } from '../../core/config/application-config.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharecourseComponent } from '../sharecourse/sharecourse.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { firstValueFrom, scan } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { PreferenceService } from '../preference-page/preference.service';
import { Title } from '@angular/platform-browser';
import { ExportResultService, formatDateTime } from '../exportresult.service';
import { FaStackComponent, FaIconComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { UsableTextInputComponent } from '../../shared/usable-text-input/usable-text-input.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DrawerModule } from 'primeng/drawer';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { NgIf, NgFor } from '@angular/common';
import { DockModule } from 'primeng/dock';
import { ButtonDirective } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TranslateDirective } from '../../shared/language/translate.directive';
import { DialogModule } from 'primeng/dialog';

export interface CacheUploadNotification {
  setMessage(v: string): void;
  setSubMessage(v: string): void;
  setBlocked(v: boolean): void;
  setProgress(v: number): void;
}

export interface CacheDownloadNotification {
  setMessage(v: string): void;
  setSubMessage(v: string): void;
  setBlocked(v: boolean): void;
  setProgress(v: number): void;
  setShowAssociation(v: boolean): void;
  setShowCorrection(v: boolean): void;
}

@Component({
  selector: 'jhi-coursdetails',
  templateUrl: './coursdetails.component.html',
  styleUrls: ['./coursdetails.component.scss'],
  providers: [ConfirmationService, DialogService],
  standalone: true,
  imports: [
    DialogModule,
    TranslateDirective,
    FormsModule,
    PrimeTemplate,
    ButtonDirective,
    DockModule,
    NgIf,
    RouterLink,
    TooltipModule,
    ConfirmDialogModule,
    BlockUIModule,
    ProgressSpinnerModule,
    DrawerModule,
    InputSwitchModule,
    NgFor,
    UsableTextInputComponent,
    FaStackComponent,
    FaIconComponent,
    FaStackItemSizeDirective,
    TranslateModule,
  ],
})
export class CoursdetailsComponent implements OnInit {
  farCircle = farCircle as IconProp;
  fasMotorcycle = fasMotorcycle as IconProp;
  faGraduationCap = faGraduationCap as IconProp;
  faBookOpenReader = faBookOpenReader as IconProp;
  exams!: IExam[];
  course: ICourse | undefined;
  dockItems!: any[];
  courseId = '';
  layoutsidebarVisible = false;
  includeStudentsData = true;

  blocked = false;
  message = '';

  firsthelp = false;
  firsthelpvalue = true;

  constructor(
    protected applicationConfigService: ApplicationConfigService,

    public courseService: CourseService,
    public examService: ExamService,
    protected activatedRoute: ActivatedRoute,
    public confirmationService: ConfirmationService,
    public router: Router,
    public appConfig: ApplicationConfigService,
    public dialogService: DialogService,
    private translateService: TranslateService,
    private http: HttpClient,
    private preferenceService: PreferenceService,
    private titleService: Title,
    private exportResultService: ExportResultService,
  ) {}

  ngOnInit(): void {
    this.firsthelpvalue = this.preferenceService.showFirstCourseMessage();
    this.firsthelp = this.firsthelpvalue;

    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('courseid') !== null) {
        this.courseId = params.get('courseid')!;
        this.translateService.get('scanexam.creerexam').subscribe(() => {
          this.initCmpt();
        });
        this.translateService.onLangChange.subscribe(() => {
          this.initCmpt();
          this.updateTitle();
        });

        this.examService.query({ courseId: params.get('courseid') }).subscribe(data => {
          this.exams = data.body!;
        });
        this.courseService.find(+params.get('courseid')!).subscribe(
          e => {
            this.course = e.body!;
            this.updateTitle();
          },
          () => {
            this.router.navigateByUrl('/');
          },
        );
      }
    });
  }

  updateTitle(): void {
    this.activatedRoute.data.subscribe(data => {
      this.translateService.get(data['pageTitle'], { courseName: this.course?.name }).subscribe(e1 => {
        this.titleService.setTitle(e1);
      });
    });
  }

  // component.ts
  // getFileName not necessary, you can just set this as a string if you wish
  getFileName(response: HttpResponse<Blob>): string {
    let filename: string;
    try {
      const contentDisposition: string = response.headers.get('content-disposition')!;
      const r = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      filename = r.exec(contentDisposition)![1];
    } catch (e) {
      filename = this.courseId + '.json';
    }
    return filename;
  }

  exportCourse(): void {
    let endpoint = 'api/exportCourse/';
    if (!this.includeStudentsData) {
      endpoint = 'api/exportCourseWithoutStudentData/';
    }
    this.layoutsidebarVisible = false;
    this.message = this.translateService.instant('scanexam.exportencours');
    this.blocked = true;

    this.http
      .get<Blob>(this.applicationConfigService.getEndpointFor(`${endpoint}${this.courseId}`), {
        observe: 'response',
        responseType: 'blob' as 'json',
      })
      .subscribe(response => {
        // this.downLoadFile(s, "application/json")
        const filename: string = this.getFileName(response);
        const binaryData = [];
        binaryData.push(response.body!);
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        this.blocked = false;
        this.message = '';
        downloadLink.click();
      });
  }

  exportExam(examId: number): void {
    let endpoint = 'api/exportExam/';
    if (!this.includeStudentsData) {
      endpoint = 'api/exportExamWithoutStudentData/';
    }
    this.layoutsidebarVisible = false;
    this.message = this.translateService.instant('scanexam.exportencours');
    this.blocked = true;

    this.http
      .get<Blob>(this.applicationConfigService.getEndpointFor(`${endpoint}${this.courseId}/${examId}`), {
        observe: 'response',
        responseType: 'blob' as 'json',
      })
      .subscribe(response => {
        // this.downLoadFile(s, "application/json")
        const filename: string = this.getFileName(response);
        const binaryData = [];
        binaryData.push(response.body!);
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        this.blocked = false;
        this.message = '';
        downloadLink.click();
      });
  }

  initCmpt(): void {
    this.dockItems = [
      {
        label: this.translateService.instant('scanexam.gobacktomodulelist'),
        icon: this.appConfig.getFrontUrl() + 'content/images/left-arrow.svg',
        title: this.translateService.instant('scanexam.gobacktomodulelistdetail'),
        command1: () => {
          this.gobacktomodulelist();
        },
      },
      {
        label: this.translateService.instant('scanexam.creerexam'),
        icon: this.appConfig.getFrontUrl() + 'content/images/exam.svg',
        title: this.translateService.instant('scanexam.creerexam'),
        route: '/creerexam/' + this.courseId,
      },
      {
        label: this.translateService.instant('scanexam.enregistreretudiant'),
        icon: this.appConfig.getFrontUrl() + 'content/images/students.svg',
        title: this.translateService.instant('scanexam.enregistreretudiant'),
        route: '/registerstudents/' + this.courseId,
      },
      {
        label: this.translateService.instant('scanexam.shareue'),
        icon: this.appConfig.getFrontUrl() + 'content/images/share-button-svgrepo-com.svg',
        title: this.translateService.instant('scanexam.shareuedetail'),
        command1: () => {
          this.showShare();
        },
      },
      {
        label: this.translateService.instant('scanexam.removeue'),
        icon: this.appConfig.getFrontUrl() + 'content/images/remove-rubbish.svg',
        title: this.translateService.instant('scanexam.removeuedetail'),
        command1: () => {
          this.confirmeDelete();
        },
      },
      {
        label: this.translateService.instant('scanexam.exportExcel'),
        icon: this.appConfig.getFrontUrl() + 'content/images/exportExcel.svg',
        title: this.translateService.instant('scanexam.exportExceldetail'),
        command1: () => {
          this.exportExcel();
        },
      },
      {
        label: this.translateService.instant('scanexam.exportCsv'),
        icon: this.appConfig.getFrontUrl() + 'content/images/exportCsv.svg',
        title: this.translateService.instant('scanexam.exportCsvdetail'),
        command1: () => {
          this.exportCsv();
        },
      },
      {
        label: this.translateService.instant('scanexam.export'),
        icon: this.appConfig.getFrontUrl() + 'content/images/import-export-outline-icon.svg',
        title: this.translateService.instant('scanexam.exportcoursetooltip'),
        command1: () => {
          this.layoutsidebarVisible = true;
        },
      },
    ];
  }

  confirmeDelete(): any {
    this.translateService.get('scanexam.removeverify').subscribe(data => {
      this.confirmationService.confirm({
        message: data,
        accept: () => {
          if (this.course !== undefined) {
            this.courseService.delete(this.course.id!).subscribe(e => {
              this.router.navigateByUrl('/');
            });
          }
        },
      });
    });
  }

  showShare(): void {
    this.translateService.get('scanexam.sharecourse').subscribe(data1 => {
      if (this.course !== undefined) {
        const ref = this.dialogService.open(SharecourseComponent, {
          data: {
            courseid: this.course.id,
          },
          header: data1,
          width: '70%',
        });
      }
    });
  }

  gobacktomodulelist(): void {
    this.router.navigateByUrl('/');
  }

  onCourseNameChanged(newName: string): void {
    const oldName = this.course!.name;

    this.course!.name = newName;

    firstValueFrom(this.courseService.update(this.course!)).catch(() => {
      this.course!.name = oldName;
    });
  }

  changeStartPreference(): void {
    this.preferenceService.setFirstCourseMessage(this.firsthelpvalue);
  }

  async exportExcel(): Promise<void> {
    const examResults = new Map<number, any[]>();
    const examNames = new Map<number, string>();
    for (const exam of this.exams) {
      const s = await firstValueFrom(this.http.get<any[]>(this.applicationConfigService.getEndpointFor('api/showResult/' + exam.id)));
      examResults.set(exam.id!, s);
      examNames.set(exam.id!, exam.name ? exam.name : 'exam' + exam.id!);
    }
    const filename = this.course?.name ? 'students_export-' + this.course.name + '-' + formatDateTime(new Date()) : 'students';
    this.exportResultService.exportExcelForModule(examNames, examResults, filename);
  }

  async exportCsv(): Promise<void> {
    const examResults = new Map<number, any[]>();
    const examNames = new Map<number, string>();
    for (const exam of this.exams) {
      const s = await firstValueFrom(this.http.get<any[]>(this.applicationConfigService.getEndpointFor('api/showResult/' + exam.id)));
      examResults.set(exam.id!, s);
      examNames.set(exam.id!, exam.name ? exam.name : 'exam' + exam.id!);
    }
    const filename = this.course?.name ? 'students_export-' + this.course.name + '-' + formatDateTime(new Date()) : 'students';

    this.exportResultService.exportCsvForModule(examNames, examResults, filename);
  }
}
