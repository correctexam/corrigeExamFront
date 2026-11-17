/**
 * What an exam created from a Typst subject contains (T25b, ADR 0004): pure planning, no HTTP.
 * The plan is executed by `ExamFromSubjectService`.
 */

import { GradeType } from 'app/entities/enumerations/grade-type.model';
import { IdentityZoneKind } from 'app/entities/exam/service/exam.service';
import { IQuestion } from 'app/entities/question/question.model';
import { IQuestionType } from 'app/entities/question-type/question-type.model';
import { IZone } from 'app/entities/zone/zone.model';
import { GeneratedLayout, GeneratedQuestion, IdentityRole } from './typst-zones';

/** Question types used by a generated exam, by `question_type.algo_name` (ids differ between databases). */
export type PlannedQuestionType = 'manual' | 'QCM';

export type QuestionTypeIds = Record<PlannedQuestionType, number>;

/** Ids of the question types of this database, as the template editor finds them (by `algoName`). */
export function resolveQuestionTypeIds(types: IQuestionType[]): QuestionTypeIds {
  const id = (algoName: PlannedQuestionType): number => {
    const type = types.find(t => t.algoName === algoName && t.id !== undefined);
    if (type?.id === undefined) {
      throw new Error(`question type "${algoName}" missing from the database (table question_type)`);
    }
    return type.id;
  };
  return { manual: id('manual'), QCM: id('QCM') };
}

/** Defaults of the teacher (`PreferenceService.getPreferenceForQuestion()`). */
export interface QuestionDefaults {
  step: number;
  gradeType: GradeType;
}

export interface PlannedIdentityZone {
  kind: IdentityZoneKind;
  zone: IZone;
}

export interface PlannedQuestion {
  zone: IZone;
  /** Type of the question; its id is set when the exam is created (`resolveQuestionTypeIds`). */
  type: PlannedQuestionType;
  /** Question without zone, exam nor type id: they are known once created. */
  question: IQuestion;
}

export interface ExamPlan {
  /** `Template.caseboxname`: names written in cells (recognised letter by letter) rather than in a free frame. */
  caseBoxName: boolean;
  identity: PlannedIdentityZone[];
  questions: PlannedQuestion[];
}

export type IssueLevel = 'error' | 'warning';

export interface LayoutIssue {
  level: IssueLevel;
  /** i18n key (`scanexam.typst.issue.*`). */
  key: string;
  params?: Record<string, string | number>;
}

const IDENTITY: Record<IdentityRole, IdentityZoneKind> = { lastname: 'NAME', firstname: 'FIRSTNAME', stdid: 'INE' };

/** Problems that prevent (errors) or should be checked before (warnings) creating the exam. */
export function checkLayout(layout: GeneratedLayout): LayoutIssue[] {
  const issues: LayoutIssue[] = [];
  if (layout.questions.length === 0) {
    issues.push({ level: 'error', key: 'noQuestion' });
  }
  for (const role of Object.keys(IDENTITY) as IdentityRole[]) {
    if (layout.identity[role] === undefined) {
      issues.push({ level: 'warning', key: 'noIdentityZone', params: { role } });
    }
  }
  for (const q of layout.questions) {
    // points are stored in quarters (`Question.quarterpoint`)
    if (!(q.points > 0) || !Number.isInteger(q.points * 4)) {
      issues.push({ level: 'error', key: 'badPoints', params: { question: q.key, points: q.points } });
    }
    if (q.kind === 'qcm' && !q.validExpression) {
      issues.push({ level: 'error', key: 'qcmWithoutAnswer', params: { question: q.key } });
    }
    if (q.kind === 'numeric' || q.kind === 'short') {
      issues.push({ level: 'warning', key: 'gradedByHand', params: { question: q.key, kind: q.kind } });
    }
  }
  return issues;
}

function gradeTypeOf(q: GeneratedQuestion, defaults: QuestionDefaults): GradeType {
  const grade = typeof q.meta.grade === 'string' ? q.meta.grade.toUpperCase() : '';
  return (Object.values(GradeType) as string[]).includes(grade) ? (grade as GradeType) : defaults.gradeType;
}

/**
 * Zones and questions of the exam. A question with several zones gives several `Question` with the same number,
 * as when the zones are drawn by hand. Numeric and short answers are corrected by hand until their own types
 * exist (T25d).
 */
export function planExam(layout: GeneratedLayout, defaults: QuestionDefaults): ExamPlan {
  const identity: PlannedIdentityZone[] = (Object.keys(IDENTITY) as IdentityRole[])
    .filter(role => layout.identity[role] !== undefined)
    .map(role => ({ kind: IDENTITY[role], zone: layout.identity[role]! }));

  const questions: PlannedQuestion[] = layout.questions.flatMap(q =>
    q.parts.map(part => ({
      zone: part.zone,
      type: q.kind === 'qcm' ? ('QCM' as const) : ('manual' as const),
      question: {
        numero: q.number,
        point: q.points,
        step: defaults.step,
        gradeType: q.kind === 'qcm' ? defaults.gradeType : gradeTypeOf(q, defaults),
        validExpression: q.kind === 'qcm' ? q.validExpression : undefined,
        libelle: q.key,
        canBeNegative: false,
        canExceedTheMax: false,
        mustBeIgnoreInGlobalScale: false,
      },
    })),
  );
  return { caseBoxName: layout.identityStyle === 'cells', identity, questions };
}

/** Base64 of a PDF, for `Template.content`. Chunked: a whole document does not fit in one call's arguments. */
export function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
