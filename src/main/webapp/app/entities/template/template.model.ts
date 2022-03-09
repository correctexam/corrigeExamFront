import { IExam } from 'app/entities/exam/exam.model';

export interface ITemplate {
  id?: number;
  name?: string;
  contentContentType?: string | null;
  content?: string | null;
  exam?: IExam | null;
}

export class Template implements ITemplate {
  constructor(
    public id?: number,
    public name?: string,
    public contentContentType?: string | null,
    public content?: string | null,
    public exam?: IExam | null
  ) {}
}

export function getTemplateIdentifier(template: ITemplate): number | undefined {
  return template.id;
}
