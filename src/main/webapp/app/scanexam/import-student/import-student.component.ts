/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotTableRegisterer } from '@handsontable/angular';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IStudent } from 'app/entities/student/student.model';
import Handsontable from 'handsontable';
import { CellChange, ChangeSource } from 'handsontable/common';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-import-student',
  templateUrl: './import-student.component.html',
  styleUrls: ['./import-student.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ImportStudentComponent implements OnInit, AfterViewInit {
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
  students: IStudent[] = [];

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
    this.dataset = Handsontable.helper.createSpreadsheetObjectData(this.val);
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('courseid') !== null) {
        this.courseid = params.get('courseid')!;
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
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

  ngAfterViewInit(): void {
    this.hotRegisterer.getInstance(this.id).render();
  }

  gotoUE(): void {
    this.router.navigateByUrl('/course/' + this.courseid);
  }

  canImport(): boolean {
    const fullLine =
      this.dataset.filter(e => e.mail !== undefined && e.mail !== '' && e.mail !== null).length > 0 &&
      this.dataset.filter(e => e.ine !== undefined && e.ine !== '' && e.ine !== null).length ===
        this.dataset.filter(e => e.mail !== undefined && e.mail !== '' && e.mail !== null).length &&
      this.dataset.filter(e => e.ine !== undefined && e.ine !== '' && e.ine !== null).length ===
        this.dataset.filter(e => e.groupe !== undefined && e.groupe !== '' && e.groupe !== null).length;
    const duplicatemail: any[] = this.dataset.filter(e => e.mail !== undefined && e.mail !== '' && e.mail !== null).map(e => e.mail);
    const uniqemail = duplicatemail.length === [...new Set(duplicatemail)].length;
    const duplicatine: any[] = this.dataset.filter(e => e.ine !== undefined && e.ine !== '' && e.ine !== null).map(e => e.ine);
    const uniqine = duplicatine.length === [...new Set(duplicatine)].length;

    return fullLine && uniqemail && uniqine;
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

  reset(): void {
    this.translate.get('scanexam.confirmremovestudents').subscribe(data => {
      this.confirmationService.confirm({
        message: data,
        accept: () => {
          this.blocked = true;

          this.http.delete(this.applicationConfigService.getEndpointFor('api/deletegroupstudents/' + this.courseid)).subscribe(() => {
            this.loadEtudiants();
            this.blocked = false;
          });
        },
      });
    });
  }

  updateStudent(student: IStudent): void {
    this.http.put(this.applicationConfigService.getEndpointFor('api/updatestudent/' + this.courseid), student).subscribe();
  }

  updateStudentINE(student: IStudent): void {
    this.http.put(this.applicationConfigService.getEndpointFor('api/updatestudentine/' + this.courseid), student).subscribe();
  }

  updateStudentgroup(student: IStudent): void {
    this.http.put(this.applicationConfigService.getEndpointFor('api/updatestudentgroup/' + this.courseid), student).subscribe();
  }

  removeStudent(student: IStudent): void {
    this.translate.get('scanexam.confirmremovestudent').subscribe(data => {
      this.confirmationService.confirm({
        message: data,
        accept: () => {
          this.blocked = true;

          this.http.put(this.applicationConfigService.getEndpointFor('api/deletestudentgroup/' + this.courseid), student).subscribe(() => {
            this.loadEtudiants();
            this.blocked = false;
          });
        },
      });
    });
  }

  loadEtudiants(): void {
    this.http.get<Array<IStudent>>(this.applicationConfigService.getEndpointFor('api/getstudentcours/' + this.courseid)).subscribe(s => {
      this.students = s;
    });
  }

  selectTab(evt: Index): void {
    if (evt.index === 1) {
      this.loadEtudiants();
    }
  }
}

interface Index {
  index: number;
}
