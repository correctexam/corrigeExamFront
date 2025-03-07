export interface IPrediction {
  id?: number;
  text?: string | null;
  questionId?: number;
  sheetId?: number;
  sheetPageMin?: number;
  sheetPageMax?: number;
  jsonData?: string | null;
  questionNumber?: number | null;
  predictionconfidence?: number | null;
  imageData?: string | null;
}

export class Prediction implements IPrediction {
  constructor(
    public id?: number,
    public text?: string | null,
    public questionId?: number,
    public sheetId?: number,
    public jsonData?: string | null,
    public questionNumber?: number | null, // Add questionNumber to Prediction class
    public imageData?: string | null,
  ) {}
}

export function getPredictionIdentifier(prediction: IPrediction): number | undefined {
  return prediction.id;
}
