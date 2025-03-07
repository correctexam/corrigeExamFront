import { IExam } from 'app/entities/exam/exam.model';

export interface ITemplate {
  id?: number;
  name?: string;
  contentContentType?: string | null;
  content?: string | null;
  mark?: boolean | null;
  caseBoxName?: boolean | null;
  autoMapStudentCopyToList?: boolean | null;
  exam?: IExam | null;
}

export class Template implements ITemplate {
  constructor(
    public id?: number,
    public name?: string,
    public contentContentType?: string | null,
    public content?: string | null,
    public mark?: boolean | null,
    public caseBoxName?: boolean | null,

    public autoMapStudentCopyToList?: boolean | null,
    public exam?: IExam | null,
  ) {
    this.mark = this.mark ?? false;
    this.caseBoxName = this.caseBoxName ?? true;
    this.autoMapStudentCopyToList = this.autoMapStudentCopyToList ?? false;
  }
}

export function getTemplateIdentifier(template: ITemplate): number | undefined {
  return template.id;
}
