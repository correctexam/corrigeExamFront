/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import {  faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';
import {  faMotorcycle as fasMotorcycle } from '@fortawesome/free-solid-svg-icons';
import {  faGraduationCap as faGraduationCap } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'jhi-mes-cours',
  templateUrl: './mes-cours.component.html',
  styleUrls: ['./mes-cours.component.scss']
})
export class MesCoursComponent implements OnInit {


  farCircle = farCircle
  fasMotorcycle =fasMotorcycle
  faGraduationCap = faGraduationCap
  constructor() { }



  ngOnInit(): void {
  }


  accederCours(e:any):void {
  }
}
