/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable guard-for-in */
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { Observable, firstValueFrom } from 'rxjs';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { Title } from '@angular/platform-browser';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ButtonDirective } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { KnobModule } from 'primeng/knob';
import { TooltipModule } from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf, NgFor, NgStyle, KeyValuePipe } from '@angular/common';
import { TranslateDirective } from '../../shared/language/translate.directive';
import { PrimeTemplate } from 'primeng/api';
import { GalleriaModule } from 'primeng/galleria';

// Couleurs à utiliser
const GRIS = 'rgba(179,181,198,1)';
const VERT = 'rgba(120,255,132,1)';
const ROUGE = 'rgb(255, 120, 120)';
const BLEU_FONCE = 'rgb(72, 61, 139)';
const BLANC = 'rgba(255,255,255,1)';
const VIOLET = 'rgb(233, 120, 255)';
const VIOLET_TIEDE = 'rgb(233, 120, 255,0.6)';
const VIOLET_LEGER = 'rgb(233, 120, 255,0.2)';
const BLEU_AERO = 'rgb(142, 184, 229)';
const BLEU_AERO_TIEDE = 'rgb(142, 184, 229,0.6)';
const TRANSPARENT = 'rgba(255,255,255,0.0)';

@Component({
  selector: 'jhi-statsexam',
  templateUrl: './statsexam.component.html',
  styleUrls: ['./statsexam.component.scss'],
  standalone: true,
  imports: [
    GalleriaModule,
    PrimeTemplate,
    TranslateDirective,
    NgIf,
    FaIconComponent,
    CardModule,
    ChartModule,
    NgFor,
    TooltipModule,
    KnobModule,
    FormsModule,
    ButtonDirective,
    TableModule,
    DropdownModule,
    SelectButtonModule,
    ToggleButtonModule,
    NgStyle,
    RouterLink,
    KeyValuePipe,
    TranslateModule,
  ],
})
export class StatsExamComponent implements OnInit {
  // Page related variables
  protected examid = '-1';
  protected examName: string | undefined = '';
  protected courseName: string | undefined = '';

  protected infosQuestions: IQuestion[] = [];
  questionNumeros: Array<number> = [];
  protected infosStudents: StudentRes[] = [];
  protected q_notees: QuestionNotee[] = [];
  protected studentsMarks: number[] = [];
  protected choixTri = true;
  protected nbStdABI = 0;

