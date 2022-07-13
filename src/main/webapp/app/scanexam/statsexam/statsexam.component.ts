/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable guard-for-in */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { CourseService } from 'app/entities/course/service/course.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { Observable } from 'rxjs';

// Couleurs à utiliser
const GRIS_LEGER = 'rgba(179,181,198,0.2)';
const GRIS = 'rgba(179,181,198,1)';
const VERT_LEGER = 'rgba(120,255,132,0.2)';
const VERT = 'rgba(120,255,132,1)';
const ROUGE_LEGER = 'rgb(255, 120, 120,0.2)';
const ROUGE = 'rgb(255, 120, 120)';
const BLEU_FONCE_LEGER = 'rgb(72, 61, 139,0.2)';
const BLEU_FONCE = 'rgb(72, 61, 139)';
const BLANC = 'rgba(255,255,255,1)';
const VIOLET = 'rgb(233, 120, 255)';
const VIOLET_TIEDE = 'rgb(233, 120, 255,0.6)';
const VIOLET_LEGER = 'rgb(233, 120, 255,0.2)';
const BLEU_AERO = 'rgb(142, 184, 229)';
const BLEU_AERO_TIEDE = 'rgb(142, 184, 229,0.6)';
const BLEU_AERO_LEGER = 'rgb(142, 184, 229,0.2)';
const TRANSPARENT = 'rgba(255,255,255,0.0)';

@Component({
  selector: 'jhi-statsexam',
  templateUrl: './statsexam.component.html',
  styleUrls: ['./statsexam.component.scss'],
})
export class StatsExamComponent implements OnInit {
  // Page related variables
  examid: string | undefined = undefined;
  infosQuestions: IQuestion[] = [];
  infosStudents: StudentRes[] = [];
  q_notees: QuestionNotee[] = [];
  notes_eleves: number[] = [];
  choixTri: boolean = true;

  // Variables d'affichage
  data_radar_courant!: IRadar;
  etudiantSelec: StudentRes | null | undefined;
  listeMobileEtudiant: StudSelecMobile[] = [];
  mobileSortChoices = [
    { icon: 'pi pi-id-card', sort: 'ine' },
    { icon: 'pi pi-sort-alpha-up', sort: 'alpha' },
    { icon: 'pi pi-sort-numeric-up', sort: 'note' },
  ];
  mobileSortChoice: any;
  knobsCourants: string[] = [];
  COLOR_KNOBS = BLEU_AERO_TIEDE;
  idQuestionSelected: number = 0;
  questionSelectionnee: boolean = false;
  readonly ICONSORTUP = 'pi pi-sort-amount-up-alt'; // Permet d'éviter une étrange erreur de vscode (Unexpected keyword or identifier.javascript)

