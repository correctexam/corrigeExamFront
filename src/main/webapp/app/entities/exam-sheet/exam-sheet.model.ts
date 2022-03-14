import { IStudent } from 'app/entities/student/student.model';

export interface IExamSheet {
  id?: number;
  name?: string;
  pagemin?: number;
  pagemax?: number;
  scanName?: string;
  scanId?: number;
  students?: IStudent[];
}

export class ExamSheet implements IExamSheet {
  constructor(
    public id?: number,
    public name?: string,
    public pagemin?: number,
    public pagemax?: number,
    public scanName?: string,
    public scanId?: number,
    public students?: IStudent[]
  ) {}
}


export function getExamSheetIdentifier(examSheet: IExamSheet): number | undefined {
  return examSheet.id;
}
