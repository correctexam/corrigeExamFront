/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable guard-for-in */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { HttpClient } from '@angular/common/http';
import { STRING_TYPE } from '@angular/compiler';
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

  // Variables d'affichage
  data_radar_global!: IRadar;

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
          })
        );
      }
    });
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
    const qn: QuestionNotee[] = [];
    let indice = 0;
    for (const q of this.infosQuestions) {
      const bareme: number = q.point !== undefined ? q.point : 0;
      const step: string = q.step === undefined ? '' : q.step == null ? '' : q.step.toString();
      const label: string = /* 'Partie '+step + */ ' Question ' + (q.numero !== undefined ? q.numero : '0').toString();
      const notesAssociees: number[] = [];
      qn[indice] = { bareme, label, notesAssociees };
      indice++;
    }
    for (const s of this.infosStudents) {
      if (s.ine !== '') {
        let indiceNote = 0; // On suppose que l'ordre entre infosQuestions et notequestions est le même
        for (const key in s.notequestions) {
          // const indiceNote = parseInt(key, 10);
          const note = parseFloat(s.notequestions[key].replace(',', '.')); // La note associée est décrite avec une virgule et non un point comme séparateur décimal
          qn[indiceNote].notesAssociees.push(note);
          indiceNote++;
        }
        // Stockage de la note de l'élève
        const note = s.note === undefined ? 0 : parseFloat(s.note.replace(',', '.'));
        this.notes_eleves.push(note);
      }
    }
    this.q_notees = qn;
  }

  /** @return le barème associé à chaque question */
  private getBaremes(stats: QuestionNotee[]): number[] {
    const baremes: number[] = [];
    for (const stat of stats) {
      baremes.push(stat.bareme);
    }
    return baremes;
  }
  /** @return la moyenne associée à chaque question */
  private getMoyennesQuestions(): number[] {
    const moyennes: number[] = [];
    for (const qn of this.q_notees) {
      moyennes.push(this.avg(qn.notesAssociees));
    }
    return moyennes;
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
  private sum(tab: number[]): number {
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
    this.initGlobalRadarData(this.q_notees, true);
    this.toggleRadar();
  }

  /** @initialise les données à afficher dans le radar de visualisation globale*/
  private initGlobalRadarData(stats: QuestionNotee[], pourcents: boolean = false): void {
    const labels: string[] = [];
    for (const stat of stats) {
      labels.push(stat.label);
    }

    // Data et objets radar des différentes catégories statistiques
    // Moyenne par question
    const dataMoy: number[] = this.getMoyennesQuestions();
    const radarMoy = this.basicDataset('Moyenne', GRIS, TRANSPARENT, dataMoy);
    // Mediane par question
    const dataMed: number[] = this.getMedianeQuestions();
    const radarMed = this.basicDataset('Mediane', BLEU_FONCE, TRANSPARENT, dataMed);
    // Notes min et max déliverées par question
    const dataMaxNote: number[] = this.getMaxNoteQuestions();
    const radarMaxNote = this.basicDataset('Note maximale déliverée', VERT, TRANSPARENT, dataMaxNote);
    const dataMinNote: number[] = this.getMinNoteQuestions();
    const radarMinNote = this.basicDataset('Note minimale déliverée', ROUGE, TRANSPARENT, dataMinNote);

    const datasets = [radarMoy, radarMed, radarMaxNote, radarMinNote];
    // Traitements pourcentages
    if (pourcents) {
      datasets.forEach((ds, indice) => {
        datasets[indice].data = this.normaliseNotes(ds.data, this.getBaremes(stats));
      });
    }
    const vue = pourcents ? 'pourcents' : 'brut';
    this.data_radar_global = { labels, datasets, vue };
  }

  private basicDataset(label: string, couleurForte: string, couleurLegere: string, data: number[]): IRadarDataset {
    return this.radarDataset(label, couleurLegere, couleurForte, couleurForte, BLANC, BLANC, GRIS, data);
  }

  private resumeExam(): string {
    console.log(this.q_notees);
    const totalPoints: string = this.sum(this.getBaremes(this.q_notees)).toString();
    const moyenne: string = this.getMoyenneExam().toFixed(2).toString();
    const mediane: string = this.getMedianeExam().toFixed(2).toString();
    const ecarttype: string = this.getEcartTypeExam().toFixed(2).toString();
    const maxNote: string = this.getMaxNoteExam().toString();
    const minNote: string = this.getMinNoteExam().toString();
    const resume: string =
      "Moyenne de l'examen: <b>" +
      moyenne +
      '</b>/' +
      totalPoints +
      '<br>' +
      "Écart type de l'examen : σ=<b>" +
      ecarttype +
      '</b><br>' +
      "Médiane de l'examen : <b>" +
      mediane +
      '</b>/' +
      totalPoints +
      '<br>' +
      'Note la plus élevée : <b>' +
      maxNote +
      '</b>/' +
      totalPoints +
      '<br>' +
      'Note la plus basse : <b>' +
      minNote +
      '</b>/' +
      totalPoints +
      '<br>';
    return resume;
  }

  public toggleRadar(): void {
    // Toggle action
    const choixPrct = this.data_radar_global.vue === 'pourcents';
    this.initGlobalRadarData(this.q_notees, choixPrct);
    this.data_radar_global.vue = choixPrct ? 'brut' : 'pourcents';
    // Carte
    const selection: string = !choixPrct ? 'Valeurs brutes par question' : 'Valeurs normalisées par question';
    const infosExam: string = this.resumeExam();
    this.updateCarte('global_stats', undefined, selection, infosExam);
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
  infos?: string;
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
