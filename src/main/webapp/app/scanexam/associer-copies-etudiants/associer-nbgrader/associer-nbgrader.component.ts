/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable prefer-const */
/* eslint-disable no-console */
import { AfterViewInit, Component, HostListener, OnInit, ViewChild, WritableSignal, effect, signal } from '@angular/core';
import { ExamService } from '../../../entities/exam/service/exam.service';
import { ZoneService } from '../../../entities/zone/service/zone.service';
import { CourseService } from 'app/entities/course/service/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem, PrimeTemplate } from 'primeng/api';
import { IExam } from 'app/entities/exam/exam.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IStudent } from '../../../entities/student/student.model';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';
import { IExamSheet } from '../../../entities/exam-sheet/exam-sheet.model';
// import { v4 as uuid } from 'uuid';
import { faHouseSignal } from '@fortawesome/free-solid-svg-icons';
import { Listbox, ListboxModule } from 'primeng/listbox';
import { PreferenceService } from '../../preference-page/preference.service';
import { ShortcutInput, KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { AllbindingsComponent } from '../allbindings/allbindings.component';
import { Title } from '@angular/platform-browser';
import { PaginatorModule } from 'primeng/paginator';
import { NgIf, NgClass } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ButtonDirective, Button } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TranslateDirective } from '../../../shared/language/translate.directive';
import { DrawerModule } from 'primeng/drawer';
import { GalleriaModule } from 'primeng/galleria';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { TemplateService } from 'app/entities/template/service/template.service';
import { QuestionService } from 'app/entities/question/service/question.service';

@Component({
  selector: 'jhi-associer-nbgrader',
  templateUrl: './associer-nbgrader.component.html',
  styleUrls: ['./associer-nbgrader.component.scss'],
  providers: [ConfirmationService, MessageService, DialogService],
  standalone: true,
  imports: [
    ToastModule,
    BlockUIModule,
    ProgressSpinnerModule,
    GalleriaModule,
    PrimeTemplate,
    KeyboardShortcutsModule,
    DrawerModule,
    TranslateDirective,
    ToggleSwitchModule,
    FormsModule,
    TooltipModule,
    SliderModule,
    ButtonDirective,
    FaIconComponent,
    Button,
    NgIf,
    PaginatorModule,
    ListboxModule,
    NgClass,
    TranslateModule,
    ProgressBarModule,
  ],
})
export class AssocierNbgraderComponent implements OnInit, AfterViewInit {
  @ViewChild('list')
  list: Listbox | undefined;
  set _list(l: Listbox | undefined) {}
  get _list(): Listbox | undefined {
    return this.list;
  }

  remainingFree = signal(0);
  faHouseSignal = faHouseSignal;
  blocked = false;
  examId = '';
  exam!: IExam;

  currentStudent = 0;
  nbreFeuilleParCopie = 0;
  numberPagesInScan = 0;
  selectionStudents: any[] = [];
  freeStudent: any[] = [];
  layoutsidebarVisible = false;
  selectionStudentsString: () => string = () => this.selectionStudents.map(s => s.name + ' ' + s.firstname).join(' - ');
  /*  showRecognizedStudent: () => string = () =>
    this.recognizedStudent?.name +
    ' ' +
    this.recognizedStudent?.firstname +
    ' (' +
    this.recognizedStudent?.ine +
    ') [score=' +
    Math.floor(this.predictionprecision) +
    ']';*/

  students: IStudent[] = [];
  assisted = true;
  baseTemplate = true;
  studentsOptions: SelectItem[] = this.getStudentOptions();

  showRecognizedStudent: WritableSignal<string> = signal<string>('');

  getStudentOptions(): SelectItem[] {
    return this.students.map(student => ({
      value: student,
      label: student.name + ' - ' + student.firstname + ' - (' + student.ine + ')',
    }));
  }
  filterbindstudent = true;
  columnstyle = {
    width: '100%',
  };

  recognizedStudent: IStudent | undefined;
  predictionprecision = 0;

  sheets: IExamSheet[] = [];
  sheetName: string = '';
  shortcuts: ShortcutInput[] = [];

