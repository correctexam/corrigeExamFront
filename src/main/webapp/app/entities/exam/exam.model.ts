
import { IQuestion } from 'app/entities/question/question.model';
export interface IExam {
  id?: number;
  name?: string;
  templateName?: string;
  templateId?: number;
  idzoneId?: number;
  namezoneId?: number;
  firstnamezoneId?: number;
  notezoneId?: number;
  scanfileName?: string;
  scanfileId?: number;
  questions?: IQuestion[];
  courseName?: string;
  courseId?: number;
}

export class Exam implements IExam {
  constructor(
    public id?: number,
    public name?: string,
    public templateName?: string,
    public templateId?: number,
    public idzoneId?: number,
    public namezoneId?: number,
    public firstnamezoneId?: number,
    public notezoneId?: number,
    public scanfileName?: string,
    public scanfileId?: number,
    public questions?: IQuestion[],
    public courseName?: string,
    public courseId?: number
  ) {}
}

export function getExamIdentifier(exam: IExam): number | undefined {
  return exam.id;
}
