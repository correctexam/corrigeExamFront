import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { Exam } from 'app/entities/exam/exam.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { Template } from 'app/entities/template/template.model';
import { TemplateService } from 'app/entities/template/service/template.service';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { ExamPlan, toBase64 } from './exam-from-subject';

export interface CreateExamFromSubject {
  courseId: number;
  name: string;
  pdf: Uint8Array;
  plan: ExamPlan;
}

/**
 * Creates an exam from a compiled Typst subject (T25b): the PDF becomes the template, the zones and questions come
 * from the plan, nobody draws a zone. Uses the same endpoints as the manual flow (`creerexam`, template editor).
 * On failure, the exam already created is deleted (with its template, zones and questions), so that a half-built
 * exam is never left in the course.
 */
@Injectable({ providedIn: 'root' })
export class ExamFromSubjectService {
  private readonly templateService = inject(TemplateService);
  private readonly examService = inject(ExamService);
  private readonly zoneService = inject(ZoneService);
  private readonly questionService = inject(QuestionService);

  /** Returns the id of the new exam. */
  async create(req: CreateExamFromSubject): Promise<number> {
    const template = new Template();
    template.name = `${req.name}Template`;
    template.content = toBase64(req.pdf);
    template.contentContentType = 'application/pdf';
    // the generated sheets carry the alignment circles and the identity cells
    template.mark = true;
    template.caseboxname = true;
    template.autoMapStudentCopyToList = true;
    const templateId = (await firstValueFrom(this.templateService.create(template))).body?.id;
    if (templateId === undefined) {
      throw new Error('template not created');
    }

    const exam = new Exam();
    exam.name = req.name;
    exam.templateId = templateId;
    exam.courseId = req.courseId;
    exam.nbgrader = false;
    let examId: number | undefined;
    try {
      examId = (await firstValueFrom(this.examService.create(exam))).body?.id;
      if (examId === undefined) {
        throw new Error('exam not created');
      }
      // one identity zone at a time (T24): a full update of the exam could erase another one
      for (const identity of req.plan.identity) {
        const zoneId = await this.createZone(identity.zone);
        await firstValueFrom(this.examService.setIdentityZone(examId, identity.kind, zoneId));
      }
      for (const planned of req.plan.questions) {
        const zoneId = await this.createZone(planned.zone);
        await firstValueFrom(this.questionService.create({ ...planned.question, zoneId, examId }));
      }
      return examId;
    } catch (e) {
      await this.rollback(examId, templateId);
      throw e;
    }
  }

  private async createZone(zone: ExamPlan['questions'][number]['zone']): Promise<number> {
    const id = (await firstValueFrom(this.zoneService.create({ ...zone, id: undefined }))).body?.id;
    if (id === undefined) {
      throw new Error('zone not created');
    }
    return id;
  }

  /** Best effort: the error of the creation is the one reported. */
  private async rollback(examId: number | undefined, templateId: number): Promise<void> {
    try {
      if (examId !== undefined) {
        // the template, the zones and the questions are removed with the exam
        await firstValueFrom(this.examService.delete(examId));
      } else {
        await firstValueFrom(this.templateService.delete(templateId));
      }
    } catch (e) {
      console.error('Exam created from a Typst subject: rollback failed', e);
    }
  }
}
