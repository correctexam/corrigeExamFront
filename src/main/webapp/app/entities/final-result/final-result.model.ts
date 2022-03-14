
export interface IFinalResult {
  id?: number;
  note?: number;
  studentName?: string;
  studentId?: number;
  examName?: string;
  examId?: number;
}

export class FinalResult implements IFinalResult {
  constructor(
    public id?: number,
    public note?: number,
    public studentName?: string,
    public studentId?: number,
    public examName?: string,
    public examId?: number
  ) {}
}


export function getFinalResultIdentifier(finalResult: IFinalResult): number | undefined {
  return finalResult.id;
}
