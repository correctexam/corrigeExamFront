import { Injectable } from '@angular/core';
import { StudentResponseService } from 'app/entities/student-response/service/student-response.service';
import { firstValueFrom } from 'rxjs';
import { ExamSheetService } from '../../entities/exam-sheet/service/exam-sheet.service';
import { IExamSheet } from 'app/entities/exam-sheet/exam-sheet.model';
import { QuestionService } from 'app/entities/question/service/question.service';
import { ZoneService } from '../../entities/zone/service/zone.service';
import { PreferenceService } from '../preference-page/preference.service';
import { AlignImagesService } from '../services/align-images.service';
import { PredictionService } from 'app/entities/prediction/service/prediction.service';
import { CoupageDimageService } from './coupage-dimage.service';
import { MLTService } from './mlt.service';
import { IPrediction } from 'app/entities/prediction/prediction.model';

interface ExamPageImage {
  imageData: ImageData;
  width: number;
  height: number;
  questionId?: number;
  sheetId: number;
  questionNumero: number;
  prediction?: string | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class PredictionStudentResponseService {
  constructor(
    private examSheetService: ExamSheetService,
    private questionService: QuestionService,
    private zoneService: ZoneService,
    private studentResponseService: StudentResponseService,
    private preferenceService: PreferenceService,
    private alignImagesService: AlignImagesService,
    private predictionService: PredictionService,
    private coupageDimageService: CoupageDimageService,
    private mlt: MLTService,
  ) {}

  async predictStudentResponsesFromQuestionIds(examId: number, questionId: number): Promise<void> {
    const _srs = await firstValueFrom(this.examSheetService.query({ examId }));
    const srs: IExamSheet[] = _srs.body || [];
    const _q = await firstValueFrom(this.questionService.find(questionId));
    // Query predictions for this question
    const _predictionResponse = await firstValueFrom(this.predictionService.query({ questionId }));
    const predictionResponse = _predictionResponse.body || [];
    const predictionResponseId = predictionResponse.map(e => e.id);

    const q = _q.body || undefined;

    if (q !== undefined) {
      const _qs = await firstValueFrom(this.questionService.query({ numero: q.numero, examId }));
      const qs = _qs.body || undefined;
      const srsfilter = srs.filter(sr => !predictionResponseId.includes(sr.id));
      for (const sr of srsfilter) {
        for (const q1 of qs!) {
          const pageForStudent = sr.pagemin! + q1.zoneDTO!.pageNumber!;
          const imageToCrop = {
            examId,
            factor: 1,
            align: true,
            template: false,
            indexDb: this.preferenceService.getPreference().cacheDb !== 'sqlite',
            page: pageForStudent,
            z: q1.zoneDTO!,
          };

          try {
            const crop = await firstValueFrom(this.alignImagesService.imageCropFromZone(imageToCrop));
            const imageData = new ImageData(new Uint8ClampedArray(crop.image), crop.width, crop.height);
            // Add image to list
            const newImage: ExamPageImage = {
              imageData,
              width: crop.width,
              height: crop.height,
              questionId: q1.id,
              sheetId: sr.id!,
              questionNumero: q1.numero!,
            };
            await this.handlePrediction(newImage);
          } catch (error: any) {
            console.error('Error cropping image:', error);
          }
        }
      }
    }
  }

  private async handlePrediction(image: ExamPageImage): Promise<void> {
    try {
      // First use CoupageDimageService
      const coupageResponse = await firstValueFrom(this.coupageDimageService.runScript(image.imageData));
      let prediction = '';

      // Process each refined line
      if (coupageResponse.linesbase64) {
        for (const { index, value } of coupageResponse.linesbase64.map((value1: any, index1: number) => ({
          index: index1,
          value: value1,
        }))) {
          // const base64Line = `data:image/png;base64,${refinedLine}`;
          const imgData = new ImageData(new Uint8ClampedArray(value), coupageResponse.widths[index], coupageResponse.heights[index]);
          const lineResult = await this.mlt.executeMLTFromImagData(imgData, coupageResponse.widths[index], coupageResponse.heights[index]);

          if (lineResult) {
            prediction += lineResult + '\n';
          }
        }
        // Clear refined lines after processing
        coupageResponse.linesbase64 = [];
      }
      console.error('prediction:', prediction);
      // Store and set prediction if we got any results
      if (prediction) {
        const predictionData: IPrediction = {
          sheetId: image.sheetId,
          questionId: image.questionId,
          text: prediction.trim(),
          questionNumber: image.questionNumero,
        };

        await firstValueFrom(this.predictionService.create(predictionData));
        image.prediction = prediction.trim();
      } else {
        image.prediction = 'No prediction available';
      }

      // Clear large data after processing
      if (image.imageData) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        image.imageData = null;
      }
    } catch (error) {
      console.error('Error handling prediction:', error);
      image.prediction = 'No prediction available';
    }
  }
}
