
export interface IQuestion {
  id?: number;
  numero?: number;
  point?: number;
  zoneId?: number;
  typeAlgoName?: string;
  typeId?: number;
  examName?: string;
  examId?: number;
}

export class Question implements IQuestion {
  constructor(
    public id?: number,
    public numero?: number,
    public point?: number,
    public zoneId?: number,
    public typeAlgoName?: string,
    public typeId?: number,
    public examName?: string,
    public examId?: number
  ) {}
}
export function getQuestionIdentifier(question: IQuestion): number | undefined {
  return question.id;
}
