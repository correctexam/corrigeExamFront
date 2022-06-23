import { IExam } from 'app/entities/exam/exam.model';
import { ICourseGroup } from 'app/entities/course-group/course-group.model';
import { IUser } from '../user/user.model';
export interface ICourse {
  id?: number;
  name?: string;
  exams?: IExam[];
  groups?: ICourseGroup[];
  profs?: IUser[];
}

export class Course implements ICourse {
  constructor(public id?: number, public name?: string, public exams?: IExam[], public groups?: ICourseGroup[], public profs?: IUser[]) {}
}

export function getCourseIdentifier(course: ICourse): number | undefined {
  return course.id;
}
