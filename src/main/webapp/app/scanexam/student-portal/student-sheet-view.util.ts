import { IQuestion } from 'app/entities/question/question.model';
import { IStudentResponse } from 'app/entities/student-response/student-response.model';

/** Page of the cache: JSON whose `pages` is the data URL of the image (Maps are serialised as {dataType, value}). */
export interface ICachedPage {
  pages: string;
}

export function parseCachedPage(body: string): ICachedPage {
  return JSON.parse(body, (_key, value: unknown) => {
    if (typeof value === 'object' && value !== null && (value as { dataType?: unknown }).dataType === 'Map') {
      return new Map((value as { value: [unknown, unknown][] }).value);
    }
    return value;
  }) as ICachedPage;
}

/** Numbers of the questions of the exam, sorted, without duplicates (a question can have several zones). */
export function questionNumerosOf(questions: IQuestion[]): number[] {
  return Array.from(new Set(questions.map(q => q.numero).filter((n): n is number => n !== undefined && n !== null))).sort((a, b) => a - b);
}

/** Answer of the sheet to one of these questions (the questions of one number share the answer). */
export function responseOf(responses: IStudentResponse[], questions: IQuestion[]): IStudentResponse | undefined {
  const ids = new Set(questions.map(q => q.id));
  return responses.find(r => r.questionId !== undefined && ids.has(r.questionId));
}
