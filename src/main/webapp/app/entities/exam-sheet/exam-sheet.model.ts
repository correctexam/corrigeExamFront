import { IScan } from 'app/entities/scan/scan.model';
import { IStudent } from 'app/entities/student/student.model';

export interface IExamSheet {
  id?: number;
  name?: string;
  pagemin?: number | null;
  pagemax?: number | null;
  scan?: IScan | null;
  students?: IStudent[] | null;
}

export class ExamSheet implements IExamSheet {
  constructor(
    public id?: number,
    public name?: string,
    public pagemin?: number | null,
    public pagemax?: number | null,
    public scan?: IScan | null,
    public students?: IStudent[] | null
  ) {}
}

export function getExamSheetIdentifier(examSheet: IExamSheet): number | undefined {
  return examSheet.id;
}
