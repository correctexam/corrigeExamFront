import { IAnswer2HybridGradedComment, NewAnswer2HybridGradedComment } from './answer-2-hybrid-graded-comment.model';

export const sampleWithRequiredData: IAnswer2HybridGradedComment = {
  id: 41514,
};

export const sampleWithPartialData: IAnswer2HybridGradedComment = {
  id: 66339,
  stepValue: 63734,
};

export const sampleWithFullData: IAnswer2HybridGradedComment = {
  id: 70396,
  stepValue: 46287,
};

export const sampleWithNewData: NewAnswer2HybridGradedComment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