  constructor(
    protected applicationConfigService: ApplicationConfigService,
    private http: HttpClient,
    protected courseService: CourseService,
    public questionService: QuestionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('examid') !== null) {
        this.examid = params.get('examid')!;
        this.initStudents().then(() =>
          this.requeteInfoQuestions().subscribe(b => {
            this.infosQuestions = b.body;
            this.initStatVariables();
            this.initDisplayVariables();
            this.style();
          })
        );
      }
    });
  }

  public changementTriMobile(): void {
    this.clickColonneTableau(this.mobileSortChoice.sort);
    this.initMobileSelection();
  }

  private async initStudents(): Promise<any> {
    this.infosStudents = await this.loadStudents();
  }

  private requeteInfoQuestions(): Observable<any> {
    return this.questionService.query({ examId: this.examid });
  }

  private async loadStudents(): Promise<StudentRes[]> {
    return new Promise<StudentRes[]>(res => {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      this.http.get<StudentRes[]>(this.applicationConfigService.getEndpointFor('api/showResult/' + this.examid)).subscribe(s => {
        res(s);
      });
    });
  }

  private initStatVariables(): void {
    this.triNotes(this.infosStudents);
    const qn: QuestionNotee[] = [];
    for (const q of this.infosQuestions) {
      const bareme: number = q.point !== undefined ? q.point : 0;
      const label: string = ' Question ' + (q.numero !== undefined ? q.numero : '0').toString();
      const notesAssociees: number[] = [];
      const quest_divisee = qn.find(quest => quest.label === label);
      if (quest_divisee === undefined) {
        // On ne prend pas en compte la notation de la deuxième partie s'il y en a une
        // (même comportement que lorsque l'on note la question dans la partie  correction)
        qn.push({ bareme, label, notesAssociees });
      }
    }
    for (const s of this.infosStudents) {
      if (s.ine !== '') {
        let indiceNote = 0; // On suppose que l'ordre entre infosQuestions et notequestions est le même
        for (const key in s.notequestions) {
          // const indiceNote = parseInt(key, 10);
          const note = this.s2f(s.notequestions[key]); // La note associée est décrite avec une virgule et non un point comme séparateur décimal
          qn[indiceNote].notesAssociees.push(note);
          indiceNote++;
        }
        // Stockage de la note de l'élève
        const note = s.note === undefined ? 0 : this.s2f(s.note);
        this.notes_eleves.push(note);
      }
    }
    this.q_notees = qn;
  }

  public s2f(str: string): number {
    return parseFloat(str.replace(',', '.'));
  }
  public triSelection(event: ISort): void {
    switch (event.field) {
      case 'ine':
        this.triINE(this.infosStudents);
        this.mobileSortChoice = this.mobileSortChoices[0];
        break;
      case 'alpha':
        this.triAlpha(this.infosStudents);
        this.mobileSortChoice = this.mobileSortChoices[1];
        break;
      default:
        this.triNotes(this.infosStudents);
        this.mobileSortChoice = this.mobileSortChoices[2];
        break;
    }
    if (event.order === -1) {
      event.data.reverse();
    }
    this.choixTri = event.order === 1;
    this.initMobileSelection();
  }

  private triNotes(etudiants: StudentRes[]): StudentRes[] {
    etudiants.sort((s1: StudentRes, s2: StudentRes) => {
      const note1 = s1.note;
      const note2 = s2.note;
      if (note1 === undefined && note2 === undefined) {
        return 0;
      } else if (note1 === undefined) {
        return -1;
      } else if (note2 === undefined) {
        return 1;
      } else if (this.s2f(note1) < this.s2f(note2)) {
        return -1;
      } else if (this.s2f(note1) === this.s2f(note2)) {
        return this.compareAlpha(s1, s2);
      }
      return 1;
    });
    return etudiants.reverse();
  }

  private triINE(etudiants: StudentRes[]): StudentRes[] {
    etudiants.sort((s1: StudentRes, s2: StudentRes) => {
      const ine1 = s1.ine;
      const ine2 = s2.ine;
      return ine1.localeCompare(ine2);
    });
    return etudiants;
  }

  private triAlpha(etudiants: StudentRes[]): StudentRes[] {
    etudiants.sort((s1: StudentRes, s2: StudentRes) => {
      const diff = this.compareAlpha(s1, s2);
      return diff;
    });
    return etudiants;
  }

  private compareAlpha(s1: StudentRes, s2: StudentRes): number {
    const nom1 = s1.nom;
    const nom2 = s2.nom;
    let diff = nom1.localeCompare(nom2);
    if (diff === 0) {
      diff = s1.prenom.localeCompare(s2.prenom);
    }
    return diff;
  }

  /** @return le barème associé à chaque question */
  public getBaremes(stats: QuestionNotee[]): number[] {
    const baremes: number[] = [];
    for (const stat of stats) {
      baremes.push(stat.bareme);
    }
    return baremes;
  }
  public getBaremeExam(): number {
    return this.sum(this.getBaremes(this.q_notees));
  }

  private getNotes(etudiant: StudentRes): number[] {
    const notes: number[] = [];
    for (const key in etudiant.notequestions) {
      notes.push(this.s2f(etudiant.notequestions[key]));
    }
    return notes;
  }
  // Permet de pouvoir accéder facilement aux notes de l'étudiant sélectionné et de ne pas devoir gérer les erreurs en cas d'étudiant non sélectionné
  public getNotesSelect(): number[] {
    if (this.etudiantSelec !== null && this.etudiantSelec !== undefined) {
      return this.getNotes(this.etudiantSelec);
    } else {
      return [];
    }
  }

  getNoteSelect(): number {
    return this.sum(this.getNotesSelect());
  }

  /** @return la moyenne associée à chaque question */
  private getMoyennesQuestions(): number[] {
    const moyennes: number[] = [];
    for (const qn of this.q_notees) {
      moyennes.push(this.avg(qn.notesAssociees));
    }
    return moyennes;
  }

  private updateKnobs(): void {
    const knobsNb = this.etudiantSelec !== null && this.etudiantSelec !== undefined ? this.getNotesSelect() : this.getMoyennesQuestions();
    this.knobsCourants = [];
    knobsNb.forEach(knobValue => {
      this.knobsCourants.push(knobValue.toFixed(2));
    });
  }

  public getMoyenneExam(): number {
    return this.sum(this.notes_eleves) / this.notes_eleves.length;
  }

  /** @return la médiane associée à chaque question */
  private getMedianeQuestions(): number[] {
    const medianes: number[] = [];
    for (const qn of this.q_notees) {
      medianes.push(this.med(qn.notesAssociees));
    }
    return medianes;
  }

  public getMedianeExam(): number {
    return this.med(this.notes_eleves);
  }

  public getVarianceExam(): number {
    return this.var(this.notes_eleves);
  }

  public getEcartTypeExam(): number {
    return this.ecart_type(this.notes_eleves);
  }

  /** @return la note la plus élevée associée à chaque question */
  private getMaxNoteQuestions(): number[] {
    const maxnotes: number[] = [];
    for (const qn of this.q_notees) {
      maxnotes.push(this.max(qn.notesAssociees));
    }
    return maxnotes;
  }
  /** @return la note la moins élevée associée à chaque question */
  private getMinNoteQuestions(): number[] {
    const minnotes: number[] = [];
    for (const qn of this.q_notees) {
      minnotes.push(this.min(qn.notesAssociees));
    }
    return minnotes;
  }

  public getMaxNoteExam(): number {
    return this.max(this.notes_eleves);
  }

  public getMinNoteExam(): number {
    return this.min(this.notes_eleves);
  }

  /** @param tab un tableau non vide @returns la valeur la plus élevée  */
  private max(tab: number[]): number {
    return Math.max(...tab);
  }

  /** @param tab un tableau non vide @returns la valeur la moins élevée  */
  private min(tab: number[]): number {
    return Math.min(...tab);
  }

  /** @param tab un tableau non vide @returns la moyenne  */
  sum(tab: number[]): number {
    return tab.reduce((x, y) => x + y, 0);
  }

  /** @param tab un tableau non vide @returns la moyenne correspondant à ce tableau*/
  private avg(tab: number[]): number {
    return tab.length > 0 ? this.sum(tab) / tab.length : 0;
  }

  /** @param tab un tableau non vide @returns la mediane correspondant à ce tableau*/
  private med(tab: number[]): number {
    tab.sort();
    const moitie: number = tab.length / 2;
    const indiceMilieu: number = Number.isInteger(moitie) ? moitie : Math.floor(moitie);
    return tab[indiceMilieu];
  }

  /** @param tab un tableau non vide @returns la variance correspondant à ce tableau*/
  private var(tab: number[]): number {
    const moy: number = this.avg(tab);
    let variance = 0;
    for (const xi of tab) {
      variance += Math.pow(xi - moy, 2);
    }
    variance /= tab.length;
    return variance;
  }

  /** @param tab un tableau non vide @returns l'écart-type correspondant à ce tableau*/
  private ecart_type(tab: number[]): number {
    return Math.sqrt(this.var(tab));
  }

  private normaliseNotes(notes: number[], baremes: number[], norme: number = 100): number[] {
    //  expect(notes.length).toBe(baremes.length);
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

  private s_red(s: string, length: number = 3, abrevSymbol: string = '.'): string {
    if (length >= s.length) {
      return s;
    }
    return s.slice(0, length) + abrevSymbol;
  }

  /** @initialise les données à afficher dans le radar de visualisation globale*/
  private initGlobalRadarData(stats: QuestionNotee[], pourcents: boolean = false): IRadar {
    const labels: string[] = [];
    for (const stat of stats) {
      labels.push(stat.label);
    }
    const datasets = [this.radarMoy(), this.radarMed(), this.radarMaxNote(), this.radarMinNote()];
    // Traitements pourcentages
    if (pourcents) {
      datasets.forEach((ds, indice) => {
        datasets[indice].data = this.normaliseNotes(ds.data, this.getBaremes(stats));
      });
    }
    const vue = pourcents ? 'pourcents' : 'brut';
    return { labels, datasets, vue };
  }

  private initStudentRadarData(etudiant: StudentRes, pourcents: boolean = false): IRadar {
    const labels = this.data_radar_courant.labels;
    const datasets = [this.radarStudent(etudiant), this.radarMoy(), this.radarMed()];
    if (pourcents) {
      datasets.forEach((ds, indice) => {
        datasets[indice].data = this.normaliseNotes(ds.data, this.getBaremes(this.q_notees));
      });
    }
    const vue = pourcents ? 'pourcents' : 'brut';
    return { labels, datasets, vue };
  }

  private radarMoy(): IRadarDataset {
    const dataMoy: number[] = this.getMoyennesQuestions();
    return this.basicDataset('Moyenne', BLEU_AERO, TRANSPARENT, dataMoy);
  }

  private radarMed(): IRadarDataset {
    const dataMed: number[] = this.getMedianeQuestions();
    return this.basicDataset('Mediane', BLEU_FONCE, TRANSPARENT, dataMed);
  }

  private radarMaxNote(): IRadarDataset {
    const dataMaxNote: number[] = this.getMaxNoteQuestions();
    return this.basicDataset('Note maximale déliverée', VERT, TRANSPARENT, dataMaxNote);
  }
  private radarMinNote(): IRadarDataset {
    const dataMinNote: number[] = this.getMinNoteQuestions();
    return this.basicDataset('Note minimale déliverée', ROUGE, TRANSPARENT, dataMinNote);
  }

  private radarStudent(etudiant: StudentRes): IRadarDataset {
    const notesEtudiant: number[] = this.getNotes(etudiant);
    return this.basicDataset('Notes', VIOLET, VIOLET_LEGER, notesEtudiant);
  }

  private basicDataset(label: string, couleurForte: string, couleurLegere: string, data: number[]): IRadarDataset {
    return this.radarDataset(label, couleurLegere, couleurForte, couleurForte, BLANC, BLANC, GRIS, data);
  }

  private resumeExam(): string {
    const totalPoints: string = this.getBaremeExam().toString();
    const moyenne: string = this.getMoyenneExam().toFixed(2).toString();
    const mediane: string = this.getMedianeExam().toFixed(2).toString();
    const ecarttype: string = this.getEcartTypeExam().toFixed(2).toString();
    const maxNote: string = this.getMaxNoteExam().toString();
    const minNote: string = this.getMinNoteExam().toString();
    const resume: string = `Moyenne de l'examen: <b>${moyenne}</b>/${totalPoints}<br>Écart type de l'examen : σ=<b>${ecarttype}</b><br>Médiane de l'examen : <b>${mediane}</b>/${totalPoints}<br>Note la plus élevée : <b>${maxNote}</b>/${totalPoints}<br>Note la plus basse : <b>${minNote}</b>/${totalPoints}<br>`;
    return resume;
  }

  public toggleRadar(): void {
    const choixPrct = this.data_radar_courant.vue === 'pourcents';

    this.data_radar_courant.vue = choixPrct ? 'brut' : 'pourcents';
    // Carte
    this.updateCarteRadar();
  }

  public updateCarteRadar(): void {
    const choixPrct = this.data_radar_courant.vue === 'pourcents';
    if (this.etudiantSelec !== null && this.etudiantSelec !== undefined) {
      this.data_radar_courant = this.initStudentRadarData(this.etudiantSelec, choixPrct);
    } else {
      this.data_radar_courant = this.initGlobalRadarData(this.q_notees, choixPrct);
    }
    const selection: string = choixPrct ? 'Valeurs normalisées par question' : 'Valeurs brutes par question';
    const infosExam = undefined; // : string = this.resumeExam();
    this.updateCarte('questions_stats', undefined, selection, infosExam);
  }

  onStudentSelect(event: any): void {
    if (this.etudiantSelec !== null && this.etudiantSelec !== undefined) {
      this.updateCarte('selection_etudiant', undefined, this.etudiantSelec.prenom + ' ' + this.etudiantSelec.nom, undefined);
      this.data_radar_courant = this.initStudentRadarData(this.etudiantSelec, this.data_radar_courant.vue === 'pourcents');
      this.updateCarteRadar();
      this.updateKnobs();
      this.COLOR_KNOBS = VIOLET_TIEDE;
    }
  }
  onStudentUnselect(event: any): void {
    this.updateCarte('selection_etudiant', undefined, 'Aucun étudiant sélectionné', undefined);
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
    data: number[]
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
    // Permet dès le chargement de voir que l'ordre sélectionné est celui des notes
    this.clickColonneTableau('note');
  }

  private clickColonneTableau(id: string): void {
    const f = document.querySelector('th[ng-reflect-field=' + id + ']');
    if (f === null) {
      return;
    }
    f.id = 'order-' + id;
    document.getElementById('order-' + id)?.click();
  }

  public selectQuestion(idQuestion: number): void {
    const e = document.getElementById('selectstudent')?.getElementsByClassName('p-button-label')[1];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (e === undefined || this.etudiantSelec == null || this.etudiantSelec === undefined) {
      return;
    }
    let q_selectionne = true;
    if (this.idQuestionSelected === idQuestion) {
      // Effet toggle
      // idQuestion = 0;
      q_selectionne = !this.questionSelectionnee;
    }
    if (this.questionSelectionnee && document.getElementsByClassName('knobSelected').length > 0) {
      document.getElementsByClassName('knobSelected')[0].setAttribute('class', 'knobQuestion');
    }
    this.idQuestionSelected = idQuestion;
    if (!q_selectionne) {
      e.innerHTML = 'Correction';
      this.questionSelectionnee = false;
      this.idQuestionSelected = 0;
    } else {
      e.innerHTML = 'Correction (' + (idQuestion + 1).toString() + ')';
      const knobCard = document.getElementById('knobquest' + idQuestion.toString());
      knobCard?.setAttribute('class', 'knobQuestion knobSelected');
      this.questionSelectionnee = true;
    }
  }

  public goToCorrection(): void {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    location.href = 'answer/' + this.examid + '/' + (this.idQuestionSelected + 1) + '/' + this.etudiantSelec?.studentNumber?.toString();
  }
  public voirLaCopie(): void {
    alert('Fonction à développer');
  }
}
export interface StudSelecMobile {
  name: string;
  value: StudentRes;
}
export interface ISort {
  data: StudentRes[];
  mode: string;
  field: string;
  order: number;
}
export interface QuestionNotee {
  label: string;
  bareme: number;
  notesAssociees: number[];
}
export interface StudentRes {
  ine: string;
  mail: string;
  nom: string;
  prenom: string;
  abi: boolean;
  note?: string;
  notequestions: { [key: string]: string };
  studentNumber?: string;
  uuid?: string;
}
export interface IRadar {
  labels: string[];
  datasets: IRadarDataset[];
  vue: string;
}
export interface IRadarDataset {
  label: string;
  backgroundColor: string;
  borderColor: string;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverBackgroundColor: string;
  pointHoverBorderColor: string;
  data: number[];
}
