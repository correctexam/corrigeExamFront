import { IExamSheet } from 'app/entities/exam-sheet/exam-sheet.model';
import { ICourseGroup } from 'app/entities/course-group/course-group.model';

export interface IStudent {
  id?: number;
  name?: string;
  firstname?: string;
  ine?: string;
  caslogin?: string | null;
  mail?: string | null;
  examSheets?: IExamSheet[] | null;
  groups?: ICourseGroup[] | null;
}

export class Student implements IStudent {
  constructor(
    public id?: number,
    public name?: string,
    public firstname?: string,
    public ine?: string,
    public caslogin?: string | null,
    public mail?: string | null,
    public examSheets?: IExamSheet[] | null,
    public groups?: ICourseGroup[] | null,
  ) {}
}

export function getStudentIdentifier(student: IStudent): number | undefined {
  return student.id;
}
