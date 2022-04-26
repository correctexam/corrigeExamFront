import { IComments } from 'app/entities/comments/comments.model';
import { ITextComment } from 'app/entities/text-comment/text-comment.model';
import { IGradedComment } from 'app/entities/graded-comment/graded-comment.model';

export interface IStudentResponse {
  id?: number;
  note?: number;
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
    public comments?: IComments[],
    public questionNumero?: string,
    public questionId?: number,
    public sheetName?: string,
    public sheetId?: number,
    public textcomments?: ITextComment[] | null,
    public gradedcomments?: IGradedComment[] | null
  ) {}
}

export function getStudentResponseIdentifier(studentResponse: IStudentResponse): number | undefined {
  return studentResponse.id;
}
