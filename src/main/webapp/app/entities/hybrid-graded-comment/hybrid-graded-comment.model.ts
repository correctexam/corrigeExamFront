export interface IHybridGradedComment {
  id: number;
  text?: string | null;
  description?: string | null;
  grade?: number | null;
  relative?: boolean | null;
  step?: number | null;
  questionId?: number | null;
  shortcut?: string | string[];
}

export type NewHybridGradedComment = Omit<IHybridGradedComment, 'id'> & { id: null };
