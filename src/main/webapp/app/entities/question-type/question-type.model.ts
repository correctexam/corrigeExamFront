export interface IQuestionType {
  id?: number;
  algoName?: string;
  endpoint?: string | null;
  jsFunction?: string | null;
}

export class QuestionType implements IQuestionType {
  constructor(public id?: number, public algoName?: string, public endpoint?: string | null, public jsFunction?: string | null) {}
}

export function getQuestionTypeIdentifier(questionType: IQuestionType): number | undefined {
  return questionType.id;
}
