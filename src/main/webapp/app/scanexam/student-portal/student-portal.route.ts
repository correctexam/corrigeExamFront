import { Routes } from '@angular/router';

import { studentSessionGuard } from './student-session.guard';

/** Student portal (ADR 0003 of corrigeExamBack), under /my. ':token' comes last: it would match the other paths. */
export const STUDENT_PORTAL_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./request/student-portal-request.component').then(m => m.StudentPortalRequestComponent),
    data: { pageTitle: 'studentportal.title' },
  },
  {
    path: 'sheets',
    canActivate: [studentSessionGuard],
    loadComponent: () => import('./sheets/student-sheets.component').then(m => m.StudentSheetsComponent),
    data: { pageTitle: 'studentportal.title' },
  },
  {
    path: 'sheets/:sheetId/:questionno',
    canActivate: [studentSessionGuard],
    loadComponent: () => import('../voircopie/voircopie.component').then(m => m.VoirCopieComponent),
    data: { pageTitle: 'home.voircopie' },
  },
  {
    path: 'reponse/:sheetId/:numero/:index',
    canActivate: [studentSessionGuard],
    loadComponent: () => import('../voirreponse/voirreponse.component').then(m => m.VoirReponseComponent),
    data: { pageTitle: 'home.voirreponse' },
  },
  {
    path: 'data',
    canActivate: [studentSessionGuard],
    loadComponent: () => import('./data/student-data.component').then(m => m.StudentDataComponent),
    data: { pageTitle: 'studentportal.data.title' },
  },
  {
    path: ':token',
    loadComponent: () => import('./login/student-portal-login.component').then(m => m.StudentPortalLoginComponent),
    data: { pageTitle: 'studentportal.title' },
  },
];
