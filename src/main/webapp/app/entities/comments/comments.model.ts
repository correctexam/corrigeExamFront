import { IStudentResponse } from 'app/entities/student-response/student-response.model';

export interface IComments {
  id?: number;
  jsonData?: string | null;
  studentResponse?: IStudentResponse | null;
}

export class Comments implements IComments {
  constructor(public id?: number, public jsonData?: string | null, public studentResponse?: IStudentResponse | null) {}
}

export function getCommentsIdentifier(comments: IComments): number | undefined {
  return comments.id;
}
