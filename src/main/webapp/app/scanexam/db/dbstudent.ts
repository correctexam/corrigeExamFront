/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Dexie, { Table } from 'dexie';

export interface Exam {
  id?: number;
}

export interface Template {
  id?: number;
  examId: number;
  pageNumber: number;
  value: string;
}

export interface AlignImage {
  id?: number;
  examId: number;
  pageNumber: number;
  value: string;
}

export interface NonAlignImage {
  id?: number;
  examId: number;
  pageNumber: number;
  value: string;
}

export class AppDB extends Dexie {
  exams!: Table<Exam, number>;
  templates!: Table<Template, number>;
  alignImages!: Table<AlignImage, number>;
  nonAlignImages!: Table<NonAlignImage, number>;

  constructor() {
    super('correctExamStudent');
    this.version(3).stores({
      exams: '++id',
      templates: '++id, examId, [examId+pageNumber]',
      alignImages: '++id, examId,[examId+pageNumber]',
      nonAlignImages: '++id, examId,[examId+pageNumber]',
    });
    //    this.on('populate', () => this.populate());
  }

  /* async populate() {
  } */

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async resetDatabase() {
    await db.transaction('rw', 'exams', 'templates', 'alignImages', 'nonAlignImages', () => {
      this.exams.clear();
      this.templates.clear();
      this.alignImages.clear();
      this.nonAlignImages.clear();

      //      this.populate();
    });
  }
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async removeElementForExam(examId: number) {
    await db.transaction('rw', 'templates', 'alignImages', 'nonAlignImages', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      db.templates
        .where('examId')
        .equals(examId)
        .toArray()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .then(templates => this.templates.bulkDelete(templates.map(t => t.id!)));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      db.alignImages
        .where('examId')
        .equals(examId)
        .toArray()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .then(a => this.alignImages.bulkDelete(a.map(t => t.id!)));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      db.nonAlignImages
        .where('examId')
        .equals(examId)
        .toArray()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .then(a => this.nonAlignImages.bulkDelete(a.map(t => t.id!)));
      //      this.populate();
    });
  }

  async removeExam(examId: number) {
    await db.transaction('rw', 'exams', () => {
      this.exams.delete(examId);
    });
  }
}

export const db = new AppDB();
