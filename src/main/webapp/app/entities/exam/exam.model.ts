import { ITemplate } from 'app/entities/template/template.model';
import { IZone } from 'app/entities/zone/zone.model';
import { IScan } from 'app/entities/scan/scan.model';
import { IQuestion } from 'app/entities/question/question.model';
import { ICourse } from 'app/entities/course/course.model';

export interface IExam {
  id?: number;
  name?: string;
  template?: ITemplate | null;
  idzone?: IZone | null;
  namezone?: IZone | null;
  firstnamezone?: IZone | null;
  notezone?: IZone | null;
  scanfile?: IScan | null;
  questions?: IQuestion[] | null;
  course?: ICourse | null;
}

export class Exam implements IExam {
  constructor(
    public id?: number,
    public name?: string,
    public template?: ITemplate | null,
    public idzone?: IZone | null,
    public namezone?: IZone | null,
    public firstnamezone?: IZone | null,
    public notezone?: IZone | null,
    public scanfile?: IScan | null,
    public questions?: IQuestion[] | null,
    public course?: ICourse | null
  ) {}
}

export function getExamIdentifier(exam: IExam): number | undefined {
  return exam.id;
}