  constructor(
    public examService: ExamService,
    public examsheetService: ExamSheetService,
    public zoneService: ZoneService,
    public courseService: CourseService,
    public questionService: QuestionService,
    public studentService: StudentService,
    protected activatedRoute: ActivatedRoute,
    public confirmationService: ConfirmationService,
    public router: Router,
    public messageService: MessageService,
    public sheetService: ExamSheetService,
    private preferenceService: PreferenceService,
    private translateService: TranslateService,
    public dialogService: DialogService,
    private titleService: Title,
    private templateService: TemplateService,
  ) {
    effect(
      () => {
        if (this._list?._options().length > 0) {
          this.refreshLocalStudentList();
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.filterbindstudent = this.preferenceService.getFilterStudentPreference();
    this.activatedRoute.paramMap.subscribe(params => {
      this.recognizedStudent = undefined;
      this.blocked = true;
      if (params.get('examid') !== null) {
        if (this.examId !== params.get('examid')!) {
          console.time('loadpage');
          this.examId = params.get('examid')!;

          if (params.get('currentStudent') !== null) {
            this.currentStudent = +params.get('currentStudent')! - 1;

            // const startTime = performance.now();
            // Step 1 Query templates
            console.timeLog('loadpage', 'before countTemplate');
            const promises: Promise<any>[] = [];
            promises.push(firstValueFrom(this.questionService.query({ examId: +this.examId })));
            promises.push(firstValueFrom(this.examsheetService.query({ examId: +this.examId })));
            promises.push(firstValueFrom(this.examService.find(+this.examId)));

            Promise.all(promises).then(value => {
              this.nbreFeuilleParCopie = value[0].body!.length;
              this.numberPagesInScan = value[1].body!.length * this.nbreFeuilleParCopie;
              this.sheets = value[1].body!;
              this.exam = value[2].body!;
              this.updateTitle();
              this.translateService.onLangChange.subscribe(() => {
                this.updateTitle();
              });

              this.refreshStudentList().then(() => {
                this.selectmostCloseStudent();
                this.getFilterStudent();
                this.filterLocalStudentList();

                this.countRemainingFreeSheets();
                this.blocked = false;
                console.timeEnd('loadpage');
              });
            });
          } else {
            const c = this.currentStudent + 1;
            this.router.navigateByUrl('/studentbindingsnbgrader/' + this.examId! + '/' + c);
          }
        } else {
          console.time('loadpagesameexam');
          this.currentStudent = +params.get('currentStudent')! - 1;
          this.getFilterStudent();
          this.filterLocalStudentList();
          this.blocked = false;
          console.timeEnd('loadpagesameexam');
        }
      }
    });
  }

  updateTitle(): void {
    this.activatedRoute.data.subscribe(e => {
      this.translateService.get(e['pageTitle'], { examName: this.exam?.name, courseName: this.exam?.courseName }).subscribe(e1 => {
        this.titleService.setTitle(e1);
      });
    });
  }

  async selectmostCloseStudent(): Promise<void> {
    const sheets: IExamSheet[] | null = (
      await firstValueFrom(
        this.examsheetService.query({
          scanId: this.exam!.scanfileId,
          pagemin: this.currentStudent * this.nbreFeuilleParCopie,
          pagemax: (this.currentStudent + 1) * this.nbreFeuilleParCopie - 1,
        }),
      )
    ).body;
    if (sheets !== null && sheets.length === 1) {
      this.sheetName = sheets[0].name!;

      const students = [...this.students].sort((a, b) =>
        levenshteinDistance(a.firstname! + '.' + a.name!, sheets[0].name!) <
        levenshteinDistance(b.firstname! + '.' + b.name!, sheets[0].name!)
          ? -1
          : 1,
      );
      this.recognizedStudent = students[0];
      const distance = levenshteinDistance(this.recognizedStudent.firstname! + '.' + this.recognizedStudent.name!, sheets[0].name!);
      if (distance === 0) {
        this.predictionprecision = 1;
      } else {
        this.predictionprecision =
          1 - distance / Math.max(this.recognizedStudent.firstname!.length + this.recognizedStudent.name!.length, sheets[0].name!.length);
      }
      this.showRecognizedStudent.set(
        this.recognizedStudent?.name +
          ' ' +
          this.recognizedStudent?.firstname +
          ' (' +
          this.recognizedStudent?.ine +
          ' [score=' +
          Math.floor(this.predictionprecision) +
          ']',
      );
    }
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        // ArrowRight
        key: ['ctrl + right', 'cmd + right'],
        label: 'Navigation',
        description: this.translateService.instant('scanexam.nextstudent'),
        command: () => this.nextStudent(),
        preventDefault: true,
      },
      {
        // ArrowLeft
        key: ['ctrl + left', 'cmd + left'],
        label: 'Navigation',
        description: this.translateService.instant('scanexam.previousstudent'),
        command: () => this.previousStudent(),
        preventDefault: true,
      },
    );
  }

  @HostListener('window:keydown.control.Enter', ['$event'])
  async selectRecogniezStudent(): Promise<void> {
    this.selectionStudents = [this.recognizedStudent];
    await this.bindStudent(this.selectionStudents);
    if ((this.currentStudent + 1) * this.nbreFeuilleParCopie < this.numberPagesInScan) {
      this.currentStudent = this.currentStudent + 1;
      this.goToStudent(this.currentStudent);
    } else {
      this.blocked = false;
    }
  }

  selectedColor(item: any): string {
    const list = this.list?._options!().filter(
      (s: any) =>
        s.value.examSheets === null ||
        s.value.examSheets!.length === 0 ||
        !s.value.examSheets?.some((ex: any) => ex?.scanId === this.exam.scanfileId) ||
        s.value.examSheets?.some((ex: any) => ex?.scanId === this.exam.scanfileId && ex?.pagemin === -1 && ex?.pagemax === -1),
    );
    const list1 = this.list?._options!().filter((s: any) =>
      s.value.examSheets?.some(
        (ex: any) => ex?.scanId === this.exam.scanfileId && ex?.pagemin === this.currentStudent * this.nbreFeuilleParCopie,
      ),
    );

    if (list !== undefined && list.filter((e: any) => e.label === item.label).length >= 1) {
      return 'text-green-400';
    } else if (list1 !== undefined && list1.filter((e: any) => e.label === item.label).length >= 1) {
      return '';
    } else {
      return 'text-red-400';
    }
  }

  goToStudent(i: number): void {
    if (this.list !== undefined) {
      this.list._filterValue.set('');
      //      this.list._filteredOptions = this.list._options();
    }

    if (i * this.nbreFeuilleParCopie < this.numberPagesInScan) {
      this.router.navigateByUrl('studentbindingsnbgrader/' + this.examId + '/' + (i + 1));
    }
  }

  nextStudent(): void {
    if (this.currentStudent + 1 < this.numberPagesInScan / this.nbreFeuilleParCopie) {
      this.selectionStudents = [];
      this.goToStudent(this.currentStudent + 1);
    }
  }
  previousStudent(): void {
    if (this.currentStudent - 1 >= 0) {
      this.selectionStudents = [];
      this.goToStudent(this.currentStudent - 1);
    }
  }

  onPageChange($event: any): void {
    this.selectionStudents = [];
    this.goToStudent($event.page);
  }

  selectStudent4Copie($event: any): void {
    this.selectionStudents = $event.value;
  }

  private reviver(key: any, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  gotoUE(): any {
    this.router.navigateByUrl('/exam/' + this.examId);
  }

  async refreshStudentList(): Promise<void> {
    this.blocked = true;
    const studentsbody = await firstValueFrom(this.studentService.query({ courseId: this.exam.courseId }));
    this.students = studentsbody.body!;
    this.studentsOptions = this.getStudentOptions();
  }

  filterLocalStudentList(): void {
    if (this.filterbindstudent && this.list !== undefined) {
      const l1 = this.getStudentOptions();

      const l = l1.filter(
        (s: any) =>
          s.value.examSheets === null ||
          s.value.examSheets!.length === 0 ||
          !s.value.examSheets?.some((ex: any) => ex?.scanId === this.exam.scanfileId) ||
          s.value.examSheets?.some((ex: any) => ex?.scanId === this.exam.scanfileId && ex?.pagemin === -1 && ex?.pagemax === -1) ||
          s.value.examSheets?.some(
            (ex: any) => ex?.scanId === this.exam.scanfileId && ex?.pagemin === this.currentStudent * this.nbreFeuilleParCopie,
          ),
      );
      if (
        l.length !== this.list?._options!().length ||
        (l.length > 0 && this.list?._options!().length > 0 && this.list?._options!()[0].value.id !== l[0].value.id)
      ) {
        this.list?._options.set(l);
      }
    } else {
      // this.list._filterValue = '';

      if (this.list !== undefined) {
        const l = this.getStudentOptions();
        if (l.length !== this.list?._options!().length) {
          this.list?._options.set(l);
        }

        //        this.list._filteredOptions = this.list._options();
      }
    }
  }

  refreshLocalStudentList(): void {
    if (this.list !== undefined) {
      this.list._filterValue.set('');
    }

    this.preferenceService.saveFilterStudentPreference(this.filterbindstudent);
    this.filterLocalStudentList();

    // Step 5 Bind All copies
    this.getFilterStudent();
  }

  getFilterStudent(): void {
    const filterStudent = this.students.filter(s =>
      s.examSheets?.some(ex => ex?.scanId === this.exam.scanfileId && ex?.pagemin === this.currentStudent * this.nbreFeuilleParCopie),
    );
    this.selectionStudents = filterStudent;
    const freeStudent = this.students.filter(
      s =>
        s.examSheets === null ||
        s.examSheets!.length === 0 ||
        !s.examSheets?.some((ex: any) => ex?.scanId === this.exam.scanfileId) ||
        s.examSheets?.some((ex: any) => ex?.scanId === this.exam.scanfileId && ex?.pagemin === -1 && ex?.pagemax === -1) ||
        s.examSheets?.some(
          (ex: any) => ex?.scanId === this.exam.scanfileId && ex?.pagemin === this.currentStudent * this.nbreFeuilleParCopie,
        ),
    );
    this.freeStudent = freeStudent;
  }

  async selectStudents(event: IStudent): Promise<void> {
    this.blocked = true;
    this.selectionStudents = [event];

    await this.bindStudent(this.selectionStudents);
    if ((this.currentStudent + 1) * this.nbreFeuilleParCopie < this.numberPagesInScan) {
      this.currentStudent = this.currentStudent + 1;
      this.blocked = false;

      this.goToStudent(this.currentStudent);
    } else {
      this.blocked = false;
    }
  }
  async bindStudentOnClick(event: any): Promise<void> {
    this.selectionStudents = event;
    this.blocked = true;
    await this.bindStudent(event);
    this.blocked = false;
  }

  async bindStudent(selectionStudents: IStudent[]): Promise<void> {
    const examSheet4CurrentStudent1: IExamSheet[] = [...new Set(this.students.flatMap(s => s.examSheets!))].filter(
      sh =>
        sh.pagemin === this.currentStudent * this.nbreFeuilleParCopie &&
        sh.pagemax === (this.currentStudent + 1) * this.nbreFeuilleParCopie - 1 &&
        sh.scanId === this.exam.scanfileId,
    );

    // ExamSheetExist
    if (examSheet4CurrentStudent1.length === 1) {
      const sheet = examSheet4CurrentStudent1[0];
      sheet.students = selectionStudents;
      await firstValueFrom(
        this.examsheetService.updateStudents(
          sheet.id!,
          selectionStudents.map(e => e.id as number),
        ),
      );
    } else if (examSheet4CurrentStudent1.length > 1) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('scanexam.deuxfeuillepourlamemecopie'),
        detail: this.translateService.instant('scanexam.deuxfeuillepourlamemecopieTooltip'),
      });
    }
    // ExamSheetNotExist
    else {
      const sheets: IExamSheet[] | null = (
        await firstValueFrom(
          this.examsheetService.query({
            scanId: this.exam!.scanfileId,
            pagemin: this.currentStudent * this.nbreFeuilleParCopie,
            pagemax: (this.currentStudent + 1) * this.nbreFeuilleParCopie - 1,
          }),
        )
      ).body;
      if (sheets !== null && sheets.length === 1) {
        await firstValueFrom(
          this.examsheetService.updateStudents(
            sheets[0].id!,
            selectionStudents.map(e => e.id as number),
          ),
        );
      } else {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('scanexam.deuxfeuillepourlamemecopie'),
          detail: this.translateService.instant('scanexam.deuxfeuillepourlamemecopieTooltip'),
        });
      }
    }
    await this.refreshStudentList();
    this.countRemainingFreeSheets();
  }

  async unbindCurrentStudent(): Promise<void> {
    const examSheet4CurrentStudent1: IExamSheet[] = [...new Set(this.students.flatMap(s => s.examSheets!))].filter(
      sh =>
        sh.pagemin === this.currentStudent * this.nbreFeuilleParCopie &&
        sh.pagemax === (this.currentStudent + 1) * this.nbreFeuilleParCopie - 1,
    );
    // ExamSheetExist
    if (examSheet4CurrentStudent1.length >= 0) {
      const sheet = examSheet4CurrentStudent1[0];
      sheet.students = [];
      await firstValueFrom(this.examsheetService.updateStudents(sheet.id!, []));

      await this.refreshStudentList();
      this.getFilterStudent();
      this.blocked = false;
    }
    this.countRemainingFreeSheets();
  }

  countRemainingFreeSheets(): void {
    const examSheet4Exam: IExamSheet[] = (this.students.map(s => s.examSheets) as any)
      .flat()
      .filter((ex: any) => ex?.scanId === this.exam.scanfileId);
    let countAllFreeSheet: number = 0;
    for (let i = 0; i < Math.floor(this.numberPagesInScan / this.nbreFeuilleParCopie); i++) {
      if (!examSheet4Exam.map(sheet => sheet.pagemin! / this.nbreFeuilleParCopie).includes(i)) {
        countAllFreeSheet = countAllFreeSheet + 1;
      }
    }
    let l = Math.floor(this.numberPagesInScan / this.nbreFeuilleParCopie) - countAllFreeSheet;
    l = (l / (this.numberPagesInScan! / this.nbreFeuilleParCopie!)) * 100;
    this.remainingFree.set(l);
  }

  computeFreeSheets(): number[] {
    const examSheet4Exam: IExamSheet[] = (this.students.map(s => s.examSheets) as any)
      .flat()
      .filter((ex: any) => ex?.scanId === this.exam.scanfileId);

    let listAllFreeSheet: number[] = [];
    for (let i = 0; i < Math.floor(this.numberPagesInScan / this.nbreFeuilleParCopie); i++) {
      if (!examSheet4Exam.map(sheet => sheet.pagemin! / this.nbreFeuilleParCopie).includes(i)) {
        listAllFreeSheet.push(i);
      }
    }

    return listAllFreeSheet;
  }

  cleanBinding(): void {
    this.blocked = true;

    this.examService.deleteAllExamSheets(+this.examId).subscribe(() => {
      this.filterbindstudent = false;
      this.preferenceService.saveFilterStudentPreference(false);
      this.refreshStudentList().then(() => {
        this.countRemainingFreeSheets();
        this.getFilterStudent();

        this.blocked = false;
      });
    });
  }

  testLoadImage4pages(pagesToAnalyze: number[]): any[] {
    const result: any[] = [];
    this.getFilterStudent();

    this.sheets.sort((sh1, sh2) => (sh1 < sh2 ? 1 : -1));
    const sheets1 = this.sheets.filter((sh, index) => pagesToAnalyze.includes(index));
    let shpage = 0;
    for (const sh of sheets1) {
      const res: any = {};
      const students = [...this.freeStudent].sort((a, b) =>
        levenshteinDistance(a.firstname! + '.' + a.name!, sh.name!) < levenshteinDistance(b.firstname! + '.' + b.name!, sh.name!) ? -1 : 1,
      );
      const recognizedStudent = students[0];
      const distance = levenshteinDistance(recognizedStudent.firstname! + '.' + recognizedStudent.name!, sh.name!);
      let predictionprecision = 1;
      if (distance !== 0) {
        predictionprecision =
          1 - distance / Math.max(recognizedStudent.firstname!.length + recognizedStudent.name!.length, sh.name!.length);
      }
      res.page = shpage * this.nbreFeuilleParCopie;
      res.predictionprecision = predictionprecision;
      res.recognizedStudent = recognizedStudent;
      res.nbName = sh.name;
      result.push(res);
      shpage = shpage + 1;
    }
    return result;
  }

  async openAllBinding(): Promise<void> {
    const freeSheets = this.computeFreeSheets();

    if (freeSheets.length > 0) {
      this.blocked = true;
      // const res1 = {};

      const res1 = this.testLoadImage4pages(freeSheets.map(e => e * this.nbreFeuilleParCopie!));
      this.blocked = false;

      const ref = this.dialogService.open(AllbindingsComponent, {
        header: '',
        width: '100%',
        closable: true,
        maximizable: true,
        data: {
          students: res1,
          nbreFeuilleParCopie: this.nbreFeuilleParCopie,
          exam: this.exam,
        },
      });

      ref.onClose.subscribe(() => {
        this.refreshStudentList().then(() => {
          this.blocked = false;
          this.countRemainingFreeSheets();
        });
      });
    } else {
      this.messageService.add({
        severity: 'info',
        summary: this.translateService.instant('scanexam.pasdepageassociee'),
        detail: this.translateService.instant('scanexam.pasdepageassocieeTooltip'),
      });
    }
  }

  gotopreviousnonboundsheet(): void {
    const free = this.computeFreeSheets();

    const s = free.find(v => v < this.currentStudent);
    if (s !== undefined) {
      this.goToStudent(s);
    } else {
      this.messageService.add({
        severity: 'info',
        summary: this.translateService.instant('scanexam.pasdepageassociee'),
        detail: this.translateService.instant('scanexam.pasdepageassocieePreviousTooltip'),
      });
    }
  }
  gotonextnonboundsheet(): void {
    const free = this.computeFreeSheets();

    const s = free.find(v => v > this.currentStudent);
    if (s !== undefined) {
      this.goToStudent(s);
    } else {
      this.messageService.add({
        severity: 'info',
        summary: this.translateService.instant('scanexam.pasdepageassociee'),
        detail: this.translateService.instant('scanexam.pasdepageassocieeNextTooltip'),
      });
    }
  }

  latinMap(): Map<string, string> {
    return new Map<string, string>([
      ['Á', 'A'],
      ['Ă', 'A'],
      ['Ắ', 'A'],
      ['Ặ', 'A'],
      ['Ằ', 'A'],
      ['Ẳ', 'A'],
      ['Ẵ', 'A'],
      ['Ǎ', 'A'],
      ['Â', 'A'],
      ['Ấ', 'A'],
      ['Ậ', 'A'],
      ['Ầ', 'A'],
      ['Ẩ', 'A'],
      ['Ẫ', 'A'],
      ['Ä', 'A'],
      ['Ǟ', 'A'],
      ['Ȧ', 'A'],
      ['Ǡ', 'A'],
      ['Ạ', 'A'],
      ['Ȁ', 'A'],
      ['À', 'A'],
      ['Ả', 'A'],
      ['Ȃ', 'A'],
      ['Ā', 'A'],
      ['Ą', 'A'],
      ['Å', 'A'],
      ['Ǻ', 'A'],
      ['Ḁ', 'A'],
      ['Ⱥ', 'A'],
      ['Ã', 'A'],
      ['Ꜳ', 'AA'],
      ['Æ', 'AE'],
      ['Ǽ', 'AE'],
      ['Ǣ', 'AE'],
      ['Ꜵ', 'AO'],
      ['Ꜷ', 'AU'],
      ['Ꜹ', 'AV'],
      ['Ꜻ', 'AV'],
      ['Ꜽ', 'AY'],
      ['Ḃ', 'B'],
      ['Ḅ', 'B'],
      ['Ɓ', 'B'],
      ['Ḇ', 'B'],
      ['Ƀ', 'B'],
      ['Ƃ', 'B'],
      ['Ć', 'C'],
      ['Č', 'C'],
      ['Ç', 'C'],
      ['Ḉ', 'C'],
      ['Ĉ', 'C'],
      ['Ċ', 'C'],
      ['Ƈ', 'C'],
      ['Ȼ', 'C'],
      ['Ď', 'D'],
      ['Ḑ', 'D'],
      ['Ḓ', 'D'],
      ['Ḋ', 'D'],
      ['Ḍ', 'D'],
      ['Ɗ', 'D'],
      ['Ḏ', 'D'],
      ['ǲ', 'D'],
      ['ǅ', 'D'],
      ['Đ', 'D'],
      ['Ƌ', 'D'],
      ['Ǳ', 'DZ'],
      ['Ǆ', 'DZ'],
      ['É', 'E'],
      ['Ĕ', 'E'],
      ['Ě', 'E'],
      ['Ȩ', 'E'],
      ['Ḝ', 'E'],
      ['Ê', 'E'],
      ['Ế', 'E'],
      ['Ệ', 'E'],
      ['Ề', 'E'],
      ['Ể', 'E'],
      ['Ễ', 'E'],
      ['Ḙ', 'E'],
      ['Ë', 'E'],
      ['Ė', 'E'],
      ['Ẹ', 'E'],
      ['Ȅ', 'E'],
      ['È', 'E'],
      ['Ẻ', 'E'],
      ['Ȇ', 'E'],
      ['Ē', 'E'],
      ['Ḗ', 'E'],
      ['Ḕ', 'E'],
      ['Ę', 'E'],
      ['Ɇ', 'E'],
      ['Ẽ', 'E'],
      ['Ḛ', 'E'],
      ['Ꝫ', 'ET'],
      ['Ḟ', 'F'],
      ['Ƒ', 'F'],
      ['Ǵ', 'G'],
      ['Ğ', 'G'],
      ['Ǧ', 'G'],
      ['Ģ', 'G'],
      ['Ĝ', 'G'],
      ['Ġ', 'G'],
      ['Ɠ', 'G'],
      ['Ḡ', 'G'],
      ['Ǥ', 'G'],
      ['Ḫ', 'H'],
      ['Ȟ', 'H'],
      ['Ḩ', 'H'],
      ['Ĥ', 'H'],
      ['Ⱨ', 'H'],
      ['Ḧ', 'H'],
      ['Ḣ', 'H'],
      ['Ḥ', 'H'],
      ['Ħ', 'H'],
      ['Í', 'I'],
      ['Ĭ', 'I'],
      ['Ǐ', 'I'],
      ['Î', 'I'],
      ['Ï', 'I'],
      ['Ḯ', 'I'],
      ['İ', 'I'],
      ['Ị', 'I'],
      ['Ȉ', 'I'],
      ['Ì', 'I'],
      ['Ỉ', 'I'],
      ['Ȋ', 'I'],
      ['Ī', 'I'],
      ['Į', 'I'],
      ['Ɨ', 'I'],
      ['Ĩ', 'I'],
      ['Ḭ', 'I'],
      ['Ꝺ', 'D'],
      ['Ꝼ', 'F'],
      ['Ᵹ', 'G'],
      ['Ꞃ', 'R'],
      ['Ꞅ', 'S'],
      ['Ꞇ', 'T'],
      ['Ꝭ', 'IS'],
      ['Ĵ', 'J'],
      ['Ɉ', 'J'],
      ['Ḱ', 'K'],
      ['Ǩ', 'K'],
      ['Ķ', 'K'],
      ['Ⱪ', 'K'],
      ['Ꝃ', 'K'],
      ['Ḳ', 'K'],
      ['Ƙ', 'K'],
      ['Ḵ', 'K'],
      ['Ꝁ', 'K'],
      ['Ꝅ', 'K'],
      ['Ĺ', 'L'],
      ['Ƚ', 'L'],
      ['Ľ', 'L'],
      ['Ļ', 'L'],
      ['Ḽ', 'L'],
      ['Ḷ', 'L'],
      ['Ḹ', 'L'],
      ['Ⱡ', 'L'],
      ['Ꝉ', 'L'],
      ['Ḻ', 'L'],
      ['Ŀ', 'L'],
      ['Ɫ', 'L'],
      ['ǈ', 'L'],
      ['Ł', 'L'],
      ['Ǉ', 'LJ'],
      ['Ḿ', 'M'],
      ['Ṁ', 'M'],
      ['Ṃ', 'M'],
      ['Ɱ', 'M'],
      ['Ń', 'N'],
      ['Ň', 'N'],
      ['Ņ', 'N'],
      ['Ṋ', 'N'],
      ['Ṅ', 'N'],
      ['Ṇ', 'N'],
      ['Ǹ', 'N'],
      ['Ɲ', 'N'],
      ['Ṉ', 'N'],
      ['Ƞ', 'N'],
      ['ǋ', 'N'],
      ['Ñ', 'N'],
      ['Ǌ', 'NJ'],
      ['Ó', 'O'],
      ['Ŏ', 'O'],
      ['Ǒ', 'O'],
      ['Ô', 'O'],
      ['Ố', 'O'],
      ['Ộ', 'O'],
      ['Ồ', 'O'],
      ['Ổ', 'O'],
      ['Ỗ', 'O'],
      ['Ö', 'O'],
      ['Ȫ', 'O'],
      ['Ȯ', 'O'],
      ['Ȱ', 'O'],
      ['Ọ', 'O'],
      ['Ő', 'O'],
      ['Ȍ', 'O'],
      ['Ò', 'O'],
      ['Ỏ', 'O'],
      ['Ơ', 'O'],
      ['Ớ', 'O'],
      ['Ợ', 'O'],
      ['Ờ', 'O'],
      ['Ở', 'O'],
      ['Ỡ', 'O'],
      ['Ȏ', 'O'],
      ['Ꝋ', 'O'],
      ['Ꝍ', 'O'],
      ['Ō', 'O'],
      ['Ṓ', 'O'],
      ['Ṑ', 'O'],
      ['Ɵ', 'O'],
      ['Ǫ', 'O'],
      ['Ǭ', 'O'],
      ['Ø', 'O'],
      ['Ǿ', 'O'],
      ['Õ', 'O'],
      ['Ṍ', 'O'],
      ['Ṏ', 'O'],
      ['Ȭ', 'O'],
      ['Ƣ', 'OI'],
      ['Ꝏ', 'OO'],
      ['Ɛ', 'E'],
      ['Ɔ', 'O'],
      ['Ȣ', 'OU'],
      ['Ṕ', 'P'],
      ['Ṗ', 'P'],
      ['Ꝓ', 'P'],
      ['Ƥ', 'P'],
      ['Ꝕ', 'P'],
      ['Ᵽ', 'P'],
      ['Ꝑ', 'P'],
      ['Ꝙ', 'Q'],
      ['Ꝗ', 'Q'],
      ['Ŕ', 'R'],
      ['Ř', 'R'],
      ['Ŗ', 'R'],
      ['Ṙ', 'R'],
      ['Ṛ', 'R'],
      ['Ṝ', 'R'],
      ['Ȑ', 'R'],
      ['Ȓ', 'R'],
      ['Ṟ', 'R'],
      ['Ɍ', 'R'],
      ['Ɽ', 'R'],
      ['Ꜿ', 'C'],
      ['Ǝ', 'E'],
      ['Ś', 'S'],
      ['Ṥ', 'S'],
      ['Š', 'S'],
      ['Ṧ', 'S'],
      ['Ş', 'S'],
      ['Ŝ', 'S'],
      ['Ș', 'S'],
      ['Ṡ', 'S'],
      ['Ṣ', 'S'],
      ['Ṩ', 'S'],
      ['Ť', 'T'],
      ['Ţ', 'T'],
      ['Ṱ', 'T'],
      ['Ț', 'T'],
      ['Ⱦ', 'T'],
      ['Ṫ', 'T'],
      ['Ṭ', 'T'],
      ['Ƭ', 'T'],
      ['Ṯ', 'T'],
      ['Ʈ', 'T'],
      ['Ŧ', 'T'],
      ['Ɐ', 'A'],
      ['Ꞁ', 'L'],
      ['Ɯ', 'M'],
      ['Ʌ', 'V'],
      ['Ꜩ', 'TZ'],
      ['Ú', 'U'],
      ['Ŭ', 'U'],
      ['Ǔ', 'U'],
      ['Û', 'U'],
      ['Ṷ', 'U'],
      ['Ü', 'U'],
      ['Ǘ', 'U'],
      ['Ǚ', 'U'],
      ['Ǜ', 'U'],
      ['Ǖ', 'U'],
      ['Ṳ', 'U'],
      ['Ụ', 'U'],
      ['Ű', 'U'],
      ['Ȕ', 'U'],
      ['Ù', 'U'],
      ['Ủ', 'U'],
      ['Ư', 'U'],
      ['Ứ', 'U'],
      ['Ự', 'U'],
      ['Ừ', 'U'],
      ['Ử', 'U'],
      ['Ữ', 'U'],
      ['Ȗ', 'U'],
      ['Ū', 'U'],
      ['Ṻ', 'U'],
      ['Ų', 'U'],
      ['Ů', 'U'],
      ['Ũ', 'U'],
      ['Ṹ', 'U'],
      ['Ṵ', 'U'],
      ['Ꝟ', 'V'],
      ['Ṿ', 'V'],
      ['Ʋ', 'V'],
      ['Ṽ', 'V'],
      ['Ꝡ', 'VY'],
      ['Ẃ', 'W'],
      ['Ŵ', 'W'],
      ['Ẅ', 'W'],
      ['Ẇ', 'W'],
      ['Ẉ', 'W'],
      ['Ẁ', 'W'],
      ['Ⱳ', 'W'],
      ['Ẍ', 'X'],
      ['Ẋ', 'X'],
      ['Ý', 'Y'],
      ['Ŷ', 'Y'],
      ['Ÿ', 'Y'],
      ['Ẏ', 'Y'],
      ['Ỵ', 'Y'],
      ['Ỳ', 'Y'],
      ['Ƴ', 'Y'],
      ['Ỷ', 'Y'],
      ['Ỿ', 'Y'],
      ['Ȳ', 'Y'],
      ['Ɏ', 'Y'],
      ['Ỹ', 'Y'],
      ['Ź', 'Z'],
      ['Ž', 'Z'],
      ['Ẑ', 'Z'],
      ['Ⱬ', 'Z'],
      ['Ż', 'Z'],
      ['Ẓ', 'Z'],
      ['Ȥ', 'Z'],
      ['Ẕ', 'Z'],
      ['Ƶ', 'Z'],
      ['Ĳ', 'IJ'],
      ['Œ', 'OE'],
      ['ᴀ', 'A'],
      ['ᴁ', 'AE'],
      ['ʙ', 'B'],
      ['ᴃ', 'B'],
      ['ᴄ', 'C'],
      ['ᴅ', 'D'],
      ['ᴇ', 'E'],
      ['ꜰ', 'F'],
      ['ɢ', 'G'],
      ['ʛ', 'G'],
      ['ʜ', 'H'],
      ['ɪ', 'I'],
      ['ʁ', 'R'],
      ['ᴊ', 'J'],
      ['ᴋ', 'K'],
      ['ʟ', 'L'],
      ['ᴌ', 'L'],
      ['ᴍ', 'M'],
      ['ɴ', 'N'],
      ['ᴏ', 'O'],
      ['ɶ', 'OE'],
      ['ᴐ', 'O'],
      ['ᴕ', 'OU'],
      ['ᴘ', 'P'],
      ['ʀ', 'R'],
      ['ᴎ', 'N'],
      ['ᴙ', 'R'],
      ['ꜱ', 'S'],
      ['ᴛ', 'T'],
      ['ⱻ', 'E'],
      ['ᴚ', 'R'],
      ['ᴜ', 'U'],
      ['ᴠ', 'V'],
      ['ᴡ', 'W'],
      ['ʏ', 'Y'],
      ['ᴢ', 'Z'],
      ['á', 'a'],
      ['ă', 'a'],
      ['ắ', 'a'],
      ['ặ', 'a'],
      ['ằ', 'a'],
      ['ẳ', 'a'],
      ['ẵ', 'a'],
      ['ǎ', 'a'],
      ['â', 'a'],
      ['ấ', 'a'],
      ['ậ', 'a'],
      ['ầ', 'a'],
      ['ẩ', 'a'],
      ['ẫ', 'a'],
      ['ä', 'a'],
      ['ǟ', 'a'],
      ['ȧ', 'a'],
      ['ǡ', 'a'],
      ['ạ', 'a'],
      ['ȁ', 'a'],
      ['à', 'a'],
      ['ả', 'a'],
      ['ȃ', 'a'],
      ['ā', 'a'],
      ['ą', 'a'],
      ['ᶏ', 'a'],
      ['ẚ', 'a'],
      ['å', 'a'],
      ['ǻ', 'a'],
      ['ḁ', 'a'],
      ['ⱥ', 'a'],
      ['ã', 'a'],
      ['ꜳ', 'aa'],
      ['æ', 'ae'],
      ['ǽ', 'ae'],
      ['ǣ', 'ae'],
      ['ꜵ', 'ao'],
      ['ꜷ', 'au'],
      ['ꜹ', 'av'],
      ['ꜻ', 'av'],
      ['ꜽ', 'ay'],
      ['ḃ', 'b'],
      ['ḅ', 'b'],
      ['ɓ', 'b'],
      ['ḇ', 'b'],
      ['ᵬ', 'b'],
      ['ᶀ', 'b'],
      ['ƀ', 'b'],
      ['ƃ', 'b'],
      ['ɵ', 'o'],
      ['ć', 'c'],
      ['č', 'c'],
      ['ç', 'c'],
      ['ḉ', 'c'],
      ['ĉ', 'c'],
      ['ɕ', 'c'],
      ['ċ', 'c'],
      ['ƈ', 'c'],
      ['ȼ', 'c'],
      ['ď', 'd'],
      ['ḑ', 'd'],
      ['ḓ', 'd'],
      ['ȡ', 'd'],
      ['ḋ', 'd'],
      ['ḍ', 'd'],
      ['ɗ', 'd'],
      ['ᶑ', 'd'],
      ['ḏ', 'd'],
      ['ᵭ', 'd'],
      ['ᶁ', 'd'],
      ['đ', 'd'],
      ['ɖ', 'd'],
      ['ƌ', 'd'],
      ['ı', 'i'],
      ['ȷ', 'j'],
      ['ɟ', 'j'],
      ['ʄ', 'j'],
      ['ǳ', 'dz'],
      ['ǆ', 'dz'],
      ['é', 'e'],
      ['ĕ', 'e'],
      ['ě', 'e'],
      ['ȩ', 'e'],
      ['ḝ', 'e'],
      ['ê', 'e'],
      ['ế', 'e'],
      ['ệ', 'e'],
      ['ề', 'e'],
      ['ể', 'e'],
      ['ễ', 'e'],
      ['ḙ', 'e'],
      ['ë', 'e'],
      ['ė', 'e'],
      ['ẹ', 'e'],
      ['ȅ', 'e'],
      ['è', 'e'],
      ['ẻ', 'e'],
      ['ȇ', 'e'],
      ['ē', 'e'],
      ['ḗ', 'e'],
      ['ḕ', 'e'],
      ['ⱸ', 'e'],
      ['ę', 'e'],
      ['ᶒ', 'e'],
      ['ɇ', 'e'],
      ['ẽ', 'e'],
      ['ḛ', 'e'],
      ['ꝫ', 'et'],
      ['ḟ', 'f'],
      ['ƒ', 'f'],
      ['ᵮ', 'f'],
      ['ᶂ', 'f'],
      ['ǵ', 'g'],
      ['ğ', 'g'],
      ['ǧ', 'g'],
      ['ģ', 'g'],
      ['ĝ', 'g'],
      ['ġ', 'g'],
      ['ɠ', 'g'],
      ['ḡ', 'g'],
      ['ᶃ', 'g'],
      ['ǥ', 'g'],
      ['ḫ', 'h'],
      ['ȟ', 'h'],
      ['ḩ', 'h'],
      ['ĥ', 'h'],
      ['ⱨ', 'h'],
      ['ḧ', 'h'],
      ['ḣ', 'h'],
      ['ḥ', 'h'],
      ['ɦ', 'h'],
      ['ẖ', 'h'],
      ['ħ', 'h'],
      ['ƕ', 'hv'],
      ['í', 'i'],
      ['ĭ', 'i'],
      ['ǐ', 'i'],
      ['î', 'i'],
      ['ï', 'i'],
      ['ḯ', 'i'],
      ['ị', 'i'],
      ['ȉ', 'i'],
      ['ì', 'i'],
      ['ỉ', 'i'],
      ['ȋ', 'i'],
      ['ī', 'i'],
      ['į', 'i'],
      ['ᶖ', 'i'],
      ['ɨ', 'i'],
      ['ĩ', 'i'],
      ['ḭ', 'i'],
      ['ꝺ', 'd'],
      ['ꝼ', 'f'],
      ['ᵹ', 'g'],
      ['ꞃ', 'r'],
      ['ꞅ', 's'],
      ['ꞇ', 't'],
      ['ꝭ', 'is'],
      ['ǰ', 'j'],
      ['ĵ', 'j'],
      ['ʝ', 'j'],
      ['ɉ', 'j'],
      ['ḱ', 'k'],
      ['ǩ', 'k'],
      ['ķ', 'k'],
      ['ⱪ', 'k'],
      ['ꝃ', 'k'],
      ['ḳ', 'k'],
      ['ƙ', 'k'],
      ['ḵ', 'k'],
      ['ᶄ', 'k'],
      ['ꝁ', 'k'],
      ['ꝅ', 'k'],
      ['ĺ', 'l'],
      ['ƚ', 'l'],
      ['ɬ', 'l'],
      ['ľ', 'l'],
      ['ļ', 'l'],
      ['ḽ', 'l'],
      ['ȴ', 'l'],
      ['ḷ', 'l'],
      ['ḹ', 'l'],
      ['ⱡ', 'l'],
      ['ꝉ', 'l'],
      ['ḻ', 'l'],
      ['ŀ', 'l'],
      ['ɫ', 'l'],
      ['ᶅ', 'l'],
      ['ɭ', 'l'],
      ['ł', 'l'],
      ['ǉ', 'lj'],
      ['ſ', 's'],
      ['ẜ', 's'],
      ['ẛ', 's'],
      ['ẝ', 's'],
      ['ḿ', 'm'],
      ['ṁ', 'm'],
      ['ṃ', 'm'],
      ['ɱ', 'm'],
      ['ᵯ', 'm'],
      ['ᶆ', 'm'],
      ['ń', 'n'],
      ['ň', 'n'],
      ['ņ', 'n'],
      ['ṋ', 'n'],
      ['ȵ', 'n'],
      ['ṅ', 'n'],
      ['ṇ', 'n'],
      ['ǹ', 'n'],
      ['ɲ', 'n'],
      ['ṉ', 'n'],
      ['ƞ', 'n'],
      ['ᵰ', 'n'],
      ['ᶇ', 'n'],
      ['ɳ', 'n'],
      ['ñ', 'n'],
      ['ǌ', 'nj'],
      ['ó', 'o'],
      ['ŏ', 'o'],
      ['ǒ', 'o'],
      ['ô', 'o'],
      ['ố', 'o'],
      ['ộ', 'o'],
      ['ồ', 'o'],
      ['ổ', 'o'],
      ['ỗ', 'o'],
      ['ö', 'o'],
      ['ȫ', 'o'],
      ['ȯ', 'o'],
      ['ȱ', 'o'],
      ['ọ', 'o'],
      ['ő', 'o'],
      ['ȍ', 'o'],
      ['ò', 'o'],
      ['ỏ', 'o'],
      ['ơ', 'o'],
      ['ớ', 'o'],
      ['ợ', 'o'],
      ['ờ', 'o'],
      ['ở', 'o'],
      ['ỡ', 'o'],
      ['ȏ', 'o'],
      ['ꝋ', 'o'],
      ['ꝍ', 'o'],
      ['ⱺ', 'o'],
      ['ō', 'o'],
      ['ṓ', 'o'],
      ['ṑ', 'o'],
      ['ǫ', 'o'],
      ['ǭ', 'o'],
      ['ø', 'o'],
      ['ǿ', 'o'],
      ['õ', 'o'],
      ['ṍ', 'o'],
      ['ṏ', 'o'],
      ['ȭ', 'o'],
      ['ƣ', 'oi'],
      ['ꝏ', 'oo'],
      ['ɛ', 'e'],
      ['ᶓ', 'e'],
      ['ɔ', 'o'],
      ['ᶗ', 'o'],
      ['ȣ', 'ou'],
      ['ṕ', 'p'],
      ['ṗ', 'p'],
      ['ꝓ', 'p'],
      ['ƥ', 'p'],
      ['ᵱ', 'p'],
      ['ᶈ', 'p'],
      ['ꝕ', 'p'],
      ['ᵽ', 'p'],
      ['ꝑ', 'p'],
      ['ꝙ', 'q'],
      ['ʠ', 'q'],
      ['ɋ', 'q'],
      ['ꝗ', 'q'],
      ['ŕ', 'r'],
      ['ř', 'r'],
      ['ŗ', 'r'],
      ['ṙ', 'r'],
      ['ṛ', 'r'],
      ['ṝ', 'r'],
      ['ȑ', 'r'],
      ['ɾ', 'r'],
      ['ᵳ', 'r'],
      ['ȓ', 'r'],
      ['ṟ', 'r'],
      ['ɼ', 'r'],
      ['ᵲ', 'r'],
      ['ᶉ', 'r'],
      ['ɍ', 'r'],
      ['ɽ', 'r'],
      ['ↄ', 'c'],
      ['ꜿ', 'c'],
      ['ɘ', 'e'],
      ['ɿ', 'r'],
      ['ś', 's'],
      ['ṥ', 's'],
      ['š', 's'],
      ['ṧ', 's'],
      ['ş', 's'],
      ['ŝ', 's'],
      ['ș', 's'],
      ['ṡ', 's'],
      ['ṣ', 's'],
      ['ṩ', 's'],
      ['ʂ', 's'],
      ['ᵴ', 's'],
      ['ᶊ', 's'],
      ['ȿ', 's'],
      ['ɡ', 'g'],
      ['ᴑ', 'o'],
      ['ᴓ', 'o'],
      ['ᴝ', 'u'],
      ['ť', 't'],
      ['ţ', 't'],
      ['ṱ', 't'],
      ['ț', 't'],
      ['ȶ', 't'],
      ['ẗ', 't'],
      ['ⱦ', 't'],
      ['ṫ', 't'],
      ['ṭ', 't'],
      ['ƭ', 't'],
      ['ṯ', 't'],
      ['ᵵ', 't'],
      ['ƫ', 't'],
      ['ʈ', 't'],
      ['ŧ', 't'],
      ['ᵺ', 'th'],
      ['ɐ', 'a'],
      ['ᴂ', 'ae'],
      ['ǝ', 'e'],
      ['ᵷ', 'g'],
      ['ɥ', 'h'],
      ['ʮ', 'h'],
      ['ʯ', 'h'],
      ['ᴉ', 'i'],
      ['ʞ', 'k'],
      ['ꞁ', 'l'],
      ['ɯ', 'm'],
      ['ɰ', 'm'],
      ['ᴔ', 'oe'],
      ['ɹ', 'r'],
      ['ɻ', 'r'],
      ['ɺ', 'r'],
      ['ⱹ', 'r'],
      ['ʇ', 't'],
      ['ʌ', 'v'],
      ['ʍ', 'w'],
      ['ʎ', 'y'],
      ['ꜩ', 'tz'],
      ['ú', 'u'],
      ['ŭ', 'u'],
      ['ǔ', 'u'],
      ['û', 'u'],
      ['ṷ', 'u'],
      ['ü', 'u'],
      ['ǘ', 'u'],
      ['ǚ', 'u'],
      ['ǜ', 'u'],
      ['ǖ', 'u'],
      ['ṳ', 'u'],
      ['ụ', 'u'],
      ['ű', 'u'],
      ['ȕ', 'u'],
      ['ù', 'u'],
      ['ủ', 'u'],
      ['ư', 'u'],
      ['ứ', 'u'],
      ['ự', 'u'],
      ['ừ', 'u'],
      ['ử', 'u'],
      ['ữ', 'u'],
      ['ȗ', 'u'],
      ['ū', 'u'],
      ['ṻ', 'u'],
      ['ų', 'u'],
      ['ᶙ', 'u'],
      ['ů', 'u'],
      ['ũ', 'u'],
      ['ṹ', 'u'],
      ['ṵ', 'u'],
      ['ᵫ', 'ue'],
      ['ꝸ', 'um'],
      ['ⱴ', 'v'],
      ['ꝟ', 'v'],
      ['ṿ', 'v'],
      ['ʋ', 'v'],
      ['ᶌ', 'v'],
      ['ⱱ', 'v'],
      ['ṽ', 'v'],
      ['ꝡ', 'vy'],
      ['ẃ', 'w'],
      ['ŵ', 'w'],
      ['ẅ', 'w'],
      ['ẇ', 'w'],
      ['ẉ', 'w'],
      ['ẁ', 'w'],
      ['ⱳ', 'w'],
      ['ẘ', 'w'],
      ['ẍ', 'x'],
      ['ẋ', 'x'],
      ['ᶍ', 'x'],
      ['ý', 'y'],
      ['ŷ', 'y'],
      ['ÿ', 'y'],
      ['ẏ', 'y'],
      ['ỵ', 'y'],
      ['ỳ', 'y'],
      ['ƴ', 'y'],
      ['ỷ', 'y'],
      ['ỿ', 'y'],
      ['ȳ', 'y'],
      ['ẙ', 'y'],
      ['ɏ', 'y'],
      ['ỹ', 'y'],
      ['ź', 'z'],
      ['ž', 'z'],
      ['ẑ', 'z'],
      ['ʑ', 'z'],
      ['ⱬ', 'z'],
      ['ż', 'z'],
      ['ẓ', 'z'],
      ['ȥ', 'z'],
      ['ẕ', 'z'],
      ['ᵶ', 'z'],
      ['ᶎ', 'z'],
      ['ʐ', 'z'],
      ['ƶ', 'z'],
      ['ɀ', 'z'],
      ['ﬀ', 'ff'],
      ['ﬃ', 'fi'],
      ['ﬄ', 'fl'],
      ['ﬁ', 'fi'],
      ['ﬂ', 'fl'],
      ['ĳ', 'ij'],
      ['œ', 'oe'],
      ['ﬆ', 'st'],
      ['ₐ', 'a'],
      ['ₑ', 'e'],
      ['ᵢ', 'i'],
      ['ⱼ', 'j'],
      ['ₒ', 'o'],
      ['ᵣ', 'r'],
      ['ᵤ', 'u'],
      ['ᵥ', 'v'],
      ['ₓ', 'x'],
    ]);
  }

  latinise(s: string | undefined): string | undefined {
    // eslint-disable-next-line no-useless-escape
    return s?.replace(/[^A-Za-z0-9\[\] ]/g, a => this.latinMap().get(a) ?? a);
  }
}
function levenshteinDistance(a: string, b: string): number {
  // Create a 2D array to store the distances
  let distances = new Array(a.length + 1);
  for (let i = 0; i <= a.length; i++) {
    distances[i] = new Array(b.length + 1);
  }

  // Initialize the first row and column
  for (let i = 0; i <= a.length; i++) {
    distances[i][0] = i;
  }
  for (let j = 0; j <= b.length; j++) {
    distances[0][j] = j;
  }

  // Fill in the rest of the array
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        distances[i][j] = distances[i - 1][j - 1];
      } else {
        distances[i][j] = Math.min(distances[i - 1][j], distances[i][j - 1], distances[i - 1][j - 1]) + 1;
      }
    }
  }

  // Return the final distance

  return distances[a.length][b.length];
}
