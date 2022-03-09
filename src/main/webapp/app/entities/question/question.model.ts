import { IZone } from 'app/entities/zone/zone.model';
import { IExam } from 'app/entities/exam/exam.model';

export interface IQuestion {
  id?: number;
  numero?: number;
  point?: number | null;
  zone?: IZone | null;
  exam?: IExam | null;
}

export class Question implements IQuestion {
  constructor(
    public id?: number,
    public numero?: number,
    public point?: number | null,
    public zone?: IZone | null,
    public exam?: IExam | null
  ) {}
}

export function getQuestionIdentifier(question: IQuestion): number | undefined {
  return question.id;
}
