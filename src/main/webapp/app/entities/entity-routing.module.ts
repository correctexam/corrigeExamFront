import { Route } from '@angular/router';

export const ENTITIES_ROUTES: Route[] = [
  {
    path: 'course',
    data: { pageTitle: 'gradeScopeIsticApp.course.home.title' },
    loadChildren: () => import('./course/route/course-routing.module').then(m => m.courseRoute),
  },
  {
    path: 'course-group',
    data: { pageTitle: 'gradeScopeIsticApp.courseGroup.home.title' },
    loadChildren: () => import('./course-group/route/course-group-routing.module').then(m => m.courseGroupRoute),
  },
  {
    path: 'student',
    data: { pageTitle: 'gradeScopeIsticApp.student.home.title' },
    loadChildren: () => import('./student/route/student-routing.module').then(m => m.studentRoute),
  },
  {
    path: 'exam',
    data: { pageTitle: 'gradeScopeIsticApp.exam.home.title' },
    loadChildren: () => import('./exam/route/exam-routing.module').then(m => m.examRoute),
  },
  {
    path: 'template',
    data: { pageTitle: 'gradeScopeIsticApp.template.home.title' },
    loadChildren: () => import('./template/route/template-routing.module').then(m => m.templateRoute),
  },
  {
    path: 'question',
    data: { pageTitle: 'gradeScopeIsticApp.question.home.title' },
    loadChildren: () => import('./question/route/question-routing.module').then(m => m.questionRoute),
  },
  {
    path: 'exam-sheet',
    data: { pageTitle: 'gradeScopeIsticApp.examSheet.home.title' },
    loadChildren: () => import('./exam-sheet/route/exam-sheet-routing.module').then(m => m.examSheetRoute),
  },
  {
    path: 'scan',
    data: { pageTitle: 'gradeScopeIsticApp.scan.home.title' },
    loadChildren: () => import('./scan/route/scan-routing.module').then(m => m.scanRoute),
  },
  {
    path: 'final-result',
    data: { pageTitle: 'gradeScopeIsticApp.finalResult.home.title' },
    loadChildren: () => import('./final-result/route/final-result-routing.module').then(m => m.finalResultRoute),
  },
  {
    path: 'student-response',
    data: { pageTitle: 'gradeScopeIsticApp.studentResponse.home.title' },
    loadChildren: () => import('./student-response/route/student-response-routing.module').then(m => m.studentResponseRoute),
  },
  {
    path: 'comments',
    data: { pageTitle: 'gradeScopeIsticApp.comments.home.title' },
    loadChildren: () => import('./comments/route/comments-routing.module').then(m => m.commentsRoute),
  },
  {
    path: 'zone',
    data: { pageTitle: 'gradeScopeIsticApp.zone.home.title' },
    loadChildren: () => import('./zone/route/zone-routing.module').then(m => m.zoneRoute),
  },
  {
    path: 'question-type',
    data: { pageTitle: 'gradeScopeIsticApp.questionType.home.title' },
    loadChildren: () => import('./question-type//route/question-type-routing.module').then(m => m.questionTypeRoute),
  },
  {
    path: 'text-comment',
    data: { pageTitle: 'gradeScopeIsticApp.textComment.home.title' },
    loadChildren: () => import('./text-comment/route/text-comment-routing.module').then(m => m.textCommentRoute),
  },
  {
    path: 'graded-comment',
    data: { pageTitle: 'gradeScopeIsticApp.gradedComment.home.title' },
    loadChildren: () => import('./graded-comment/route/graded-comment-routing.module').then(m => m.gradedCommentRoute),
  },
  {
    path: 'hybrid-comment',
    data: { pageTitle: 'gradeScopeIsticApp.hybridgradedComment.home.title' },
    loadChildren: () => import('./hybrid-graded-comment/route/hybrid-graded-comment-routing.module').then(m => m.hybridGradedCommentRoute),
  },
  {
    path: 'prediction',
    data: { pageTitle: 'gradeScopeIsticApp.prediction.home.title' },
    loadChildren: () => import('./prediction/route/prediction-routing.module').then(m => m.PredictionRoutingModule),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];
