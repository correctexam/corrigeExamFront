import { Route } from '@angular/router';

import { HomeComponent } from './home.component';
import { CreercoursComponent } from '../creercours/creercours.component';
import { CoursdetailsComponent } from '../coursdetail/coursdetails.component';
import { ImportStudentComponent } from '../import-student/import-student.component';
import { ListstudentcourseComponent } from '../liststudentcourse/liststudentcourse.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: HomeComponent,
  data: {
    pageTitle: 'home.title',
  },
};

export const COURSMAIN_ROUTE: Route = {
  path: 'course/:courseid',
  component: CoursdetailsComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.creercours',
  },
};

export const CREERCOURS_ROUTE: Route = {
  path: 'creercours',
  component: CreercoursComponent,
  data: {
    pageTitle: 'home.creercours',
  },
};

export const REGISTERSTUDENT_ROUTE: Route = {
  path: 'registerstudents/:courseid',
  component: ImportStudentComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.creercours',
  },
};

export const LISTESTUDENT_ROUTE: Route = {
  path: 'liststudents/:courseid',
  component: ListstudentcourseComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'home.creercours',
  },
};
