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
          this.requeteBaremes().subscribe(b => {
            this.questions = b.body;
            this.notesGlobales();
          })
        );
      }
    });
  }

  private async initStudents(): Promise<any> {
    this.infosStudents = await this.loadStudents();
  }

  private requeteBaremes(): Observable<any> {
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

  private debug(): void {
    this.notesGlobales();
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
    console.log(this.global_stats);
    console.log(this.infosStudents);
    console.log(this.questions);
  }
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

export interface QuestionNotee {
  label: string;
  bareme: number;
  notesAssociees: number[];
}
