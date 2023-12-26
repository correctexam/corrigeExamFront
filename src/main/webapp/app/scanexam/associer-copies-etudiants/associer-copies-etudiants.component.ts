/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-console */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ExamService } from '../../entities/exam/service/exam.service';
import { ZoneService } from '../../entities/zone/service/zone.service';
import { CourseService } from 'app/entities/course/service/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { IExam } from 'app/entities/exam/exam.model';
import { IScan } from '../../entities/scan/scan.model';
import { IZone } from 'app/entities/zone/zone.model';
import { AlignImagesService } from '../services/align-images.service';
import { ITemplate } from 'app/entities/template/template.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IStudent, Student } from '../../entities/student/student.model';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';
import { IExamSheet } from '../../entities/exam-sheet/exam-sheet.model';
// import { v4 as uuid } from 'uuid';
import { faHouseSignal } from '@fortawesome/free-solid-svg-icons';
import { Listbox } from 'primeng/listbox';
import { PreferenceService } from '../preference-page/preference.service';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { DoPredictionsInputSamePage } from 'app/opencv.worker';
import { DialogService } from 'primeng/dynamicdialog';
import { AllbindingsComponent } from './allbindings/allbindings.component';

export interface IPage {
  image?: ImageData;
  page?: number;
  width?: number;
  height?: number;
}

export interface ICluster {
  images: IImageCluster[];
  nbrCluster: number;
}

export interface IImageCluster {
  image: ArrayBuffer;
  imageIndex: number;
  studentIndex: number;
  width?: number;
  height?: number;
}

export interface ImageZone {
  t?: ImageData;
  i: ImageData;
  w: number;
  h: number;
}

interface PredictResult {
  recognizedStudent?: IStudent;
  predictionprecision: number;
  nameImage?: ImageData;
  firstnameImage?: ImageData;
  ineImage?: ImageData;
  nameImageDebug?: ImageData;
  firstnameImageDebug?: ImageData;
  ineImageDebug?: ImageData;
  page: number;
}

@Component({
  selector: 'jhi-associer-copies-etudiants',
  templateUrl: './associer-copies-etudiants.component.html',
  styleUrls: ['./associer-copies-etudiants.component.scss'],
  providers: [ConfirmationService, MessageService, DialogService],
})
export class AssocierCopiesEtudiantsComponent implements OnInit, AfterViewInit {
  @ViewChild('list')
  list!: Listbox;
  faHouseSignal = faHouseSignal;
  blocked = false;
  examId = '';
  exam!: IExam;
  scan!: IScan;
  template!: ITemplate;
  pdfcontent!: string;
  zonenom!: IZone;
  setZoneNom: (z: IZone) => void = (z: IZone) => (this.zonenom = z);
  zoneprenom!: IZone;
  setZonePrenom: (z: IZone) => void = (z: IZone) => (this.zoneprenom = z);
  zoneine!: IZone;
  setZoneINE: (z: IZone) => void = (z: IZone) => (this.zoneine = z);
  nomDataURL: any;
  prenomDataURL: any;
  ineDataURL: any;
  widthnom = 0;
  heightnom = 0;
  widthprenom = 0;
  heightprenom = 0;
  widthine = 0;
  heightine = 0;
  cvState!: string;
  currentStudent = 0;
  nbreFeuilleParCopie = 0;
  numberPagesInScan = 0;
  selectionStudents: any[] = [];
  freeStudent: any[] = [];
  layoutsidebarVisible = false;
  selectionStudentsString: () => string = () => this.selectionStudents.map(s => s.name + ' ' + s.firstname).join(' - ');
  showRecognizedStudent: () => string = () =>
    this.recognizedStudent?.name +
    ' ' +
    this.recognizedStudent?.firstname +
    ' (' +
    this.recognizedStudent?.ine +
    ') [score=' +
    Math.floor(this.predictionprecision) +
    ']';

  students: IStudent[] = [];
  assisted = true;
  baseTemplate = true;
  studentsOptions: () => SelectItem[] = () => this.getStudentOptions();

