import { IComments } from 'app/entities/comments/comments.model';
import { IQuestion } from 'app/entities/question/question.model';
import { IStudent } from 'app/entities/student/student.model';

export interface IStudentResponse {
  id?: number;
  note?: number | null;
  comments?: IComments[] | null;
  question?: IQuestion | null;
  student?: IStudent | null;
}

export class StudentResponse implements IStudentResponse {
  constructor(
    public id?: number,
    public note?: number | null,
    public comments?: IComments[] | null,
    public question?: IQuestion | null,
    public student?: IStudent | null
  ) {}
}

export function getStudentResponseIdentifier(studentResponse: IStudentResponse): number | undefined {
  return studentResponse.id;
}
