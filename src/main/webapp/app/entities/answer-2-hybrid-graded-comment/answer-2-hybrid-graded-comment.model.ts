export interface IAnswer2HybridGradedComment {
  id: number;
  stepValue?: number | null;
  hybridcommentsId?: number | null;
  hybridcommentsText?: string | null;
  studentResponseId?: number | null;
  studentResponseText?: string | null;
}

export type NewAnswer2HybridGradedComment = Omit<IAnswer2HybridGradedComment, 'id'> & { id: null };
