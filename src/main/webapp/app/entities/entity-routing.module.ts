import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'course',
        data: { pageTitle: 'gradeScopeIsticApp.course.home.title' },
        loadChildren: () => import('./course/course.module').then(m => m.CourseModule),
      },
      {
        path: 'course-group',
        data: { pageTitle: 'gradeScopeIsticApp.courseGroup.home.title' },
        loadChildren: () => import('./course-group/course-group.module').then(m => m.CourseGroupModule),
      },
      {
        path: 'student',
        data: { pageTitle: 'gradeScopeIsticApp.student.home.title' },
        loadChildren: () => import('./student/student.module').then(m => m.StudentModule),
      },
      {
        path: 'exam',
        data: { pageTitle: 'gradeScopeIsticApp.exam.home.title' },
        loadChildren: () => import('./exam/exam.module').then(m => m.ExamModule),
      },
      {
        path: 'template',
        data: { pageTitle: 'gradeScopeIsticApp.template.home.title' },
        loadChildren: () => import('./template/template.module').then(m => m.TemplateModule),
      },
      {
        path: 'question',
        data: { pageTitle: 'gradeScopeIsticApp.question.home.title' },
        loadChildren: () => import('./question/question.module').then(m => m.QuestionModule),
      },
      {
        path: 'exam-sheet',
        data: { pageTitle: 'gradeScopeIsticApp.examSheet.home.title' },
        loadChildren: () => import('./exam-sheet/exam-sheet.module').then(m => m.ExamSheetModule),
      },
      {
        path: 'scan',
        data: { pageTitle: 'gradeScopeIsticApp.scan.home.title' },
        loadChildren: () => import('./scan/scan.module').then(m => m.ScanModule),
      },
      {
        path: 'final-result',
        data: { pageTitle: 'gradeScopeIsticApp.finalResult.home.title' },
        loadChildren: () => import('./final-result/final-result.module').then(m => m.FinalResultModule),
      },
      {
        path: 'student-response',
        data: { pageTitle: 'gradeScopeIsticApp.studentResponse.home.title' },
        loadChildren: () => import('./student-response/student-response.module').then(m => m.StudentResponseModule),
      },
      {
        path: 'comments',
        data: { pageTitle: 'gradeScopeIsticApp.comments.home.title' },
        loadChildren: () => import('./comments/comments.module').then(m => m.CommentsModule),
      },
      {
        path: 'zone',
        data: { pageTitle: 'gradeScopeIsticApp.zone.home.title' },
        loadChildren: () => import('./zone/zone.module').then(m => m.ZoneModule),
      },
      {
        path: 'question-type',
        data: { pageTitle: 'gradeScopeIsticApp.questionType.home.title' },
        loadChildren: () => import('./question-type/question-type.module').then(m => m.QuestionTypeModule),
      },
      {
        path: 'text-comment',
        data: { pageTitle: 'gradeScopeIsticApp.textComment.home.title' },
        loadChildren: () => import('./text-comment/text-comment.module').then(m => m.TextCommentModule),
      },
      {
        path: 'graded-comment',
        data: { pageTitle: 'gradeScopeIsticApp.gradedComment.home.title' },
        loadChildren: () => import('./graded-comment/graded-comment.module').then(m => m.GradedCommentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
