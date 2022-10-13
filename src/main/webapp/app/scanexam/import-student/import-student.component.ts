/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotTableRegisterer } from '@handsontable/angular';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import Handsontable from 'handsontable';
import { CellChange, ChangeSource } from 'handsontable/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-import-student',
  templateUrl: './import-student.component.html',
  styleUrls: ['./import-student.component.scss'],
  providers: [MessageService],
})
export class ImportStudentComponent implements OnInit {
  dataset!: any[];
  blocked = false;
  private hotRegisterer = new HotTableRegisterer();
  id = 'hotInstance';
  val = 100;
  courseid: string | undefined = undefined;
  settings = {
    rowHeaders: true,
    colHeaders: true,
    columns: [{}, {}, {}, {}, {}],
    licenseKey: 'non-commercial-and-evaluation',
  };

  constructor(
    protected applicationConfigService: ApplicationConfigService,
    private http: HttpClient,
    private translate: TranslateService,
    private messageService: MessageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.dataset = Handsontable.helper.createSpreadsheetObjectData(this.val);
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('courseid') !== null) {
        this.courseid = params.get('courseid')!;
      }
    });
  }

  detectChanges = (changes: CellChange[] | null, source: ChangeSource) => {};
  updateTableSize(): void {
    this.dataset = Handsontable.helper.createSpreadsheetObjectData(this.val);
  }

  download(): void {
    const export1 = this.hotRegisterer.getInstance(this.id).getPlugin('exportFile');
    export1.downloadFile('csv', {
      bom: false,
      columnDelimiter: ',',
      columnHeaders: true,
      exportHiddenColumns: true,
      exportHiddenRows: false,
      fileExtension: 'csv',
      filename: 'templateEtudiant.csv',
      mimeType: 'text/csv',
      rowDelimiter: '\r\n',
      rowHeaders: false,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  ngAfterViewInit() {
    this.hotRegisterer.getInstance(this.id).render();
  }

  gotoUE(): void {
    this.router.navigateByUrl('/course/' + this.courseid);
  }

  canImport(): boolean {
    return (
      this.dataset.filter(e => e.mail !== undefined && e.mail !== '').length > 0 &&
      this.dataset.filter(e => e.ine !== undefined && e.ine !== '').length ===
        this.dataset.filter(e => e.mail !== undefined && e.mail !== '').length &&
      this.dataset.filter(e => e.ine !== undefined && e.ine !== '').length ===
        this.dataset.filter(e => e.groupe !== undefined && e.groupe !== '').length
    );
  }
  envoiEtudiants(): void {
    const c = {
      course: this.courseid,
      students: this.dataset.filter(e => e.mail !== undefined),
    };
    this.blocked = true;
    this.hotRegisterer.getInstance(this.id).suspendExecution();
    this.http.post<number>(this.applicationConfigService.getEndpointFor('api/createstudentmasse'), c).subscribe(
      () => {
        this.blocked = false;
        this.hotRegisterer.getInstance(this.id).render();
        this.translate.get('scanexam.importsuccess').subscribe(data => {
          this.messageService.add({
            severity: 'success',
            summary: data,
            detail: this.translate.instant('scanexam.importsuccessdetail'),
          });
          this.dataset = Handsontable.helper.createSpreadsheetObjectData(this.val);
          this.router.navigateByUrl('/course/' + this.courseid);
        });
      },
      err => {
        this.blocked = false;
        this.hotRegisterer.getInstance(this.id).render();
        this.translate.get('scanexam.importerror').subscribe(data => {
          this.messageService.add({
            severity: 'error',
            summary: data,
            detail: JSON.stringify(err),
          });
        });
      }
    );
  }
}
