import { IExam } from 'app/entities/exam/exam.model';
import { ICourseGroup } from 'app/entities/course-group/course-group.model';
import { IUser } from '../user/user.model';
export interface ICourse {
  id?: number;
  name?: string;
  archived?: boolean;
  exams?: IExam[];
  groups?: ICourseGroup[];
  profs?: IUser[];
}

export class Course implements ICourse {
  constructor(
    public id?: number,
    public name?: string,
    public archived?: boolean,
    public exams?: IExam[],
    public groups?: ICourseGroup[],
    public profs?: IUser[],
  ) {
    this.archived = this.archived ?? false;
  }
}

export function getCourseIdentifier(course: ICourse): number | undefined {
  return course.id;
}
