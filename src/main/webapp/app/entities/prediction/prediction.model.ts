import { IStudentResponse } from 'app/entities/student-response/student-response.model';

export interface IPrediction {
  id?: number;
  text?: string | null;
  zonegeneratedid?: string | null;
  questionId?: number;
  studentResponses?: IStudentResponse[];
  shortcut?: string | string[];
  jsonData?: string | null;
  questionNumber?: number | null;
  examId?: string | null;
  studentId?: number | null;
}

export class Prediction implements IPrediction {
  constructor(
    public id?: number,
    public text?: string | null,
    public zonegeneratedid?: string | null,
    public questionId?: number,
    public studentResponses?: IStudentResponse[],
    public shortcut?: string | string[],
    public jsonData?: string | null,
    public questionNumber?: number | null, // Add questionNumber to Prediction class
    public examId?: string | null,
    public studentId?: number | null,
  ) {}
}

export function getPredictionIdentifier(prediction: IPrediction): number | undefined {
  return prediction.id;
}
