import { IStudent } from 'app/entities/student/student.model';
import { ICourse } from 'app/entities/course/course.model';

export interface ICourseGroup {
  id?: number;
  groupName?: string;
  students?: IStudent[] | null;
  course?: ICourse | null;
}

export class CourseGroup implements ICourseGroup {
  constructor(public id?: number, public groupName?: string, public students?: IStudent[] | null, public course?: ICourse | null) {}
}

export function getCourseGroupIdentifier(courseGroup: ICourseGroup): number | undefined {
  return courseGroup.id;
}
