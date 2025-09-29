/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Signal, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { DataUtils } from 'app/core/util/data-util.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { IStudent } from 'app/entities/student/student.model';
import FileSaver from 'file-saver';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { FileUploadModule, type FileUpload, type FileUploadHandlerEvent } from 'primeng/fileupload';
import { InplaceModule } from 'primeng/inplace';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MessageModule } from 'primeng/message';
import { NgClass } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';

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

interface MDWStudent {
  DOSSIER: string;
  NOM: string;
  PRÉNOM: string;
  MESSAGERIE: string;
}

@Component({
  selector: 'jhi-import-student',
  templateUrl: './import-student.component.html',
  styleUrls: ['./import-student.component.scss'],
  providers: [MessageService, ConfirmationService],
  standalone: true,
  imports: [
    ToastModule,
    BlockUIModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    MessageModule,
    FaIconComponent,
    TooltipModule,
    NgClass,
    DialogModule,
    FormsModule,
    InputTextModule,
    Button,
    TableModule,
    PrimeTemplate,
    InplaceModule,
    FileUploadModule,
    TranslateDirective,
    TranslatePipe,
  ],
})
export class ImportStudentComponent implements OnInit {
  protected firstLine: Std = this.emptyStd();
  protected dataset: Std[] = [];
  protected blocked = false;
  protected courseid: string | undefined = undefined;
  protected students = signal<Std[]>([]);
  private course: ICourse | undefined;
  /** The ongoing list of students to process and add */
  private emailsToAdd: string[][] | undefined = undefined;
  /** The current email domain used to complete the student list */
  protected emailDomain: string = '';
  /** A boolean value for showing or hiding a modal popup for editing the email domain */
  protected mustSpecifyDomain: boolean = false;

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
    private dataService: DataUtils,
  ) {}

  ngOnInit(): void {
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

  /**
   * Loads an MDW file as a student list.
   */
  protected loadMDWFile(_event: unknown, _form: unknown): void {
    // Loading the file

    const event = _event as FileUploadHandlerEvent;
    const form = _form as FileUpload;

    this.dataService.loadFile(event.files[0], result => {
      if (typeof result === 'object') {
        // Loading the sheet lib
        import('xlsx').then((xlsx): void => {
          // Reading the spreadsheet
          const workbook = xlsx.read(result, { type: 'binary', cellHTML: false });
          if (workbook.SheetNames.length > 0) {
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonSheet = xlsx.utils.sheet_to_json(sheet).map(row => row as MDWStudent);
            const domain = jsonSheet
              .filter(std => std.MESSAGERIE.includes('@'))
              .at(0)
              ?.MESSAGERIE.split('@')
              .at(1);

            const data = jsonSheet.map((mdwRow): string[] => [mdwRow.DOSSIER, mdwRow.NOM, mdwRow.PRÉNOM, mdwRow.MESSAGERIE, '1']);

            this.emailsToAdd = data;
            if (domain !== undefined) {
              this.emailDomain = domain;
              this.closeDialog(true);
            }
          }
        });
      }
    });
    form.clear();
  }

  protected loadPegaseFile(_event: unknown, _form: unknown): void {
    const event = _event as FileUploadHandlerEvent;
    const form = _form as FileUpload;

    this.dataService.loadCSVFile(event.files[0], ';', data => {
      const colID = data[0].indexOf('CODE_APPRENANT');
      const colNom = data[0].indexOf('NOM_FAMILLE');
      const colPrenom = data[0].indexOf('PRENOM');

      if (colID !== -1 && colNom !== -1 && colPrenom !== -1) {
        const header = data.splice(0, 1);
        const list: string[][] = data
          // Ignoring empty or incomplete row
          .filter(row => row.length !== header.length)
          // Building a row for the table
          .map((std): string[] => [std[colID], std[colNom], std[colPrenom], '', '1']);
        this.emailsToAdd = list;
        this.mustSpecifyDomain = true;
      }
    });
    form.clear();
  }

  protected closeDialog(confirmed: boolean): void {
    this.mustSpecifyDomain = false;

    if (this.emailsToAdd === undefined || !confirmed) {
      this.emailsToAdd = undefined;
      return;
    }

    this.emailsToAdd
      .filter(std => (std.at(3) ?? '').length === 0)
      .forEach(std => {
        std[3] = `${(std.at(2) ?? '').toLowerCase()}.${(std.at(1) ?? '').toLowerCase()}@${this.emailDomain}`.replaceAll(' ', '-');
      });

    this.fillTable(this.emailsToAdd);
    this.emailsToAdd = undefined;
  }

  updateTitle(): void {
    this.activatedRoute.data.subscribe(data => {
      this.translate.get(data['pageTitle'], { courseName: this.course?.name }).subscribe(e1 => {
        this.titleService.setTitle(e1);
      });
    });
  }

  private fillTable(data: string[][]): void {
    const stds: Std[] = data
      .filter(row => row.length === 5 && row.every(elt => typeof elt === 'string' && elt.length > 0))
      .map(row => ({
        ine: row[0],
        nom: row[1],
        prenom: row[2],
        mail: row[3],
        groupe: row[4],
      }));

    this.dataset.push(...stds);

    const selection = window.getSelection();
    if (selection?.rangeCount) {
      selection.deleteFromDocument();
      selection.collapseToEnd();
    }

    this.firstLine.ine = '';
  }

  protected pasteData(event: ClipboardEvent): void {
    event.preventDefault();

    // parsing the cliplboard data
    const row_data = event.clipboardData
      ?.getData('text')
      .split('\n')
      .map(row => row.split('\t'));

    if (row_data !== undefined) {
      this.fillTable(row_data);
    }
  }

  protected addStudentLine(): void {
    if (this.canImport()) {
      this.dataset.push(this.firstLine);
      this.firstLine = this.emptyStd();
    }
  }

  private emptyStd(): Std {
    return { ine: '', nom: '', prenom: '', mail: '', groupe: '' };
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

  public hasDataSet(): boolean {
    return this.dataset.length > 0;
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
    return mails.length === new Set(mails).size;
  }

  public canImportUniqueINE(): boolean {
    const ines = this.getNonEmptyPropValues('ine');
    return ines.length === new Set(ines).size;
  }

  /**
   * Associated to canImport to check columns (their size).
   */
  private getNonEmptyPropValues(prop: keyof Std): string[] {
    // Checking all the inputs together
    const data = [...this.dataset, ...this.students(), this.firstLine];
    return data.map(e => e[prop]).filter((str): str is string => typeof str === 'string' && str.length > 0);
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

  /**
   * Resets the local student list (being edited)
   */
  protected resetLocal(): void {
    this.dataset = [];
  }

  protected reset(): void {
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
      this.students.update(() => [...s]);
    });
  }
}
