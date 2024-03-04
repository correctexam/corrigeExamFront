/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { IStudent } from 'app/entities/student/student.model';
import FileSaver from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';

/**
 * Used to type to data spreadsheet
 */
interface Std {
  ine?: string;
  nom?: string;
  prenom?: string;
  mail?: string;
  groupe?: string;
}

@Component({
  selector: 'jhi-import-student',
  templateUrl: './import-student.component.html',
  styleUrls: ['./import-student.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ImportStudentComponent implements OnInit {
  firstLine: Std = { ine: '', nom: '', prenom: '', mail: '', groupe: '' };
  dataset: Std[] = [];
  blocked = false;
  courseid: string | undefined = undefined;
  students: Std[] = [];
  course: ICourse | undefined;
  constructor(
    protected applicationConfigService: ApplicationConfigService,
    private http: HttpClient,
    private translate: TranslateService,
    private messageService: MessageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    public confirmationService: ConfirmationService,
    private titleService: Title,
    private courseService: CourseService,
  ) {}

  ngOnInit(): void {
    //    this.dataset = Handsontable.helper.createSpreadsheetObjectData(this.val) as Std[];
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('courseid') !== null) {
        this.courseid = params.get('courseid')!;
        this.loadEtudiants();
        this.courseService.find(+params.get('courseid')!).subscribe(
          e => {
            this.course = e.body!;
            this.updateTitle();
            this.translate.onLangChange.subscribe(() => {
              this.updateTitle();
            });
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
      this.translate.get(data['pageTitle'], { courseName: this.course?.name }).subscribe(e1 => {
        this.titleService.setTitle(e1);
      });
    });
  }

  data(event: ClipboardEvent): void {
    event.preventDefault();

    const clipboardData = event.clipboardData;

    const pastedText = clipboardData?.getData('text');
    const row_data = pastedText?.split('\n');
    const data: Std[] = [];

    const column = ['ine', 'nom', 'prenom', 'mail', 'groupe'];

    row_data?.forEach(r => {
      const row = {};
      column.forEach((a, index) => {
        (row as any)[a] = r.split('\t')[index];
      });
      data.push(row);
    });
    const data1: Std[] = data.filter(
      d =>
        typeof d.nom === 'string' &&
        d.nom.length > 0 &&
        typeof d.prenom === 'string' &&
        d.prenom.length > 0 &&
        typeof d.ine === 'string' &&
        d.ine.length > 0 &&
        typeof d.mail === 'string' &&
        d.mail.length > 0 &&
        typeof d.groupe === 'string' &&
        d.groupe.length > 0,
    );
    this.dataset.push(...data1);

    const selection = window.getSelection();
    if (selection?.rangeCount) {
      selection.deleteFromDocument();
      selection.collapseToEnd();
    }

    this.firstLine.ine = '';
  }

  canAddFirstLine(): boolean {
    return (
      typeof this.firstLine.nom === 'string' &&
      this.firstLine.nom.length > 0 &&
      typeof this.firstLine.prenom === 'string' &&
      this.firstLine.prenom.length > 0 &&
      typeof this.firstLine.ine === 'string' &&
      this.firstLine.ine.length > 0 &&
      typeof this.firstLine.mail === 'string' &&
      this.firstLine.mail.length > 0 &&
      typeof this.firstLine.groupe === 'string' &&
      this.firstLine.groupe.length > 0
    );
  }

  addStudentLine(): void {
    if (this.canAddFirstLine()) {
      this.dataset.push(this.firstLine);
      this.firstLine = {};
    }
  }

  removeNonImported(index: number): void {
    this.dataset.splice(index, 1);
  }

  download(): void {
    this.exportExcel();
  }

  exportExcel(): void {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet([this.firstLine]);
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
    FileSaver.saveAs(data, fileName + '_import_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  gotoUE(): void {
    this.router.navigateByUrl('/course/' + this.courseid);
  }

  /**
   *
   * @returns Checks whether the current data is ok to be imported
   */
  public canImport(): boolean {
    return (
      this.getNonEmptyPropValues('mail').length > 0 &&
      this.canImportSameColSize() &&
      this.canImportUniqueINE() &&
      this.canImportUniqueMails()
    );
  }

  public canImportSameColSize(): boolean {
    const mails = this.getNonEmptyPropValues('mail');
    const ines = this.getNonEmptyPropValues('ine');
    const groups = this.getNonEmptyPropValues('groupe');
    const lastname = this.getNonEmptyPropValues('nom');
    const firstname = this.getNonEmptyPropValues('prenom');

    return (
      ines.length === mails.length &&
      ines.length === groups.length &&
      lastname.length === groups.length &&
      firstname.length === lastname.length
    );
  }

  public canImportUniqueMails(): boolean {
    const mails = this.getNonEmptyPropValues('mail');
    return mails.length === [...new Set(mails)].length;
  }

  public canImportUniqueINE(): boolean {
    const ines = this.getNonEmptyPropValues('ine');
    return ines.length === [...new Set(ines)].length;
  }

  /**
   * Associated to canImport to check columns (their size).
   */
  private getNonEmptyPropValues(prop: keyof Std): string[] {
    return this.dataset.map(e => e[prop]).filter((str): str is string => typeof str === 'string' && str.length > 0);
  }

  envoiEtudiants(): void {
    const c = {
      course: this.courseid,
      students: this.dataset.filter(e => e.mail !== undefined),
    };
    this.blocked = true;
    this.http.post<number>(this.applicationConfigService.getEndpointFor('api/createstudentmasse'), c).subscribe(
      () => {
        this.blocked = false;
        this.translate.get('scanexam.importsuccess').subscribe(data => {
          this.messageService.add({
            severity: 'success',
            summary: data,
            detail: this.translate.instant('scanexam.importsuccessdetail'),
          });
          this.dataset.splice(0);
          this.loadEtudiants();
        });
      },
      err => {
        this.blocked = false;
        this.translate.get('scanexam.importerror').subscribe(data => {
          this.messageService.add({
            severity: 'error',
            summary: data,
            detail: JSON.stringify(err),
          });
        });
      },
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
    this.http.get<Array<Std>>(this.applicationConfigService.getEndpointFor('api/getstudentcours/' + this.courseid)).subscribe(s => {
      this.students = s;
    });
  }
}