  // Graphical data
  protected data_radar_courant: IRadar = {
    labels: [],
    datasets: [],
    vue: '',
  };
  protected etudiantSelec: StudentRes | null | undefined;
  protected listeMobileEtudiant: StudSelecMobile[] = [];
  protected mobileSortChoices: ISortMobile[] = [
    { icon: 'pi pi-id-card', sort: 'ine' },
    { icon: 'pi pi-sort-alpha-up', sort: 'nom' },
    { icon: 'pi pi-sort-numeric-up', sort: 'note' },
  ];
  protected mobileSortChoice: ISortMobile = this.mobileSortChoices[2];
  protected knobsCourants: Map<number, string> = new Map();
  protected COLOR_KNOBS = BLEU_AERO_TIEDE;
  protected idQuestionSelected = 0;
  protected questionSelectionnee = false;
  protected texte_correction = 'Correction';
  protected readonly ICONSORTUP = 'pi pi-sort-amount-up-alt'; // Permet d'éviter une étrange erreur de vscode (Unexpected keyword or identifier.javascript)
  protected activeIndex = 1;
  protected responsiveOptions2: any[] = [
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
  protected displayBasic = false;
  protected images: any[] = [];
  private noalign = false;
  private nbreFeuilleParCopie: number | undefined;
  protected libelles: any;
  constructor(
    private applicationConfigService: ApplicationConfigService,
    private http: HttpClient,
    private questionService: QuestionService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router,
    private examService: ExamService,
    private titleService: Title,

    private db: CacheServiceImpl,
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.examid = params.get('examid') ?? '-1';

      if (this.examid === '-1') {
        return;
      }
      this.examService.find(+this.examid).subscribe(ex => {
        this.examName = ex.body?.name;
        this.courseName = ex.body?.courseName;
        this.updateTitle();
      });

      this.translateService.get('scanexam.noteattribuee').subscribe(() => {
        this.initStudents().then(() => {
          this.performInfoQuestionsQuery();
        });

        this.translateService.onLangChange.subscribe(() => {
          this.updateTitle();
          this.performInfoQuestionsQuery();
        });
      });
    });
  }

  updateTitle(): void {
    this.activatedRoute.data.subscribe(e => {
      this.translateService.get(e['pageTitle'], { examName: this.examName, courseName: this.courseName }).subscribe(e1 => {
        this.titleService.setTitle(e1);
      });
    });
  }

  private performInfoQuestionsQuery(): void {
    this.requeteInfoQuestions().subscribe(b => {
      // Getting and sorting the questions
      this.infosQuestions = (b.body ?? []).sort((i1, i2) => (i1.numero ?? 0) - (i2.numero ?? 0));
      this.questionNumeros = Array.from(new Set(this.infosQuestions.map(q => q.numero!))).sort((n1, n2) => n1 - n2);

      this.initStatVariables();
      this.initDisplayVariables();
      this.style();
    });
  }

  public async loadAllPages(): Promise<void> {
    this.images = [];
    this.nbreFeuilleParCopie = await this.db.countPageTemplate(+this.examid);
    return new Promise<void>(resolve => {
      if (this.noalign) {
        this.db.getNonAlignSortByPageNumber(+this.examid).then(e1 => {
          e1.forEach(e => {
            const image = JSON.parse(e.value, this.reviver);

            this.images.push({
              src: image.pages,
              alt: 'Description for Image 2',
              title: 'Exam',
            });
          });
          resolve();
        });
      } else {
        this.db.getAlignSortByPageNumber(+this.examid).then(e1 => {
          e1.forEach(e => {
            const image = JSON.parse(e.value, this.reviver);
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
  }

  private reviver(_key: any, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  public changementTriMobile(): void {
    // Clic automatique qui permet de modifier l'affichage de la sélection dans le tableau (si l'utilisateur rebascule de vue)
    this.clickColonneTableau(this.mobileSortChoice.sort);
    const evenement: ISort = {
      data: this.infosStudents,
      mode: 'single',
      field: this.mobileSortChoice.sort,
      order: this.choixTri ? 1 : -1,
    };
    this.triSelection(evenement);
    this.initMobileSelection();
  }

  private async initStudents(): Promise<void> {
    this.infosStudents = await this.loadStudents();
    this.libelles = await firstValueFrom(
      this.http.get(this.applicationConfigService.getEndpointFor('api/getLibelleQuestions/' + this.examid)),
    );
  }

  private requeteInfoQuestions(): Observable<HttpResponse<IQuestion[]>> {
    return this.questionService.query({ examId: this.examid });
  }

  private async loadStudents(): Promise<StudentRes[]> {
    return new Promise<StudentRes[]>(res => {
      this.http.get<StudentRes[]>(this.applicationConfigService.getEndpointFor(`api/showResult/${this.examid}`)).subscribe(s => {
        res(s);
      });
    });
  }

  private initStatVariables(): void {
    this.studentsMarks = [];
    this.nbStdABI = 0;
    this.sortMarks(this.infosStudents);
    const qn: QuestionNotee[] = [];
    for (const q of this.infosQuestions) {
      const numero = q.numero ?? 0;
      const bareme = q.point ?? 0;
      const labelBegin: string = this.translateService.instant('scanexam.questionLow');
      let label = `${labelBegin} ${numero}`;
      if (this.libelles[numero] !== undefined && this.libelles[numero] !== '') {
        label = label + '(' + this.libelles[numero] + ')';
      }
      const notesAssociees: number[] = [];
      const quest_divisee = qn.find(quest => quest.label === label);
      if (quest_divisee === undefined) {
        // On ne prend pas en compte la notation de la deuxième partie s'il y en a une
        // (même comportement que lorsque l'on note la question dans la partie  correction)
        qn.push({ bareme, numero, label, notesAssociees });
      }
    }
    this.infosStudents
      .filter(s => s.ine !== '')
      .forEach(s => {
        if (s.abi > 0) {
          this.nbStdABI++;
        } else {
          for (const key in s.notequestions) {
            // semi-column char instead of decimal dot, so:
            const note = this.s2f(s.notequestions[key]);
            qn[parseFloat(key) - 1]?.notesAssociees?.push(note);
          }
          const note = s.note === undefined ? 0 : this.s2f(s.note);
          this.studentsMarks.push(note);
        }
      });
    this.q_notees = qn.sort((a, b) => a.numero - b.numero);
  }

  public s2f(str: string): number {
    return parseFloat(str.replace(',', '.'));
  }

  public triSelection(event: ISort): void {
    switch (event.field) {
      case 'ine':
        this.sortStdID(this.infosStudents);
        this.mobileSortChoice = this.mobileSortChoices[0];
        break;
      case 'nom':
        this.sortLastName(this.infosStudents);
        this.mobileSortChoice = this.mobileSortChoices[1];
        break;
      case 'prenom':
        this.sortFirstName(this.infosStudents);
        this.mobileSortChoice = this.mobileSortChoices[1];
        break;
      default:
        this.sortMarks(this.infosStudents);
        this.mobileSortChoice = this.mobileSortChoices[2];
        break;
    }

    if (event.order === -1) {
      event.data.reverse();
    }

    this.choixTri = event.order === 1;
    this.initMobileSelection();
  }

  private sortMarks(etudiants: StudentRes[]): StudentRes[] {
    if (this.questionSelectionnee) {
      etudiants.sort((s1: StudentRes, s2: StudentRes) => {
        const note1 = s1.notequestions[String(this.idQuestionSelected + 1)] as string | undefined;
        const note2 = s2.notequestions[String(this.idQuestionSelected + 1)] as string | undefined;

        if (note1 === undefined && note2 === undefined) {
          return 0;
        }
        if (note1 === undefined) {
          return -1;
        }
        if (note2 === undefined) {
          return 1;
        }
        if (this.s2f(note1) < this.s2f(note2)) {
          return -1;
        }
        if (this.s2f(note1) === this.s2f(note2)) {
          return this.compareLastName(s1, s2);
        }
        return 1;
      });
      return etudiants.reverse();
    } else {
      etudiants.sort((s1: StudentRes, s2: StudentRes) => {
        const note1 = s1.note;
        const note2 = s2.note;
        if (note1 === undefined && note2 === undefined) {
          return 0;
        }
        if (note1 === undefined) {
          return -1;
        }
        if (note2 === undefined) {
          return 1;
        }
        if (this.s2f(note1) < this.s2f(note2)) {
          return -1;
        }
        if (this.s2f(note1) === this.s2f(note2)) {
          return this.compareLastName(s1, s2);
        }
        return 1;
      });
      return etudiants.reverse();
    }
  }

  private sortStdID(etudiants: StudentRes[]): StudentRes[] {
    etudiants.sort((s1: StudentRes, s2: StudentRes) => {
      const ine1 = s1.ine;
      const ine2 = s2.ine;

      try {
        // Trying to sort as numbers
        const num1 = parseInt(ine1, 10);
        const num2 = parseInt(ine2, 10);
        return num2 - num1;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err: unknown) {
        // If not number, falling back to string comparison
        return ine1.localeCompare(ine2);
      }
    });
    return etudiants;
  }

  private sortLastName(etudiants: StudentRes[]): StudentRes[] {
    etudiants.sort((s1: StudentRes, s2: StudentRes) => {
      const diff = this.compareLastName(s1, s2);
      return diff;
    });
    return etudiants;
  }

  private sortFirstName(etudiants: StudentRes[]): StudentRes[] {
    etudiants.sort((s1: StudentRes, s2: StudentRes) => {
      let diff = s1.prenom.localeCompare(s2.prenom);
      if (diff === 0) {
        diff = s1.nom.localeCompare(s2.nom);
      }
      return diff;
    });
    return etudiants;
  }

  private compareLastName(s1: StudentRes, s2: StudentRes): number {
    let diff = s1.nom.localeCompare(s2.nom);
    if (diff === 0) {
      diff = s1.prenom.localeCompare(s2.prenom);
    }
    return diff;
  }

  /** @return The notation for each question */
  public getBaremes(stats: ReadonlyArray<QuestionNotee>): number[] {
    return stats.map(s => s.bareme);
  }

  public getBaremeExam(): number {
    return this.sum(this.getBaremes(this.q_notees));
  }

  private getNotes(etudiant: StudentRes): Map<number, number> {
    const notes: Map<number, number> = new Map();
    for (const key in etudiant.notequestions) {
      notes.set(+key - 1, this.s2f(etudiant.notequestions[key]));
    }
    return notes;
  }
  // Permet de pouvoir accéder facilement aux notes de l'étudiant sélectionné et de ne pas devoir gérer les erreurs en cas d'étudiant non sélectionné
  public getNotesSelect(): Map<number, number> {
    if (this.etudiantSelec !== null && this.etudiantSelec !== undefined) {
      return this.getNotes(this.etudiantSelec);
    }
    return new Map();
  }

  public getNoteSelect(): number {
    return this.sum(Array.from(this.getNotesSelect().values()));
  }

  /** @return Average mark for all the questions (ordered) */
  private getMoyennesQuestions(): number[] {
    return this.q_notees.map(ns => this.mean(ns.notesAssociees));
  }

  private updateKnobs(): void {
    const knobsNb = this.etudiantSelec !== null && this.etudiantSelec !== undefined ? this.getNotesSelect() : this.getMoyennesQuestions();
    this.knobsCourants = new Map<number, string>();
    knobsNb.forEach((e, k) => {
      this.knobsCourants.set(k, e.toFixed(2));
    });
  }

  public getMeanExam(): number {
    return this.sum(this.studentsMarks) / this.studentsMarks.length;
  }

  public getMedianExam(): number {
    return this.median(this.studentsMarks);
  }

  public getStdDeviationExam(): number {
    return this.stdDeviation(this.studentsMarks);
  }

  public getMaxMarkExam(): number {
    return this.max(this.studentsMarks);
  }

  public getMinMarkExam(): number {
    return this.min(this.studentsMarks);
  }

  private max(marks: ReadonlyArray<number>): number {
    return Math.max(...marks);
  }

  private min(marks: ReadonlyArray<number>): number {
    return Math.min(...marks);
  }

  public sum(marks: ReadonlyArray<number>): number {
    return marks.reduce((x, y) => x + y, 0);
  }

  private mean(marks: ReadonlyArray<number>): number {
    return marks.length > 0 ? this.sum(marks) / marks.length : 0;
  }

  private median(marks: ReadonlyArray<number>): number {
    const sortedTab = [...marks].sort((a, b) => b - a);
    return sortedTab[Math.floor(sortedTab.length / 2)];
  }

  private stdDeviation(marks: ReadonlyArray<number>): number {
    const mean: number = this.mean(marks);
    // (marks.length - 1); for the corrected SD.
    const variance = marks.map(xi => Math.pow(xi - mean, 2)).reduce((a, b) => a + b, 0) / (marks.length - 1);
    return Math.sqrt(variance);
  }

  private normaliseNotes(notes: Array<number>, baremes: ReadonlyArray<number>, norme = 100): number[] {
    notes.forEach((note, indice) => {
      note /= baremes[indice];
      notes[indice] = note * norme;
    });
    return notes;
  }

  private initDisplayVariables(): void {
    this.data_radar_courant = this.initGlobalRadarData(this.q_notees, true);
    this.updateKnobs();
    this.updateCarteRadar();
    this.changementTriMobile();
  }

  private initMobileSelection(): void {
    if (this.listeMobileEtudiant.length > 0) {
      while (this.listeMobileEtudiant.length !== 0) {
        this.listeMobileEtudiant.pop();
      }
    }
    for (const etudiant of this.infosStudents) {
      const note = this.s2f(etudiant.note === undefined ? '0' : etudiant.note)
        .toFixed(2)
        .toString();
      const name = etudiant.ine + ' | ' + this.s_red(etudiant.prenom, 1) + ' ' + this.s_red(etudiant.nom, 8) + ' | ' + note;
      const value = etudiant;
      const etmob: StudSelecMobile = { name, value };
      this.listeMobileEtudiant.push(etmob);
    }
  }

  private s_red(s: string, length = 3, abrevSymbol = '.'): string {
    if (length >= s.length) {
      return s;
    }
    return s.slice(0, length) + abrevSymbol;
  }

  /** Initialises radar data to display **/
  private initGlobalRadarData(stats: ReadonlyArray<QuestionNotee>, pourcents = false): IRadar {
    const labels = stats.map(e => e.label);
    const datasets = [this.radarMoy(), this.radarMed(), this.radarMaxNote(), this.radarMinNote()];

    if (pourcents) {
      datasets.forEach((ds, indice) => {
        datasets[indice].data = this.normaliseNotes(ds.data, this.getBaremes(stats));
      });
    }
    const vue = pourcents ? this.translateService.instant('scanexam.pourcents') : this.translateService.instant('scanexam.brut');
    return { labels, datasets, vue };
  }

  private initStudentRadarData(etudiant: StudentRes, pourcents = false): IRadar {
    const labels = this.data_radar_courant.labels;
    const datasets = [this.radarStudent(etudiant), this.radarMoy(), this.radarMed()];
    if (pourcents) {
      datasets.forEach((ds, indice) => {
        datasets[indice].data = this.normaliseNotes(ds.data, this.getBaremes(this.q_notees));
      });
    }
    const vue = pourcents ? this.translateService.instant('scanexam.pourcents') : this.translateService.instant('scanexam.brut');
    return { labels, datasets, vue };
  }

  private radarMoy(): IRadarDataset {
    return this.basicDataset(this.translateService.instant('scanexam.average'), BLEU_AERO, TRANSPARENT, this.getMoyennesQuestions());
  }

  private radarMed(): IRadarDataset {
    return this.basicDataset(
      this.translateService.instant('scanexam.mediane'),
      BLEU_FONCE,
      TRANSPARENT,
      this.q_notees.map(ns => this.median(ns.notesAssociees)),
    );
  }

  private radarMaxNote(): IRadarDataset {
    return this.basicDataset(
      this.translateService.instant('scanexam.notemax1'),
      VERT,
      TRANSPARENT,
      this.q_notees.map(ns => this.max(ns.notesAssociees)),
    );
  }
  private radarMinNote(): IRadarDataset {
    return this.basicDataset(
      this.translateService.instant('scanexam.notemin1'),
      ROUGE,
      TRANSPARENT,
      this.q_notees.map(ns => this.min(ns.notesAssociees)),
    );
  }

  private radarStudent(etudiant: StudentRes): IRadarDataset {
    return this.basicDataset(
      this.translateService.instant('scanexam.notes'),
      VIOLET,
      VIOLET_LEGER,
      Array.from(this.getNotes(etudiant).values()),
    );
  }

  private basicDataset(label: string, couleurForte: string, couleurLegere: string, data: number[]): IRadarDataset {
    return this.radarDataset(label, couleurLegere, couleurForte, couleurForte, BLANC, BLANC, GRIS, data);
  }

  public toggleRadar(): void {
    const choixPrct = this.data_radar_courant.vue === this.translateService.instant('scanexam.pourcents');

    this.data_radar_courant.vue = choixPrct
      ? this.translateService.instant('scanexam.brut')
      : this.translateService.instant('scanexam.pourcents');
    // Carte
    this.updateCarteRadar();
  }

  public updateCarteRadar(): void {
    const choixPrct = this.data_radar_courant.vue === this.translateService.instant('scanexam.pourcents');
    if (this.etudiantSelec !== null && this.etudiantSelec !== undefined) {
      this.data_radar_courant = this.initStudentRadarData(this.etudiantSelec, choixPrct);
    } else {
      this.data_radar_courant = this.initGlobalRadarData(this.q_notees, choixPrct);
    }
    const selection: string = choixPrct
      ? this.translateService.instant('scanexam.valeursnormalisees')
      : this.translateService.instant('scanexam.valeursbrutes');
    const infosExam = undefined; // : string = this.resumeExam();
    this.updateCarte('questions_stats', undefined, selection, infosExam);
  }

  public onStudentSelect(): void {
    if (this.etudiantSelec !== null && this.etudiantSelec !== undefined) {
      this.data_radar_courant = this.initStudentRadarData(
        this.etudiantSelec,
        this.data_radar_courant.vue === this.translateService.instant('scanexam.pourcents'),
      );
      this.updateCarteRadar();
      this.updateKnobs();
      this.COLOR_KNOBS = VIOLET_TIEDE;
    }
  }

  public onStudentUnselect(): void {
    this.updateCarteRadar();
    this.updateKnobs();
    this.COLOR_KNOBS = BLEU_AERO_TIEDE;
  }

  /** @modifies les valeurs textuelles d'un élément < p-card > */
  private updateCarte(id: string, titre: string | undefined, soustitre: string | undefined, texte: string | undefined): void {
    const c = document.getElementById(id);
    if (c == null) {
      return;
    }
    if (titre !== undefined) {
      c.getElementsByClassName('p-card-title')[0].innerHTML = titre;
    }
    if (soustitre !== undefined) {
      c.getElementsByClassName('p-card-subtitle')[0].innerHTML = soustitre;
    }
    if (texte) {
      c.getElementsByTagName('p')[0].innerHTML = texte;
    }
  }

  private radarDataset(
    label: string,
    backgroundColor: string,
    borderColor: string,
    pointBackgroundColor: string,
    pointBorderColor: string,
    pointHoverBackgroundColor: string,
    pointHoverBorderColor: string,
    data: number[],
  ): IRadarDataset {
    return {
      label,
      backgroundColor,
      borderColor,
      pointBackgroundColor,
      pointBorderColor,
      pointHoverBackgroundColor,
      pointHoverBorderColor,
      data,
    };
  }

  /** @info méthode dédiée à modifier le style de certaines balises de PrimeNG inaccessibles via le CSS de manière classique*/
  private style(): void {
    // Modification de l'espace entre le header et le body d'une carte
    const e = document.getElementsByClassName('p-card-content');
    for (let i = 0; i < e.length; i++) {
      e[i].setAttribute('style', 'padding:0px;');
    }
  }

  /**
   *
   * @warning méthode non fiable à n'utiliser que pour le style.  La version localhost fontionne, mais pas sa version en production
   */
  private clickColonneTableau(id: string): void {
    const es = document.getElementById('selectstudent')?.getElementsByClassName('p-element p-sortable-column');
    if (es === undefined) {
      return;
    }
    for (let i = 0; i < es.length; i++) {
      const e = es[i];
      if (e.getAttribute('psortablecolumn') === id) {
        e.id = 'order-' + id;
        document.getElementById('order-' + id)?.click();
        break;
      }
    }
  }

  public selectQuestion(idQuestion: number): void {
    /* if (this.etudiantSelec == null || this.etudiantSelec === undefined) {
      return;
    }*/
    let q_selectionne = true;
    if (this.idQuestionSelected === idQuestion) {
      // Effet toggle
      q_selectionne = !this.questionSelectionnee;
    }
    if (this.questionSelectionnee && document.getElementsByClassName('knobSelected').length > 0) {
      document.getElementsByClassName('knobSelected')[0].setAttribute('class', 'knobQuestion');
    }
    this.idQuestionSelected = idQuestion;
    if (!q_selectionne) {
      this.texte_correction = this.translateService.instant('scanexam.correction');
      this.questionSelectionnee = false;
      this.idQuestionSelected = 0;
    } else {
      this.texte_correction = this.translateService.instant('scanexam.correction') + '(' + (idQuestion + 1).toString() + ')';
      const knobCard = document.getElementById('knobquest' + idQuestion.toString());
      knobCard?.setAttribute('class', 'knobQuestion knobSelected');
      this.questionSelectionnee = true;
    }
  }

  public goToCorrection(): void {
    location.href = `answer/${this.examid}/${this.idQuestionSelected + 1}/${this.etudiantSelec?.studentNumber?.toString() ?? ''}`;
  }

  public voirLaCopie(): void {
    this.loadAllPages().then(() => {
      if (this.etudiantSelec?.studentNumber?.toString() !== undefined) {
        this.activeIndex = (+this.etudiantSelec.studentNumber.toString() - 1) * this.nbreFeuilleParCopie!;
      } else {
        this.activeIndex = 1;
      }
      this.displayBasic = true;
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onKeydownHandler(event: KeyboardEvent): void {
    this.displayBasic = false;
  }

  public gotoResultat(): void {
    this.router.navigateByUrl(`/showresults/${this.examid}`);
  }
}

interface ISortMobile {
  icon: string;
  sort: string;
}

interface StudSelecMobile {
  name: string;
  value: StudentRes;
}

interface ISort {
  data: StudentRes[];
  mode: string;
  field: string;
  order: number;
}

interface QuestionNotee {
  label: string;
  numero: number;
  bareme: number;
  notesAssociees: number[];
}

interface StudentRes {
  ine: string;
  mail: string;
  nom: string;
  prenom: string;
  abi: number;
  note?: string;
  notequestions: { [key: string]: string };
  studentNumber?: string;
  uuid?: string;
}

interface IRadar {
  labels: string[];
  datasets: IRadarDataset[];
  vue: string;
}

interface IRadarDataset {
  label: string;
  backgroundColor: string;
  borderColor: string;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverBackgroundColor: string;
  pointHoverBorderColor: string;
  data: number[];
}
