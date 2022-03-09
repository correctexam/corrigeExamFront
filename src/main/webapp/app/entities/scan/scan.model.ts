import { IExamSheet } from 'app/entities/exam-sheet/exam-sheet.model';

export interface IScan {
  id?: number;
  name?: string;
  contentContentType?: string | null;
  content?: string | null;
  sheets?: IExamSheet[] | null;
}

export class Scan implements IScan {
  constructor(
    public id?: number,
    public name?: string,
    public contentContentType?: string | null,
    public content?: string | null,
    public sheets?: IExamSheet[] | null
  ) {}
}

export function getScanIdentifier(scan: IScan): number | undefined {
  return scan.id;
}
