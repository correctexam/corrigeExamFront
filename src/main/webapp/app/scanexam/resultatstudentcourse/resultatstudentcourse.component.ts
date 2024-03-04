/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { IExam } from '../../entities/exam/exam.model';
import { ExamService } from '../../entities/exam/service/exam.service';
import { faEnvelope, faFileCsv, faFileExcel, faTemperatureThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { ExportPdfService } from '../exportanonymoupdf/exportanonymoupdf.service';
import { firstValueFrom } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ExportResultService, formatDateTime } from '../exportresult.service';

@Component({
  selector: 'jhi-resultatstudentcourse',
  templateUrl: './resultatstudentcourse.component.html',
  styleUrls: ['./resultatstudentcourse.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ResultatStudentcourseComponent implements OnInit {
  blocked = false;
  examid: string | undefined = undefined;
  studentsresult: any[] = [];
  libelles: any;
  showEmail = false;
  mailSubject = '';
  mailBody = '';
  mailabiBody = '';
  currentStudentMail: any;
  mailabi = false;
  mailpdf = false;
  exam: IExam | undefined;

  faEnvelope = faEnvelope;
  faFileExcel = faFileExcel;
  faFileCsv = faFileCsv;
  fatemperaturethreequarters = faTemperatureThreeQuarters;

  constructor(
    protected applicationConfigService: ApplicationConfigService,
    private http: HttpClient,
    private translate: TranslateService,
    private messageService: MessageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    public confirmationService: ConfirmationService,
    public examService: ExamService,
    public exportPdfService: ExportPdfService,
    public exportResultService: ExportResultService,
    private titleService: Title,
  ) {}

  updateTitle(): void {
    this.activatedRoute.data.subscribe(data => {
      this.translate.get(data['pageTitle'], { examName: this.exam?.name, courseName: this.exam?.courseName }).subscribe(e1 => {
        this.titleService.setTitle(e1);
      });
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.examid = params.get('examid')!;

        this.examService.find(+this.examid).subscribe(e => {
          this.exam = e.body!;
          this.updateTitle();

          this.translate.get('scanexam.mailtemplate').subscribe(data => {
            this.mailSubject = this.translate.instant('scanexam.mailsubjecttemplate') + this.exam?.name;
            this.mailBody = data;
            this.mailabiBody = this.translate.instant('scanexam.mailabitemplate');
          });
          this.loadEtudiants();
          // this.loadLibelle();
        });
        this.translate.onLangChange.subscribe(() => {
          this.updateTitle();
          this.translate.get('scanexam.mailtemplate').subscribe(data => {
            if (this.exam !== undefined) {
              this.mailSubject = this.translate.instant('scanexam.mailsubjecttemplate') + this.exam.name;
              this.mailBody = data;
              this.mailabiBody = this.translate.instant('scanexam.mailabitemplate');
            }
          });
        });
      }
    });
  }

  showEmailStudent(): void {
    this.currentStudentMail = undefined;
    this.showEmail = true;
  }

  showEmailSt(st: any): void {
    this.currentStudentMail = st;
    this.showEmail = true;
  }

  async envoiEmailEtudiant(): Promise<void> {
    const mail = {
      subject: this.mailSubject,
      body: this.mailBody,
      mailabi: this.mailabi,
      mailpdf: this.mailpdf,
      bodyabi: this.mailabiBody,
      sheetuuid: this.currentStudentMail?.uuid,
    };
    this.blocked = true;
    let res = true;
    if (this.mailpdf) {
      res = await this.exportPdfService.generatePdf(this.examid!, this.messageService, false, true, this.currentStudentMail?.uuid);
    }
    try {
      if (res) {
        await firstValueFrom(this.http.post(this.applicationConfigService.getEndpointFor('api/sendResult/' + this.examid), mail));
        this.showEmail = false;
        this.currentStudentMail = undefined;
        this.translate.get('scanexam.mailsent').subscribe(data => {
          this.blocked = false;
          this.messageService.add({
            severity: 'success',
            summary: data,
            detail: this.translate.instant('scanexam.mailsentdetails'),
          });
        });
      } else {
        this.showEmail = false;
        this.currentStudentMail = undefined;

        this.translate.get('scanexam.mailnotsent').subscribe(data => {
          this.blocked = false;
          this.messageService.add({
            severity: 'error',
            summary: data,
            detail: this.translate.instant('scanexam.mailnotsentdetails'),
          });
        });
      }
    } catch (e: any) {
      this.showEmail = false;
      this.currentStudentMail = undefined;
      this.translate.get('scanexam.mailnotsent').subscribe(data => {
        this.blocked = false;
        this.messageService.add({
          severity: 'error',
          summary: data,
          detail: this.translate.instant('scanexam.mailnotsentdetails'),
        });
      });
    }
  }
  gotoUE(): void {
    this.router.navigateByUrl('/exam/' + this.examid);
  }
  loadEtudiants(): void {
    this.blocked = true;
    this.http.get(this.applicationConfigService.getEndpointFor('api/showResult/' + this.examid)).subscribe(s => {
      // eslint-disable-next-line no-console
      this.studentsresult = s as any;

      this.blocked = false;
    });
  }

  async loadLibelle(): Promise<void> {
    const l = (await firstValueFrom(
      this.http.get(this.applicationConfigService.getEndpointFor('api/getLibelleQuestions/' + this.examid)),
    )) as any;
    this.libelles = l;
  }

  exportExcel(): void {
    const studentsresult: any[] = JSON.parse(JSON.stringify(this.studentsresult));
    const filename = this.exam?.name ? 'students_export-' + this.exam.name + '-' + formatDateTime(new Date()) : 'students';
    this.loadLibelle().then(() => {
      this.exportResultService.exportExcel(studentsresult, this.libelles, filename);
    });
  }

  exportCSV(): void {
    const studentsresult: any[] = JSON.parse(JSON.stringify(this.studentsresult));
    const filename = this.exam?.name ? 'students_export-' + this.exam.name + '-' + formatDateTime(new Date()) : 'students';
    this.loadLibelle().then(() => {
      this.exportResultService.exportCSV(studentsresult, this.libelles, filename);
    });
  }
  updateStudentABJ(student: any): void {
    if (student.id) {
      firstValueFrom(
        this.http.put(
          this.applicationConfigService.getEndpointFor('api/toggleAsAbJ/' + student.id + '/' + this.examid + '/' + student.abi),
          undefined,
        ),
      );
    }
  }
}
