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
import { StatsExampleComponent } from '../stats-example/stats-example.component';

@Component({
  selector: 'jhi-statsexam',
  templateUrl: './statsexam.component.html',
  styleUrls: ['./statsexam.component.scss'],
})
export class StatsExamComponent implements OnInit {
  // Page related variables
  examid: string | undefined = undefined;
  infosStudents: StudentRes[] = [];
  questions: IQuestion[] = [];

  // Statistical variables
  global_stats: QuestionNotee[] = [];
  dataRadar: IRadar | undefined = undefined;

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
            this.questions = b.body;
            this.notesGlobales();
            this.toggleRadar();
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

  private notesGlobales(): void {
    const qn: QuestionNotee[] = [];
    let indice = 0;
    for (const q of this.questions) {
      const bareme: number = q.point !== undefined ? q.point : 0;
      const label: string = 'Question ' + (q.numero !== undefined ? q.numero : '0').toString();
      const notesAssociees: number[] = [];
      qn[indice] = { bareme, label, notesAssociees };
      indice++;
    }
    for (const s of this.infosStudents) {
      for (const key in s.notequestions) {
        const indiceNote = parseInt(key, 10);
        const note = parseFloat(s.notequestions[key].replace(',', '.')); // La note associée est décrite avec une virgule et non un point comme séparateur décimal
        qn[indiceNote - 1].notesAssociees.push(note); // On suppose qu'il n'y a pas de question n°0
      }
    }
    this.global_stats = qn;
    // Ne pas faire attention à la partie qui suit (juste pour test)
    /*  const indiceTmp = 2;
    const moy = this.calculMoy(indiceTmp,this.global_stats);
    const pire = this.pireNote(indiceTmp,this.global_stats);
    const meilleur = this.getDataFromIndex(this.meilleureNote,indiceTmp,this.global_stats)
    console.log(moy)
    console.log(pire)
    console.log(meilleur)
    const allAVG = this.getAllProcessedGrades(this.calculMoy);
    console.log(allAVG);*/
    // this.dataRadar = this.initRadar(this.global_stats);
    // console.log(radar);
  }

  private getBaremes(stats: QuestionNotee[]): number[] {
    const baremes: number[] = [];
    for (const stat of stats) {
      baremes.push(stat.bareme);
    }
    return baremes;
  }

  private getAllProcessedGrades(traitement: (indice: number, stats: QuestionNotee[]) => number): number[] {
    const res: number[] = [];
    this.global_stats.forEach((stat, indice) => {
      const data: number = this.getDataFromIndex(traitement, indice, this.global_stats);
      res.push(data);
    });
    return res;
  }

  // Conceptualise les différentes actions de traitement qui ont lieu
  private getDataFromIndex(
    traitement: (indice: number, stats: QuestionNotee[]) => number,
    idQuestion: number,
    stats: QuestionNotee[]
  ): number {
    return traitement(idQuestion, stats);
  }

  /** @returns la moyenne des élèves pour une question */
  private calculMoy(idQuestion: number, stats: QuestionNotee[]): number {
    let sum = 0;
    let nbNotes = 0;
    stats[idQuestion].notesAssociees.forEach(note => {
      sum += note;
      nbNotes++;
    });
    if (nbNotes === 0) {
      return 0;
    } // Permet d'éviter le NaN
    else {
      return sum / nbNotes;
    }
  }

  private pireNote(idQuestion: number, stats: QuestionNotee[]): number {
    return Math.min(...stats[idQuestion].notesAssociees);
  }

  private meilleureNote(idQuestion: number, stats: QuestionNotee[]): number {
    return Math.max(...stats[idQuestion].notesAssociees);
  }

  public initRadar(stats: QuestionNotee[], pourcents: boolean = false): IRadar {
    const labels: string[] = [];
    for (const stat of stats) {
      labels.push(stat.label);
    }
    // Couleurs à utiliser
    const grisLeger = 'rgba(179,181,198,0.2)';
    const gris = 'rgba(179,181,198,1)';
    const vertLeger = 'rgba(120,255,132,0.2)';
    const vert = 'rgba(120,255,132,1)';
    const rougeLeger = 'rgb(255, 120, 120,0.2)';
    const rouge = 'rgb(255, 120, 120)';
    const blanc = 'rgba(255,255,255,1)';
    const transparent = 'rgba(255,255,255,0.0)';
    // Data et objets radar des différents traitements
    // Moyenne
    const dataMoy: number[] = this.getAllProcessedGrades(this.calculMoy);
    const radarMoy = this.radarDataset('Moyenne', transparent, gris, gris, blanc, blanc, gris, dataMoy);
    // Meilleure note
    const dataMeil: number[] = this.getAllProcessedGrades(this.meilleureNote);
    const radarMeil = this.radarDataset('Meilleure note', transparent, vert, vert, blanc, blanc, vert, dataMeil);
    // Pire note
    const dataPire: number[] = this.getAllProcessedGrades(this.pireNote);
    const radarPire = this.radarDataset('Moins bonne note', transparent, rouge, rouge, blanc, blanc, rouge, dataPire);
    const datasets = [radarMoy, radarMeil, radarPire];
    // Traitements pourcentages
    if (pourcents) {
      datasets.forEach((ds, indice) => {
        datasets[indice].data = this.prctGrades(ds.data, this.getBaremes(stats));
      });
    }
    const vue = pourcents ? 'pourcents' : 'brut';
    return {
      labels,
      datasets,
      vue,
    };
  }

  /**
   *
   * @action l'appeler initialise this.dataRadar ou change sa valeur s'il existe déjà
   */
  public toggleRadar(): void {
    // Bouton
    // const b = document.getElementById("radarChoice"); if(b==null){return;}
    const choixPrct = this.dataRadar?.vue === 'pourcents'; // b.getAttribute("choix")?.includes("pourcents"); // Choix des pourcentages
    this.dataRadar = this.initRadar(this.global_stats, choixPrct);
    this.dataRadar.vue = choixPrct ? 'brut' : 'pourcents';
    // b.setAttribute("choix",choix?"brut":"pourcents")
    // Carte
    const c = document.getElementById('infosRadar');
    if (c == null) {
      return;
    }
    const elemSoustitre = c.querySelector('.p-card-subtitle');
    if (elemSoustitre == null) {
      return;
    }
    elemSoustitre.innerHTML = !choixPrct ? 'Valeurs brutes par question' : 'Pourcentages par question';
    // Résumé de l'examen
    const totalPoints: number = this.sum(this.getBaremes(this.global_stats));
    if (!choixPrct) {
      let infosExam = '';
      this.dataRadar.datasets.forEach(ds => {
        infosExam += ds.label + ' : ' + this.sum(ds.data).toString() + '/' + totalPoints.toString() + '<br>';
      });

      c.getElementsByTagName('p')[0].innerHTML = infosExam + ' <br> Notes à recalculer, on cherche à le faire par élève !! ';
    }
    console.log(this.dataRadar);
  }

  private sum(tab: number[]): number {
    return tab.reduce((x, y) => x + y, 0);
  }

  private prctGrades(notes: number[], baremes: number[]): number[] {
    //  expect(notes.length).toBe(baremes.length);
    notes.forEach((note, indice) => {
      note /= baremes[indice];
      notes[indice] = note * 100;
    });
    return notes;
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

// Interfaces permettant décrivant les données nécessaires
// à la construction d'un diagramme en radar
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
