/* eslint-disable no-console */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { CourseService } from 'app/entities/course/service/course.service';
import { QuestionService } from 'app/entities/question/service/question.service';

@Component({
  selector: 'jhi-stats-example',
  templateUrl: './stats-example.component.html',
  styleUrls: ['./stats-example.component.scss'],
})
export class StatsExampleComponent implements OnInit {
  dataDiagBarres: any;
  dataCourbes: any;
  dataRadar: any;
  dataCombo: any;

  constructor(
    protected applicationConfigService: ApplicationConfigService,
    private http: HttpClient,
    protected courseService: CourseService,
    public questionService: QuestionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dataDiagBarres = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Mes données bleues',
          backgroundColor: '#42A5F5',
          data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
          label: 'Mes données oranges',
          backgroundColor: '#FFA726',
          data: [28, 48, 40, 19, 86, 27, 90],
        },
      ],
    };
    this.dataCourbes = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Données vertes',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#008000',
          tension: 0.4,
        },
        {
          label: 'Données violettes',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: '#ee82ee',
          tension: 0.4,
        },
      ],
    };
    this.dataRadar = {
      labels: ['Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5', 'Question 6', 'Question 7'],
      datasets: [
        {
          label: 'Moyenne',
          backgroundColor: 'rgba(179,181,198,0.0)',
          borderColor: 'rgba(179,181,198,1)',
          pointBackgroundColor: 'rgba(179,181,198,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(179,181,198,1)',
          data: [
            1.2045454545454546, 1.0227272727272727, 1.2954545454545454, 1.2045454545454546, 2.6136363636363638, 1.0681818181818181,
            0.9772727272727273,
          ],
        },
        {
          label: 'Pire note',
          backgroundColor: 'rgb(255, 120, 120,0.0)',
          borderColor: 'rgb(255, 120, 120)',
          pointBackgroundColor: 'rgb(255, 120, 120)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 120, 120)',
          data: [0.5, 0.5, 0.5, 0.5, 0.25, 0.5, 0.5],
        },
        {
          label: 'Meilleure note',
          backgroundColor: 'rgba(120,255,132,0.0)',
          borderColor: 'rgba(120,255,132)',
          pointBackgroundColor: 'rgba(120,255,132,0.0)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(120,255,132,0.0)',
          data: [1.75, 2, 2.75, 2, 4.75, 2, 1.75],
        },
      ],
    };
    this.dataCombo = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          type: 'line',
          label: 'Dataset 1',
          borderColor: '#42A5F5',
          borderWidth: 2,
          fill: false,
          data: [50, 25, 12, 48, 56, 76, 42],
        },
        {
          type: 'bar',
          label: 'Dataset 2',
          backgroundColor: '#66BB6A',
          data: [21, 84, 24, 75, 37, 65, 34],
          borderColor: 'white',
          borderWidth: 2,
        },
        {
          type: 'bar',
          label: 'Dataset 3',
          backgroundColor: '#FFA726',
          data: [41, 52, 24, 74, 23, 21, 32],
        },
      ],
    };

    console.log(this.dataRadar);
  }
}
