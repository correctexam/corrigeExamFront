import { IComments } from 'app/entities/comments/comments.model';
import { ITextComment } from 'app/entities/text-comment/text-comment.model';
import { IGradedComment } from 'app/entities/graded-comment/graded-comment.model';

export interface IStudentResponse {
  id?: number;
  note?: number;
  star?: boolean;
  worststar?: boolean;
  comments?: IComments[];
  questionNumero?: string;
  questionId?: number;
  sheetName?: string;
  sheetId?: number;
  textcomments?: ITextComment[] | null;
  gradedcomments?: IGradedComment[] | null;
}

export class StudentResponse implements IStudentResponse {
  constructor(
    public id?: number,
    public note?: number,
    public star?: boolean,
    public worststar?: boolean,
    public comments?: IComments[],
    public questionNumero?: string,
    public questionId?: number,
    public sheetName?: string,
    public sheetId?: number,
    public textcomments?: ITextComment[] | null,
    public gradedcomments?: IGradedComment[] | null
  ) {
    this.star = this.star ?? false;
    this.worststar = this.worststar ?? false;
  }
}

export function getStudentResponseIdentifier(studentResponse: IStudentResponse): number | undefined {
  return studentResponse.id;
}
