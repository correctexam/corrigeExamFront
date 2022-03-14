import { IStudent } from 'app/entities/student/student.model';


export interface ICourseGroup {
  id?: number;
  groupName?: string;
  students?: IStudent[];
  courseName?: string;
  courseId?: number;
}

export class CourseGroup implements ICourseGroup {
  constructor(
    public id?: number,
    public groupName?: string,
    public students?: IStudent[],
    public courseName?: string,
    public courseId?: number
  ) {}
}


export function getCourseGroupIdentifier(courseGroup: ICourseGroup): number | undefined {
  return courseGroup.id;
}
