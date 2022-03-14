import { IExam } from 'app/entities/exam/exam.model';
import { ICourseGroup } from 'app/entities/course-group/course-group.model';
export interface ICourse {
  id?: number;
  name?: string;
  exams?: IExam[];
  groups?: ICourseGroup[];
  profLogin?: string;
  profId?: number;
}

export class Course implements ICourse {
  constructor(
    public id?: number,
    public name?: string,
    public exams?: IExam[],
    public groups?: ICourseGroup[],
    public profLogin?: string,
    public profId?: number
  ) {}
}

export function getCourseIdentifier(course: ICourse): number | undefined {
  return course.id;
}
