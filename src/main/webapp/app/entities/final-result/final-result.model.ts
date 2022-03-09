import { IStudent } from 'app/entities/student/student.model';
import { IExam } from 'app/entities/exam/exam.model';

export interface IFinalResult {
  id?: number;
  note?: number | null;
  student?: IStudent | null;
  exam?: IExam | null;
}

export class FinalResult implements IFinalResult {
  constructor(public id?: number, public note?: number | null, public student?: IStudent | null, public exam?: IExam | null) {}
}

export function getFinalResultIdentifier(finalResult: IFinalResult): number | undefined {
  return finalResult.id;
}