  getStudentOptions(): SelectItem[] {
    if (this.list?._options !== undefined && this.list._options!.length > 0) {
      this.filterLocalStudentList();
    }
    return this.students.map(student => ({
      value: student,
      label: student.name + ' - ' + student.firstname + ' - (' + student.ine + ')',
    }));
  }
  filterbindstudent = true;
  columnstyle = {
    width: '100%',
  };

  nameImageImg?: string;
  firstnameImageImg?: string;
  ineImageImg?: string;
  nameImageImgDebug?: string;
  firstnameImageImgDebug?: string;
  ineImageImgDebug?: string;

  debug = false;
  noalign = false;
  factor = 1;

  debugOptions = [
    { label: 'Off', value: false },
    { label: 'On', value: true },
  ];
  recognizedStudent: IStudent | undefined;
  predictionprecision = 0;

  activeIndex = 1;

  responsiveOptions2: any[] = [
    {
      breakpoint: '1500px',
      numVisible: 5,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
  displayBasic = false;
  images: any[] = [];

  shortcuts: ShortcutInput[] = [];

  constructor(
    public examService: ExamService,
    public examsheetService: ExamSheetService,
    public zoneService: ZoneService,
    public courseService: CourseService,
    public studentService: StudentService,
    protected activatedRoute: ActivatedRoute,
    public confirmationService: ConfirmationService,
    public router: Router,
    private alignImagesService: AlignImagesService,
    public messageService: MessageService,
    public sheetService: ExamSheetService,
    private preferenceService: PreferenceService,
    private db: CacheServiceImpl,
    private translateService: TranslateService,
    public dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.filterbindstudent = this.preferenceService.getFilterStudentPreference();
    this.activatedRoute.paramMap.subscribe(params => {
      this.recognizedStudent = undefined;
      this.blocked = true;
      if (params.get('examid') !== null) {
        if (this.examId !== params.get('examid')!) {
          console.time('loadpage');
          this.examId = params.get('examid')!;
          this.images = [];

          if (params.get('currentStudent') !== null) {
            this.currentStudent = +params.get('currentStudent')! - 1;

            // const startTime = performance.now();
            // Step 1 Query templates
            console.timeLog('loadpage', 'before countTemplate');
            const promises: Promise<any>[] = [];
            promises.push(this.db.countPageTemplate(+this.examId));
            promises.push(this.db.countAlignImage(+this.examId));
            promises.push(firstValueFrom(this.examService.find(+this.examId)));

            Promise.all(promises).then(value => {
              this.nbreFeuilleParCopie = value[0];
              this.numberPagesInScan = value[1];
              this.exam = value[2].body!;
              console.error(this.exam);
              console.timeLog('loadpage', 'after countTemplate');
              this.activeIndex = this.currentStudent! * this.nbreFeuilleParCopie!;
              this.factor = 1;
              this.noalign = false;
              console.timeLog('loadpage', 'after countAlign');
              console.timeLog('loadpage', 'after load exam');

              this.refreshStudentList().then(() => {
                console.timeLog('loadpage', 'after loadstudentList');
                this.loadImage().then(() => {
                  this.blocked = false;
                  console.timeEnd('loadpage');
                });
              });
            });
          } else {
            const c = this.currentStudent + 1;
            this.router.navigateByUrl('/studentbindings/' + this.examId! + '/' + c);
          }
        } else {
          console.time('loadpagesameexam');
          this.currentStudent = +params.get('currentStudent')! - 1;
          this.activeIndex = this.currentStudent! * this.nbreFeuilleParCopie!;
          this.getFilterStudent();
          this.loadImage().then(() => {
            this.blocked = false;
            console.timeEnd('loadpagesameexam');
          });
        }
      }
    });
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

  imagedata_to_image(imagedata: ImageData): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx?.putImageData(imagedata, 0, 0);
    return canvas.toDataURL();
  }

  async loadImage(): Promise<void> {
    console.timeLog('loadpagesameexam', 'before testLoadImage4pages');
    const res = await this.testLoadImage4pages([this.currentStudent! * this.nbreFeuilleParCopie!]);
    console.timeLog('loadpage', 'after testLoadImage4pages');
    console.timeLog('loadpagesameexam', 'after testLoadImage4pages');

    if (res.length === 1) {
      this.predictionprecision = res[0].predictionprecision;
      this.recognizedStudent = res[0].recognizedStudent;
      if (res[0].nameImage) {
        this.nameImageImg = this.imagedata_to_image(res[0].nameImage);
      }
      //      console.error(res[0]);
      if (this.debug && res[0].nameImageDebug) {
        this.nameImageImgDebug = this.imagedata_to_image(res[0].nameImageDebug);
      }
      if (res[0].firstnameImage) {
        this.firstnameImageImg = this.imagedata_to_image(res[0].firstnameImage);
      }
      if (this.debug && res[0].firstnameImageDebug) {
        this.firstnameImageImgDebug = this.imagedata_to_image(res[0].firstnameImageDebug);
      }
      if (res[0].ineImage) {
        this.ineImageImg = this.imagedata_to_image(res[0].ineImage);
      }
      if (this.debug && res[0].ineImageDebug) {
        this.ineImageImgDebug = this.imagedata_to_image(res[0].ineImageDebug);
      }
      const imgs = [res[0].nameImage, res[0].firstnameImage, res[0].ineImage];
      const length = imgs.filter(e => e !== undefined).length;
      if (length > 1) {
        this.columnstyle = { width: Math.floor(100 / length) + '%' };
      } else {
        this.columnstyle = { width: '100%' };
      }
    }
  }

  async testLoadImage4pages(pagesToAnalyze: number[]): Promise<PredictResult[]> {
    let z1, z2, z3;

    console.timeLog('loadpage', 'before loadZone');
    console.timeLog('loadpagesameexam', 'before loadZone');
    const zones = (await firstValueFrom(this.zoneService.find4ExamId(this.exam.id!)))?.body;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (zones) {
      if (zones[0].id) {
        z1 = zones[0];
      }
      if (zones[1].id) {
        z2 = zones[1];
      }
      if (zones[2].id) {
        z3 = zones[2];
      }
    }
    console.timeLog('loadpage', 'after loadZone');
    console.timeLog('loadpagesameexam', 'after loadZone');

    let candidates = [];
    if (!this.filterbindstudent) {
      candidates = this.students.map(
        student => new Student(student.id, this.latinise(student.name), this.latinise(student.firstname), this.latinise(student.ine)),
      );
    } else {
      candidates = this.freeStudent.map(
        student => new Student(student.id, this.latinise(student.name), this.latinise(student.firstname), this.latinise(student.ine)),
      );
    }

    let pageNumber = z1?.pageNumber;
    if (pageNumber === undefined) {
      pageNumber = z2?.pageNumber;
    }
    if (pageNumber === undefined) {
      pageNumber = z3?.pageNumber;
    }
    if (pageNumber !== undefined && pageNumber !== null && (z1 !== undefined || z2 !== undefined || z3 !== undefined)) {
      const r: DoPredictionsInputSamePage = {
        align: !this.noalign,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        candidates: candidates as IStudent[],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        examId: +this.examId,
        indexDb: this.preferenceService.getPreference().cacheDb === 'indexdb',
        factor: this.factor,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        pagesToAnalyze: pagesToAnalyze.map(p => p + pageNumber!),
        pageTemplate: pageNumber!,
        nameZone: z1!,
        firstnameZone: z2!,
        ineZone: z3!,
        removeHorizontal: this.preferenceService.getPreference().removeHorizontalName,
        looking4missing: true,
        preferences: this.preferenceService.getPreference(),
        assist: this.assisted,
        debug: this.debug,
      };
      const output: PredictResult[] = [];
      console.timeLog('loadpage', 'before doPredictions');
      console.timeLog('loadpagesameexam', 'before doPredictions');
      const r5 = await firstValueFrom(this.alignImagesService.doPredictions(r));
      console.timeLog('loadpage', 'after doPredictions');
      console.timeLog('loadpagesameexam', 'after doPredictions');

      for (const r1 of r5) {
        let result: PredictResult = { predictionprecision: 0, page: r1.page };
        if (r1.nameZone) {
          result.nameImage = new ImageData(new Uint8ClampedArray(r1.nameZone), r1.nameZoneW!, r1.nameZoneH!);
          if (this.debug && r1.nameZoneDebug) {
            result.nameImageDebug = new ImageData(new Uint8ClampedArray(r1.nameZoneDebug), r1.nameZoneW!, r1.nameZoneH!);
          }
        }

        if (r1.firstnameZone) {
          result.firstnameImage = new ImageData(new Uint8ClampedArray(r1.firstnameZone), r1.firstnameZoneW!, r1.firstnameZoneH!);
          if (this.debug && r1.firstnameZoneDebug) {
            result.firstnameImageDebug = new ImageData(
              new Uint8ClampedArray(r1.firstnameZoneDebug),
              r1.firstnameZoneW!,
              r1.firstnameZoneH!,
            );
          }
        }
        if (r1.ineZone) {
          result.ineImage = new ImageData(new Uint8ClampedArray(r1.ineZone), r1.ineZoneW!, r1.ineZoneH!);
          if (this.debug && r1.ineZoneDebug) {
            result.ineImageDebug = new ImageData(new Uint8ClampedArray(r1.ineZoneDebug), r1.ineZoneW!, r1.ineZoneH!);
          }
        }

        if (r1.resultPrediction.length > 0) {
          result.predictionprecision = r1.resultPrediction[0].proba! * r1.resultPrediction[0].score!;
          result.recognizedStudent = this.students.find(st => st.id === r1.resultPrediction[0].id);
        }
        output.push(result);
      }

      return output;
    } else {
      return [];
    }
  }

  reloadImageGrowFactor(event: any): void {
    if (event.value !== this.factor) {
      this.factor = event.value;
      this.loadImage();
    }
  }

  @HostListener('window:keydown.control.Enter', ['$event'])
  async selectRecogniezStudent(): Promise<void> {
    this.selectionStudents = [this.recognizedStudent];
    await this.bindStudent();
    if ((this.currentStudent + 1) * this.nbreFeuilleParCopie < this.numberPagesInScan) {
      this.currentStudent = this.currentStudent + 1;
      this.goToStudent(this.currentStudent);
    } else {
      this.blocked = false;
    }
  }

  selectedColor(item: any): string {
    const list = this.list._options!.filter(
      s =>
        s.value.examSheets === null ||
        s.value.examSheets!.length === 0 ||
        !s.value.examSheets?.some((ex: any) => ex?.scanId === this.exam.scanfileId) ||
        s.value.examSheets?.some((ex: any) => ex?.scanId === this.exam.scanfileId && ex?.pagemin === -1 && ex?.pagemax === -1),
    );
    const list1 = this.list._options!.filter(
      s =>
        s.value.examSheets?.some(
          (ex: any) => ex?.scanId === this.exam.scanfileId && ex?.pagemin === this.currentStudent * this.nbreFeuilleParCopie,
        ),
    );

    if (list.filter(e => e.label === item.label).length >= 1) {
      return 'text-green-400';
    } else if (list1.filter(e => e.label === item.label).length >= 1) {
      return '';
    } else {
      return 'text-red-400';
    }
  }

  goToStudent(i: number): void {
    this.list._filterValue = '';
    this.list._filteredOptions = this.list._options;

    if (i * this.nbreFeuilleParCopie < this.numberPagesInScan) {
      this.router.navigateByUrl('studentbindings/' + this.examId + '/' + (i + 1));
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
    this.refreshLocalStudentList();
    //    this.blocked = false;
  }

  filterLocalStudentList(): void {
    if (this.filterbindstudent) {
      this.list._filteredOptions = this.list._options!.filter(
        s =>
          s.value.examSheets === null ||
          s.value.examSheets!.length === 0 ||
          !s.value.examSheets?.some((ex: any) => ex?.scanId === this.exam.scanfileId) ||
          s.value.examSheets?.some((ex: any) => ex?.scanId === this.exam.scanfileId && ex?.pagemin === -1 && ex?.pagemax === -1) ||
          s.value.examSheets?.some(
            (ex: any) => ex?.scanId === this.exam.scanfileId && ex?.pagemin === this.currentStudent * this.nbreFeuilleParCopie,
          ),
      );
    } else {
      // this.list._filterValue = '';
      this.list._filteredOptions = this.list._options;
    }
  }

  refreshLocalStudentList(): void {
    this.list._filterValue = '';

    this.preferenceService.saveFilterStudentPreference(this.filterbindstudent);
    this.filterLocalStudentList();

    // Step 5 Bind All copies
    this.getFilterStudent();
  }

  getFilterStudent(): void {
    const filterStudent = this.students.filter(
      s => s.examSheets?.some(ex => ex?.scanId === this.exam.scanfileId && ex?.pagemin === this.currentStudent * this.nbreFeuilleParCopie),
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

    await this.bindStudent();
    if ((this.currentStudent + 1) * this.nbreFeuilleParCopie < this.numberPagesInScan) {
      this.currentStudent = this.currentStudent + 1;
      this.blocked = false;

      this.goToStudent(this.currentStudent);
    } else {
      this.blocked = false;
    }
  }
  async bindStudentOnClick(): Promise<void> {
    this.blocked = true;
    await this.bindStudent();
    this.blocked = false;
  }

  async bindStudent(): Promise<void> {
    const examSheet4CurrentStudent1: IExamSheet[] = [...new Set(this.students.flatMap(s => s.examSheets!))].filter(
      sh =>
        sh.pagemin === this.currentStudent * this.nbreFeuilleParCopie &&
        sh.pagemax === (this.currentStudent + 1) * this.nbreFeuilleParCopie - 1 &&
        sh.scanId === this.exam.scanfileId,
    );
    // ExamSheetExist
    if (examSheet4CurrentStudent1.length === 1) {
      const sheet = examSheet4CurrentStudent1[0];
      sheet.students = this.selectionStudents;
      await firstValueFrom(
        this.examsheetService.updateStudents(
          sheet.id!,
          this.selectionStudents.map(e => e.id as number),
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
            this.selectionStudents.map(e => e.id as number),
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
      this.blocked = false;
    }
  }
  /*

    // old version
    const examSheet4CurrentStudent: IExamSheet[] = (
      this.students.filter(s => this.selectionStudents.map((s1: IStudent) => s1.id)!.includes(s.id)).map(s => s.examSheets) as any
    )
      .flat()
      .filter((ex: any) => ex?.scanId === this.exam.scanfileId);
    // Récupère la sheet courante.
    const examSheet4CurrentPage: IExamSheet[] = (
      this.students
        .filter(
          s =>
            s.examSheets?.some(ex => ex?.scanId === this.exam.scanfileId && ex.pagemin === this.currentStudent * this.nbreFeuilleParCopie),
        )
        .map(s => s.examSheets) as any
    ).flat();

    // Passe cette sheet à -1 -1. sémantique plus associé

    for (const ex2 of examSheet4CurrentPage.filter(ex => !examSheet4CurrentStudent.map(ex1 => ex1.id).includes(ex!.id))) {
      ex2!.pagemin = -1;
      ex2!.pagemax = -1;
      await firstValueFrom(this.sheetService.update(ex2));
    }

    // Pour l'étudiant sélectionné. récupère la sheet. Si elle existe, on met à jour les bonnes pages sinon on crée la page.

    const selectedStudent = this.students.filter(s => this.selectionStudents.map((s1: IStudent) => s1.id)!.includes(s.id));
    for (const student of selectedStudent) {
      const examS4Student = student.examSheets?.filter((ex: IExamSheet) => ex?.scanId === this.exam.scanfileId);
      if (examS4Student !== undefined && examS4Student.length > 0) {
        for (const ex of examS4Student) {
          ex.pagemin = this.currentStudent * this.nbreFeuilleParCopie;
          ex.pagemax = (this.currentStudent + 1) * this.nbreFeuilleParCopie - 1;
          await firstValueFrom(this.sheetService.update(ex));
        }
      } else {
        const sheet: IExamSheet = {
          name: uuid(),
          pagemin: this.currentStudent * this.nbreFeuilleParCopie,
          pagemax: (this.currentStudent + 1) * this.nbreFeuilleParCopie - 1,
          scanId: this.exam.scanfileId,
          students: this.selectionStudents,
        };
        const e = await firstValueFrom(this.sheetService.create(sheet));
        for (const s1 of this.selectionStudents) {
          s1.examSheets?.push(e.body!);
          await firstValueFrom(this.studentService.update(s1));
        }
      }
    }*/

  showGalleria(): void {
    this.blocked = true;
    this.loadAllPages().then(() => {
      this.blocked = false;
      this.displayBasic = true;
    });
  }
  @HostListener('document:keydown.escape', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onKeydownHandler(event: KeyboardEvent): void {
    this.displayBasic = false;
  }

  loadAllPages(): Promise<void> {
    this.images = [];
    return new Promise<void>(resolve => {
      this.db.countNonAlignImage(+this.examId!).then(page => {
        if (page > 30) {
          this.activeIndex = 0;
          this.db.countPageTemplate(+this.examId!).then(page1 => {
            if (this.noalign) {
              this.db
                .getNonAlignImageBetweenAndSortByPageNumber(
                  +this.examId!,
                  this.currentStudent * page1 + 1,
                  (this.currentStudent + 1) * page1,
                )
                .then(e1 => {
                  e1.forEach(e => {
                    const image = JSON.parse(e!.value, this.reviver);
                    this.images.push({
                      src: image.pages,
                      alt: 'Description for Image 2',
                      title: 'Exam',
                    });
                  });

                  resolve();
                });
            } else {
              this.db
                .getAlignImageBetweenAndSortByPageNumber(+this.examId!, this.currentStudent * page1 + 1, (this.currentStudent + 1) * page1)
                .then(e1 => {
                  e1.forEach(e => {
                    const image = JSON.parse(e!.value, this.reviver);
                    this.images.push({
                      src: image.pages,
                      alt: 'Description for Image 2',
                      title: 'Exam',
                    });
                  });
                  resolve();
                });
            }
          });
        } else {
          if (this.noalign) {
            this.db.getNonAlignSortByPageNumber(+this.examId!).then(e1 => {
              e1.forEach(e => {
                const image = JSON.parse(e!.value, this.reviver);

                this.images.push({
                  src: image.pages,
                  alt: 'Description for Image 2',
                  title: 'Exam',
                });
              });
              resolve();
            });
          } else {
            this.db.getAlignSortByPageNumber(+this.examId!).then(e1 => {
              e1.forEach(e => {
                const image = JSON.parse(e!.value, this.reviver);
                this.images.push({
                  src: image.pages,
                  alt: 'Description for Image 2',
                  title: 'Exam',
                });
              });
              resolve();
            });
          }
        }
      });
    });
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
      this.refreshStudentList();
      this.blocked = false;
    });
  }

  async openAllBinding(): Promise<void> {
    const freeSheets = this.computeFreeSheets();
    if (freeSheets.length > 0) {
      this.blocked = true;
      const res1 = await this.testLoadImage4pages(freeSheets.map(e => e * this.nbreFeuilleParCopie!));
      this.blocked = false;

      const ref = this.dialogService.open(AllbindingsComponent, {
        header: '',
        width: '100%',
        data: {
          students: res1,
          nbreFeuilleParCopie: this.nbreFeuilleParCopie,
          exam: this.exam,
        },
      });

      ref.onClose.subscribe(() => {
        this.refreshStudentList().then(() => {
          this.loadImage().then(() => {
            this.blocked = false;
          });
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
