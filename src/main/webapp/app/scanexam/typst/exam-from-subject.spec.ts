/**
 * @jest-environment node
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { HttpResponse } from '@angular/common/http';
import { Injector, runInInjectionContext } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { GradeType } from 'app/entities/enumerations/grade-type.model';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { QuestionService } from 'app/entities/question/service/question.service';
import { TemplateService } from 'app/entities/template/service/template.service';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { IQuestion } from 'app/entities/question/question.model';
import { checkLayout, planExam, QUESTION_TYPE_MANUAL, QUESTION_TYPE_QCM, toBase64 } from './exam-from-subject';
import { ExamFromSubjectService } from './exam-from-subject.service';
import { buildLayout, parseZoneMetadata } from './typst-zones';

const fixture = JSON.parse(readFileSync(join(__dirname, 'fixtures/genie-logiciel.preview.json'), 'utf8')) as unknown;
const layout = buildLayout(parseZoneMetadata(fixture));
const defaults = { step: 4, gradeType: GradeType.DIRECT };

describe('exam-from-subject', () => {
  describe('planExam', () => {
    const plan = planExam(layout, defaults);

    it('plans the three identity zones', () => {
      expect(plan.identity.map(i => i.kind)).toEqual(['NAME', 'FIRSTNAME', 'INE']);
    });

    it('recognises names letter by letter only when they are written in cells', () => {
      expect(plan.caseBoxName).toBe(true);
      expect(planExam({ ...layout, identityStyle: 'free' }, defaults).caseBoxName).toBe(false);
    });

    it('plans one question per zone, with the canonical number and the key as label', () => {
      expect(plan.questions.map(p => [p.question.numero, p.question.libelle, p.question.typeId])).toEqual([
        [1, 'q-classes', QUESTION_TYPE_MANUAL],
        [2, 'q-sequence', QUESTION_TYPE_MANUAL],
        [3, 'q-code', QUESTION_TYPE_MANUAL],
        [4, 'q-patterns', QUESTION_TYPE_QCM],
        [5, 'q-temps', QUESTION_TYPE_MANUAL],
        [6, 'q-nb-classes', QUESTION_TYPE_MANUAL],
        [7, 'q-pont', QUESTION_TYPE_MANUAL],
      ]);
    });

    it('keeps the points, the MCQ grading and the defaults of the teacher', () => {
      const qcm = plan.questions.find(p => p.question.libelle === 'q-patterns')!.question;
      expect(qcm.point).toBe(2);
      expect(qcm.validExpression).toBe('a&c=100;a+=50;*=-25');
      expect(qcm.step).toBe(4);
      const free = plan.questions.find(p => p.question.libelle === 'q-classes')!.question;
      expect(free.gradeType).toBe(GradeType.DIRECT);
      expect(free.validExpression).toBeUndefined();
    });

    it('uses the grading mode written in the subject', () => {
      const metas = parseZoneMetadata(fixture).map(m => (m.kind === 'question' && m.key === 'q-classes' ? { ...m, grade: 'negative' } : m));
      const q = planExam(buildLayout(metas), defaults).questions.find(p => p.question.libelle === 'q-classes')!.question;
      expect(q.gradeType).toBe(GradeType.NEGATIVE);
    });
  });

  describe('checkLayout', () => {
    it('accepts the example and warns about the answers graded by hand for now', () => {
      const issues = checkLayout(layout);
      expect(issues.filter(i => i.level === 'error')).toEqual([]);
      expect(issues.filter(i => i.key === 'gradedByHand').map(i => i.params!['question'])).toEqual(['q-temps', 'q-nb-classes', 'q-pont']);
    });

    it('rejects points that are not quarters and an exam without question', () => {
      const metas = parseZoneMetadata(fixture).map(m => (m.kind === 'question' && m.key === 'q-code' ? { ...m, points: 0.3 } : m));
      expect(checkLayout(buildLayout(metas)).some(i => i.level === 'error' && i.key === 'badPoints')).toBe(true);
      expect(checkLayout({ ...layout, questions: [] }).some(i => i.key === 'noQuestion')).toBe(true);
    });

    it('warns when an identity zone is missing', () => {
      const issues = checkLayout({ ...layout, identity: { lastname: layout.identity.lastname } });
      expect(issues.filter(i => i.key === 'noIdentityZone').map(i => i.params!['role'])).toEqual(['firstname', 'stdid']);
    });
  });

  it('encodes a large PDF in base64', () => {
    const bytes = new Uint8Array(200000).map((_, i) => i % 251);
    expect(Buffer.from(toBase64(bytes), 'base64').equals(Buffer.from(bytes))).toBe(true);
  });

  describe('ExamFromSubjectService', () => {
    const ok = <T>(body: T): Observable<HttpResponse<T>> => of(new HttpResponse({ body }));
    let nextZone = 100;
    let calls: string[];
    let questions: IQuestion[];
    const zoneService = { create: jest.fn(() => ok({ id: ++nextZone })) };
    const templateService = { create: jest.fn(() => ok({ id: 7 })), delete: jest.fn(() => ok(null)) };
    const examService = {
      create: jest.fn(() => ok({ id: 42 })),
      setIdentityZone: jest.fn((examId: number, kind: string) => {
        calls.push(`identity ${kind}`);
        return ok({ id: examId });
      }),
      delete: jest.fn(() => ok(null)),
    };
    const questionService = {
      create: jest.fn((q: IQuestion) => {
        questions.push(q);
        return ok({ ...q, id: questions.length });
      }),
    };
    const service = (): ExamFromSubjectService => {
      const injector = Injector.create({
        providers: [
          { provide: ZoneService, useValue: zoneService },
          { provide: TemplateService, useValue: templateService },
          { provide: ExamService, useValue: examService },
          { provide: QuestionService, useValue: questionService },
        ],
      });
      return runInInjectionContext(injector, () => new ExamFromSubjectService());
    };

    beforeEach(() => {
      jest.clearAllMocks();
      calls = [];
      questions = [];
    });

    it('creates the template, the exam, the identity zones and the questions', async () => {
      const plan = planExam(layout, defaults);
      const id = await service().create({ courseId: 3, name: 'GL', pdf: new Uint8Array([37, 80, 68, 70]), plan });
      expect(id).toBe(42);
      expect(templateService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'GLTemplate',
          content: 'JVBERg==',
          contentContentType: 'application/pdf',
          mark: true,
          caseboxname: true,
        }),
      );
      expect(examService.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'GL', templateId: 7, courseId: 3, nbgrader: false }));
      expect(calls).toEqual(['identity NAME', 'identity FIRSTNAME', 'identity INE']);
      expect(questions.length).toBe(plan.questions.length);
      expect(questions.every(q => q.examId === 42 && q.zoneId! > 100)).toBe(true);
      expect(examService.delete).not.toHaveBeenCalled();
    });

    it('deletes the exam when a question cannot be created', async () => {
      questionService.create.mockImplementationOnce(() => throwError(() => new Error('HTTP 500')));
      await expect(
        service().create({ courseId: 3, name: 'GL', pdf: new Uint8Array([1]), plan: planExam(layout, defaults) }),
      ).rejects.toThrow('HTTP 500');
      expect(examService.delete).toHaveBeenCalledWith(42);
    });

    it('deletes the template when the exam cannot be created', async () => {
      examService.create.mockImplementationOnce(() => throwError(() => new Error('HTTP 403')));
      await expect(
        service().create({ courseId: 3, name: 'GL', pdf: new Uint8Array([1]), plan: planExam(layout, defaults) }),
      ).rejects.toThrow('HTTP 403');
      expect(examService.delete).not.toHaveBeenCalled();
      expect(templateService.delete).toHaveBeenCalledWith(7);
    });
  });
});
