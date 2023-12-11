import { IHybridGradedComment, NewHybridGradedComment } from './hybrid-graded-comment.model';

export const sampleWithRequiredData: IHybridGradedComment = {
  id: 96736,
};

export const sampleWithPartialData: IHybridGradedComment = {
  id: 78948,
  description: '../fake-data/blob/hipster.txt',
  grade: 97559,
};

export const sampleWithFullData: IHybridGradedComment = {
  id: 57208,
  text: 'calculating interface Picardie',
  description: '../fake-data/blob/hipster.txt',
  grade: 83565,
  relative: true,
  step: 62428,
};

export const sampleWithNewData: NewHybridGradedComment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
