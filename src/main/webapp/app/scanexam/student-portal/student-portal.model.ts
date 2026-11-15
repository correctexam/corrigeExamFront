import { IQuestion } from 'app/entities/question/question.model';
import { IStudentResponse } from 'app/entities/student-response/student-response.model';
import { StudentAccess } from 'app/entities/enumerations/student-access.model';

/** One exam sheet as shown to its student (StudentSheetViewDTO, ADR 0003 of corrigeExamBack). */
export interface IStudentSheetView {
  /** UUID of the /copie/{uuid} link; null in the student portal. */
  uuid: string | null;
  /** Number of pages of the sheet (pages are numbered from 1). */
  pages: number;
  /** Index of the sheet in the scan (0-based). */
  sheetIndex: number;
  exam: { id: number; name: string; courseId?: number | null; courseName?: string | null };
  students: { name: string; firstname?: string | null }[];
  /** False: scanned sheet only (exam published as SHEET). */
  corrections: boolean;
  finalNote?: number | null;
  questions: IQuestion[];
  responses: IStudentResponse[];
  /** Hybrid comments applied to each answer, by answer id. */
  hybridComments: Record<string, IHybridCommentApplied[]>;
  /** SVG annotations of the graders, by zone: `{numero}_{index of the zone in the question}`. */
  annotations: Record<string, string>;
  contactEmails: string[];
}

export interface IHybridCommentApplied {
  id: number;
  text?: string | null;
  description?: string | null;
  grade?: number | null;
  relative?: boolean | null;
  step?: number | null;
  stepValue: number;
}

export interface IStudentSheetSummary {
  sheetId: number;
  examId: number;
  examName: string;
  courseId?: number | null;
  courseName?: string | null;
  access: StudentAccess;
  finalNote?: number | null;
}

export interface IStudentRecord {
  name?: string | null;
  firstname?: string | null;
  ine?: string | null;
  mail?: string | null;
  caslogin?: string | null;
  courses: string[];
  groups: string[];
}

export interface IStudentPersonalData {
  email: string;
  records: IStudentRecord[];
  sheets: IStudentSheetSummary[];
}

export interface IStudentSession {
  idToken: string;
  /** ISO date (or epoch seconds when the server writes dates as timestamps). */
  expiresAt: string | number;
  email: string;
}

/** ALTCHA challenge (protocol v1). */
export interface IAltchaChallenge {
  algorithm: string;
  challenge: string;
  maxnumber: number;
  salt: string;
  signature: string;
}
