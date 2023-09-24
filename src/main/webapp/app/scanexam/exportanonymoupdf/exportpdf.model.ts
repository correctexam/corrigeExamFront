export interface ExportPDFDto {
  firstnamezonepdf?: Zonepdf;
  ID?: number;
  name?: string;
  namezonepdf?: Zonepdf;
  scanfileID?: number;
  sheetspdf?: Sheetspdf[];
  questionspdf?: Questionspdf[];
}

export interface Zonepdf {
  height?: number;
  ID?: number;
  pageNumber?: number;
  width?: number;
  XInit?: number;
  YInit?: number;
}

export interface Questionspdf {
  gradeType?: string;
  ID?: number;
  numero?: number;
  point?: number;
  step?: number;
  typeAlgoName?: string;
  typeID?: number;
  zonepdf?: Zonepdf;
}

export interface Sheetspdf {
  ID?: number;
  name?: string;
  finalresult?: number;
  pagemax?: number;
  pagemin?: number;
  studentpdf?: Studentpdf[];
  studentResponsepdf?: StudentResponsepdf[];
}

export interface StudentResponsepdf {
  gradedcommentspdf?: Gradedcommentspdf[];
  ID?: number;
  note?: number;
  questionID?: number;
  questionNumero?: string;
  star?: boolean;
  textcommentspdf?: Textcommentspdf[];
  worststar?: boolean;
}

export interface Gradedcommentspdf {
  description?: string;
  grade?: number;
  text?: string;
  zonegeneratedid?: string;
}

export interface Textcommentspdf {
  description?: string;
  text?: string;
}

export interface Studentpdf {
  firstname?: string;
  ID?: number;
  ine?: string;
  mail?: string;
  name?: string;
}
