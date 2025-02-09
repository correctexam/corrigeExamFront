/* eslint-disable object-shorthand */
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
  private exams!: Table<Exam, number>;
  private templates!: Table<Template, number>;
  private alignImages!: Table<AlignImage, number>;
  private nonAlignImages!: Table<NonAlignImage, number>;

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

  async resetDatabase() {
    await db.transaction('rw', 'exams', 'templates', 'alignImages', 'nonAlignImages', () => {
      this.exams.clear();
      this.templates.clear();
      this.alignImages.clear();
      this.nonAlignImages.clear();

      //      this.populate();
    });
  }

  async removeElementForExam(examId: number) {
    await db.transaction('rw', 'exams', 'templates', 'alignImages', 'nonAlignImages', () => {
      db.exams.delete(examId);

      db.templates
        .where('examId')
        .equals(examId)
        .toArray()

        .then(templates => this.templates.bulkDelete(templates.map(t => t.id!)));

      db.alignImages
        .where('examId')
        .equals(examId)
        .toArray()

        .then(a => this.alignImages.bulkDelete(a.map(t => t.id!)));

      db.nonAlignImages
        .where('examId')
        .equals(examId)
        .toArray()

        .then(a => this.nonAlignImages.bulkDelete(a.map(t => t.id!)));
      //      this.populate();
    });
  }

  async removeExam(examId: number) {
    await db.transaction('rw', 'exams', () => {
      this.exams.delete(examId);
    });
  }

  async countPageTemplate(examId: number) {
    return await this.templates.where('examId').equals(examId).count();
  }

  async countAlignImage(examId: number) {
    return await this.alignImages.where('examId').equals(examId).count();
  }

  async countNonAlignImage(examId: number) {
    return await this.nonAlignImages.where('examId').equals(examId).count();
  }

  async getFirstNonAlignImage(examId: number, pageInscan: number) {
    return await this.nonAlignImages.where({ examId: examId, pageNumber: pageInscan }).first();
  }
  async getFirstAlignImage(examId: number, pageInscan: number) {
    return await this.alignImages.where({ examId: examId, pageNumber: pageInscan }).first();
  }
  async getFirstTemplate(examId: number, pageInscan: number) {
    return await this.templates.where({ examId: examId, pageNumber: pageInscan }).first();
  }
  async getAllTemplate(examId: number) {
    return await this.templates.where({ examId: examId }).sortBy('pageNumber');
  }

  async getNonAlignImageBetweenAndSortByPageNumber(examId: number, p1: number, p2: number) {
    return await this.nonAlignImages
      .where({ examId: examId })
      .filter(e2 => e2.pageNumber <= p1 && e2.pageNumber < p2)
      .sortBy('pageNumber');
  }

  async getAlignImageBetweenAndSortByPageNumber(examId: number, p1: number, p2: number) {
    return await this.alignImages
      .where({ examId: examId })
      .filter(e2 => e2.pageNumber <= p1 && e2.pageNumber < p2)
      .sortBy('pageNumber');
  }

  async getNonAlignSortByPageNumber(examId: number) {
    return await this.nonAlignImages.where({ examId: examId }).sortBy('pageNumber');
  }

  async getAlignSortByPageNumber(examId: number) {
    return await this.alignImages.where({ examId: examId }).sortBy('pageNumber');
  }
  async addAligneImage(elt: AlignImage) {
    await db.alignImages.put(elt);
  }

  async addNonAligneImage(elt: AlignImage) {
    await db.nonAlignImages.put(elt);
  }

  async countNonAlignWithPageNumber(examId: number, pageInscan: number) {
    return await this.nonAlignImages.where({ examId: examId, pageNumber: pageInscan }).count();
  }

  async countAlignWithPageNumber(examId: number, pageInscan: number) {
    return await this.alignImages.where({ examId: examId, pageNumber: pageInscan }).count();
  }
}

export const db = new AppDB();
