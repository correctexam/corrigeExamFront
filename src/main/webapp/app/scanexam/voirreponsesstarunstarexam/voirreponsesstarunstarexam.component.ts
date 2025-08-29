// http://localhost:9000/copie/d6680b56-36a5-4488-ac5b-c862096bc311/1

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { StudentService } from 'app/entities/student/service/student.service';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { AlignImagesService } from '../services/align-images.service';
import { ScanService } from 'app/entities/scan/service/scan.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

import { TableModule } from 'primeng/table';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';

export interface WorstAndBestSolution {
  numero: number;
  bestSolutions: string[];
  worstSolutions: string[];
}

@Component({
  selector: 'jhi-voirreponsesstarunstarexam',
  templateUrl: './voirreponsesstarunstarexam.component.html',
  styleUrls: ['./voirreponsesstarunstarexam.component.scss'],
  providers: [ConfirmationService, MessageService],
  standalone: true,
  imports: [ToastModule, BlockUIModule, ProgressSpinnerModule, RouterLink, FaIconComponent, TableModule, PrimeTemplate],
})
export class VoirReponsesStarUnstarComponent implements OnInit {
  examid: string | undefined;
  blocked = true;
  questions: WorstAndBestSolution[] = [];
  constructor(
    public examService: ExamService,
    public zoneService: ZoneService,
    public studentService: StudentService,
    public scanService: ScanService,
    protected activatedRoute: ActivatedRoute,
    public confirmationService: ConfirmationService,
    public router: Router,
    private alignImagesService: AlignImagesService,
    public messageService: MessageService,
    protected applicationConfigService: ApplicationConfigService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.blocked = true;
      if (params.get('examId') !== null) {
        this.examid = params.get('examId')!;
        this.populateQuestions();
      }
    });
  }

  populateQuestions(): void {
    this.http
      .get<WorstAndBestSolution[]>(this.applicationConfigService.getEndpointFor('api/getAllStarAnswer/' + this.examid))
      .subscribe(s => {
        this.blocked = false;
        this.questions = s;
      });
  }
}
