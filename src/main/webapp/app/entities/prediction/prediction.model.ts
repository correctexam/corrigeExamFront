export interface IPrediction {
  id?: number;
  zonegeneratedid?: string | null;
  jsonData?: string;
  questionNumber?: string;
  text?: string; // Add the text property here
}

export class Prediction implements IPrediction {
  constructor(
    public id?: number,
    public zonegeneratedid?: string | null,
    public jsonData?: string,
    public questionNumber?: string,
    public text?: string, // Add the text property in the constructor as well
  ) {}
}

export function getPredictionIdentifier(prediction: IPrediction): number | undefined {
  return prediction.id;
}
