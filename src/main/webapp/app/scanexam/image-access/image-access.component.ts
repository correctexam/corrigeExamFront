import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlignImagesService } from '../services/align-images.service';
import { firstValueFrom } from 'rxjs';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { QuestionService } from '../../entities/question/service/question.service';
import { IQuestion } from '../../entities/question/question.model';
import { IZone } from 'app/entities/zone/zone.model';
import { NgIf, NgFor } from '@angular/common';

interface ExamPageImage {
  pageNumber: number;
  imageData: ImageData;
  width: number;
  height: number;
  questionId?: number;
  studentIndex: number; // Added this as a required field
}

@Component({
  selector: 'app-image-access',
  templateUrl: './image-access.component.html',
  standalone: true,
  imports: [NgIf, NgFor],
})
export class ImageAccessComponent implements OnInit {
  @ViewChildren('imageCanvas') canvases!: QueryList<ElementRef<HTMLCanvasElement>>;

  loading = true;
  error: string | null = null;
  examId: string | null = null;
  imageList: ExamPageImage[] = [];
  manuscriptQuestions: IQuestion[] = [];
  nbreFeuilleParCopie = 0;
  numberPagesInScan = 0;

  constructor(
    private route: ActivatedRoute,
    private alignImagesService: AlignImagesService,
    private db: CacheServiceImpl,
    private questionService: QuestionService,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      this.examId = params['examid'];
      if (this.examId) {
        await this.loadManuscriptQuestions();
        await this.loadImages();
      }
    });
  }

  async loadManuscriptQuestions() {
    try {
      // Get all questions for this exam
      const response = await firstValueFrom(this.questionService.query({ examId: +this.examId! }));

      // Filter only manuscript questions
      this.manuscriptQuestions = response.body?.filter(q => q.typeAlgoName === 'manuscrit') || [];

      console.log('Found manuscript questions:', this.manuscriptQuestions);
    } catch (error) {
      console.error('Error loading manuscript questions:', error);
      this.error = 'Failed to load questions';
    }
  }

  async loadImages() {
    try {
      this.loading = true;
      this.error = null;

      if (!this.examId || this.manuscriptQuestions.length === 0) {
        throw new Error('No exam ID or no manuscript questions found');
      }

      // Get page counts
      this.nbreFeuilleParCopie = await this.db.countPageTemplate(+this.examId);
      this.numberPagesInScan = await this.db.countAlignImage(+this.examId);

      this.imageList = [];

      // Calculate total number of students
      const totalStudents = Math.floor(this.numberPagesInScan / this.nbreFeuilleParCopie);

      // Process each manuscript question for each student
      for (let studentIndex = 0; studentIndex < totalStudents; studentIndex++) {
        for (const question of this.manuscriptQuestions) {
          const zone = question.zoneDTO as IZone;
          if (!zone) continue;

          // Calculate actual page number for this student
          const pageForStudent = studentIndex * this.nbreFeuilleParCopie + zone.pageNumber!;

          // Get image for this question's zone
          const imageToCrop = {
            examId: +this.examId,
            factor: 1,
            align: true,
            template: false,
            indexDb: true,
            page: pageForStudent,
            z: zone,
          };

          try {
            const crop = await firstValueFrom(this.alignImagesService.imageCropFromZone(imageToCrop));

            // Create a canvas and draw the image
            const canvas = document.createElement('canvas');
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext('2d');

            if (ctx) {
              const imageData = new ImageData(new Uint8ClampedArray(crop.image), crop.width, crop.height);

              this.imageList.push({
                pageNumber: pageForStudent,
                imageData: imageData,
                width: crop.width,
                height: crop.height,
                questionId: question.id,
                studentIndex: studentIndex + 1, // Adding student index for display
              });
            }
          } catch (error) {
            console.error(`Error processing question ${question.id} for student ${studentIndex + 1}:`, error);
          }
        }
      }

      // Sort images by student and question
      this.imageList.sort((a, b) => {
        if (a.studentIndex === b.studentIndex) {
          return (a.questionId || 0) - (b.questionId || 0);
        }
        return a.pageNumber - b.pageNumber;
      });

      this.loading = false;
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Failed to load images';
      this.loading = false;
    }
  }

  private reviver(key: any, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  ngAfterViewInit() {
    this.canvases.changes.subscribe(() => {
      this.renderImages();
    });
  }

  private renderImages() {
    this.canvases.forEach((canvasRef, index) => {
      const imageInfo = this.imageList[index];
      if (imageInfo) {
        const canvas = canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');

        canvas.width = imageInfo.width;
        canvas.height = imageInfo.height;
        ctx?.putImageData(imageInfo.imageData, 0, 0);
      }
    });
  }

  getUniqueStudents(): number[] {
    return [...new Set(this.imageList.map(img => img.studentIndex))].sort((a, b) => a - b);
  }

  getImagesForStudent(studentIndex: number): ExamPageImage[] {
    return this.imageList.filter(img => img.studentIndex === studentIndex);
  }
}
