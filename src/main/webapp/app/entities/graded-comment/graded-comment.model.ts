import { IStudentResponse } from 'app/entities/student-response/student-response.model';

export interface IGradedComment {
  id?: number;
  zonegeneratedid?: string | null;
  text?: string | null;
  description?: string | null;
  grade?: number | null;
  questionId?: number;
  studentResponses?: IStudentResponse[];
}

export class GradedComment implements IGradedComment {
  constructor(
    public id?: number,
    public zonegeneratedid?: string | null,
    public text?: string | null,
    public description?: string | null,
    public grade?: number | null,
    public questionId?: number,
    public studentResponses?: IStudentResponse[]
  ) {}
}

export function getGradedCommentIdentifier(gradedComment: IGradedComment): number | undefined {
  return gradedComment.id;
}
