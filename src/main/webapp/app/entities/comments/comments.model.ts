export interface IComments {
  id?: number;
  jsonData?: string;
  studentResponseId?: number;
}

export class Comments implements IComments {
  constructor(public id?: number, public jsonData?: string, public studentResponseId?: number) {}
}

export function getCommentsIdentifier(comments: IComments): number | undefined {
  return comments.id;
}
