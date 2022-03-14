import { IExam } from 'app/entities/exam/exam.model';
import { ICourseGroup } from 'app/entities/course-group/course-group.model';
import { IUser } from 'app/entities/user/user.model';

export interface ICourse {
  id?: number;
  name?: string;
  exams?: IExam[] | null;
  groups?: ICourseGroup[] | null;
  prof?: IUser;
  profId?: number,
  profLogin?: string
}

export class Course implements ICourse {
  constructor(
    public id?: number,
    public name?: string,
    public exams?: IExam[] | null,
    public groups?: ICourseGroup[] | null,
    public prof?: IUser,
    public profId?: number,
    public profLogin?: string
    ) {}
}

export function getCourseIdentifier(course: ICourse): number | undefined {
  return course.id;
}
