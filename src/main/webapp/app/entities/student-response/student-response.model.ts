import { IComments } from 'app/entities/comments/comments.model';

export interface IStudentResponse {
  id?: number;
  note?: number;
  comments?: IComments[];
  questionNumero?: string;
  questionId?: number;
  studentName?: string;
  studentId?: number;
}

export class StudentResponse implements IStudentResponse {
  constructor(
    public id?: number,
    public note?: number,
    public comments?: IComments[],
    public questionNumero?: string,
    public questionId?: number,
    public studentName?: string,
    public studentId?: number
  ) {}
}


export function getStudentResponseIdentifier(studentResponse: IStudentResponse): number | undefined {
  return studentResponse.id;
}
