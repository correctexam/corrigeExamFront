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
import * as FileSaver from 'file-saver';

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

  constructor(
    protected applicationConfigService: ApplicationConfigService,
    private http: HttpClient,
    private translate: TranslateService,
    private messageService: MessageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    public confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.examid = params.get('examid')!;
        this.loadEtudiants();
      }
    });
  }

  envoiEmailEtudiant(): void {
    // TODO Confirm mail box with
    const mail = {
      subject: '',
      body: '',
    };
    this.http.post('api/sendResult/' + this.examid, mail).subscribe(() => {
      // eslint-disable-next-line no-console
      this.messageService.add({
        severity: 'success',
        summary: 'Mails envoyés',
        detail: 'Tous les étudiants sont maintenant prévenus de leur résultat',
      });
    });
  }
  gotoUE(): void {
    this.router.navigateByUrl('/exam/' + this.examid);
  }
  loadEtudiants(): void {
    this.http.get('api/showResult/' + this.examid).subscribe(s => {
      // eslint-disable-next-line no-console
      this.studentsresult = s as any;
    });
  }

  exportExcel(): void {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.studentsresult);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'students');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
