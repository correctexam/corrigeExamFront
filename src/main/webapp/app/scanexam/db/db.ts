/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Dexie, { Table } from 'dexie';
import 'dexie-export-import';
import { ExportOptions, ImportOptions } from 'dexie-export-import';

export interface Exam {
  id?: number;
}

export interface Template {
  id?: number;
  examId: number;
  pageNumber: number;
  value: string;
}

export interface ImageDB {
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

export class ExamIndexDB extends Dexie {
  private exams!: Table<Exam, number>;
  private templates!: Table<Template, number>;
  private alignImages!: Table<AlignImage, number>;
  private nonAlignImages!: Table<NonAlignImage, number>;

  constructor(private examId: number) {
    //    super('ngdexieliveQuery');
    super('correctExam' + examId);
    this.version(3).stores({
      exams: '++id',
      templates: '++id, examId, [examId+pageNumber]',
      alignImages: '++id, examId,[examId+pageNumber]',
      nonAlignImages: '++id, examId,[examId+pageNumber]',
    });
    //    this.on('populate', () => this.populate());
  }

  async resetDatabase() {
    await this.transaction('rw', 'exams', 'templates', 'alignImages', 'nonAlignImages', () => {
      this.exams.clear();
      this.templates.clear();
      this.alignImages.clear();
      this.nonAlignImages.clear();

      //      this.populate();
    });
  }

  async removeElementForExam() {
    return this.delete();
  }

  async removePageAlignForExam() {
    await this.transaction('rw', 'exams', 'templates', 'alignImages', 'nonAlignImages', () => {
      this.exams.delete(this.examId);

      this.alignImages
        .where('examId')
        .equals(this.examId)
        .toArray()

        .then(a => this.alignImages.bulkDelete(a.map(t => t.id!)));
    });
  }

  async removeElementForExamForPages(pageStart: number, pageEnd: number) {
    await this.transaction('rw', 'exams', 'templates', 'alignImages', 'nonAlignImages', () => {
      this.alignImages
        .where(['examId', 'pageNumber'])
        .between([this.examId, pageStart], [this.examId, pageEnd], true, true)
        .toArray()

        .then(a => this.alignImages.bulkDelete(a.map(t => t.id!)));

      this.nonAlignImages
        .where(['examId', 'pageNumber'])
        .between([this.examId, pageStart], [this.examId, pageEnd], true, true)
        .toArray()

        .then(a => this.nonAlignImages.bulkDelete(a.map(t => t.id!)));
    });
  }

  async removePageAlignForExamForPage(page: number) {
    await this.transaction('rw', 'exams', 'templates', 'alignImages', 'nonAlignImages', () => {
      this.alignImages.where({ examId: this.examId, pageNumber: page }).delete();
    });
  }

  async removePageNonAlignForExamForPage(page: number) {
    await this.transaction('rw', 'exams', 'templates', 'alignImages', 'nonAlignImages', () => {
      this.nonAlignImages.where({ examId: this.examId, pageNumber: page }).delete();
    });
  }

  async removePageAlignForExamForPages(pageStart: number, pageEnd: number) {
    await this.transaction('rw', 'exams', 'templates', 'alignImages', 'nonAlignImages', () => {
      this.alignImages
        .where(['examId', 'pageNumber'])
        .between([this.examId, pageStart], [this.examId, pageEnd], true, true)
        .toArray()
        .then(a => this.alignImages.bulkDelete(a.map(t => t.id!)));
    });
  }

  async removePageNonAlignForExamForPages(pageStart: number, pageEnd: number) {
    await this.transaction('rw', 'exams', 'templates', 'alignImages', 'nonAlignImages', () => {
      this.nonAlignImages
        .where(['examId', 'pageNumber'])
        .between([this.examId, pageStart], [this.examId, pageEnd], true, true)
        .toArray()
        .then(a => this.nonAlignImages.bulkDelete(a.map(t => t.id!)));
    });
  }

  async removeExam() {
    await this.transaction('rw', 'exams', () => {
      this.exams.delete(this.examId);
    });
  }

  async addAligneImage(elt: AlignImage) {
    await this.alignImages.put(elt);
  }

  async addNonAligneImage(elt: AlignImage) {
    await this.nonAlignImages.put(elt);
  }
  async addNonAligneImages(elts: AlignImage[]) {
    await this.nonAlignImages.bulkAdd(elts);
  }

  export(options?: ExportOptions): Promise<Blob> {
    return super.export(options);
  }
  import(blob: Blob, options?: ImportOptions): Promise<void> {
    return super.import(blob, options);
  }

  async countPageTemplate() {
    return await this.templates.where('examId').equals(this.examId).count();
  }

  async countAlignImage() {
    return await this.alignImages.where('examId').equals(this.examId).count();
  }

  async countNonAlignImage() {
    return await this.nonAlignImages.where('examId').equals(this.examId).count();
  }

  async getFirstNonAlignImage(pageInscan: number) {
    return await this.nonAlignImages.where({ examId: this.examId, pageNumber: pageInscan }).first();
  }
  async getFirstAlignImage(pageInscan: number) {
    return await this.alignImages.where({ examId: this.examId, pageNumber: pageInscan }).first();
  }
  async getFirstTemplate(pageInscan: number) {
    return await this.templates.where({ examId: this.examId, pageNumber: pageInscan }).first();
  }
  async getAllTemplate() {
    return await this.templates.where({ examId: this.examId }).sortBy('pageNumber');
  }

  async getNonAlignImageBetweenAndSortByPageNumber(p1: number, p2: number) {
    return await this.nonAlignImages
      .where(['examId', 'pageNumber'])
      .between([this.examId, p1], [this.examId, p2], true, true)
      .sortBy('pageNumber');
  }

  async getAlignImageBetweenAndSortByPageNumber(p1: number, p2: number) {
    return await this.alignImages
      .where(['examId', 'pageNumber'])
      .between([this.examId, p1], [this.examId, p2], true, true)
      .sortBy('pageNumber');
  }

  async getNonAlignImagesForPageNumbers(pages: number[]) {
    return await this.nonAlignImages
      .where(['examId', 'pageNumber'])
      .anyOf(pages.map(p => [this.examId, p]))
      .sortBy('pageNumber');
  }
  async getAlignImagesForPageNumbers(pages: number[]) {
    return await this.alignImages
      .where(['examId', 'pageNumber'])
      .anyOf(pages.map(p => [this.examId, p]))
      .sortBy('pageNumber');
  }

  async getNonAlignSortByPageNumber() {
    return await this.nonAlignImages.where({ examId: this.examId }).sortBy('pageNumber');
  }

  async moveNonAlignPages(from: number, to: number) {
    if (from !== to) {
      await this.nonAlignImages.where({ examId: this.examId, pageNumber: from }).modify(i => {
        i.pageNumber = -1000;
      });

      if (from < to) {
        await this.nonAlignImages
          .where(['examId', 'pageNumber'])
          .between([this.examId, from], [this.examId, to], false, true)
          .modify(i => {
            i.pageNumber = i.pageNumber - 1;
          });
      } else {
        await this.nonAlignImages
          .where(['examId', 'pageNumber'])
          .between([this.examId, to], [this.examId, from], true, false)
          .modify(i => {
            i.pageNumber = i.pageNumber + 1;
          });
      }
      await this.nonAlignImages.where({ examId: this.examId, pageNumber: -1000 }).modify(i => {
        i.pageNumber = to;
      });
    }
  }

  async moveAlignPages(from: number, to: number) {
    if (from !== to) {
      await this.alignImages.where({ examId: this.examId, pageNumber: from }).modify(i => {
        i.pageNumber = -1000;
      });

      if (from < to) {
        await this.alignImages
          .where(['examId', 'pageNumber'])
          .between([this.examId, from], [this.examId, to], false, true)
          .modify(i => {
            i.pageNumber = i.pageNumber - 1;
          });
      } else {
        await this.alignImages
          .where(['examId', 'pageNumber'])
          .between([this.examId, to], [this.examId, from], true, false)
          .modify(i => {
            i.pageNumber = i.pageNumber + 1;
          });
      }
      await this.alignImages.where({ examId: this.examId, pageNumber: -1000 }).modify(i => {
        i.pageNumber = to;
      });
    }
  }
  compareNumbers(a: number, b: number) {
    return a - b;
  }

  async removePageAlignForExamForPagesAndReorder(pages: number[]) {
    const totalpage = await this.alignImages.where('examId').equals(this.examId).count();
    await this.transaction('rw', 'exams', 'templates', 'alignImages', 'nonAlignImages', async () => {
      const arr = await this.alignImages
        .where(['examId', 'pageNumber'])
        .anyOf(pages.map(p => [this.examId, p]))
        .toArray();
      await this.alignImages.bulkDelete(arr.map(t => t.id!));
      console.error('delete all image');
    });
    console.error('start of moving');

    const pagesorder = pages.sort(this.compareNumbers);
    for (let i = 0; i < pages.length; i++) {
      let max = totalpage;
      let keepuper = true;
      if (i < pagesorder.length - 1) {
        max = pagesorder[i + 1];
        keepuper = false;
      }
      const min = pagesorder[i];
      console.error('min', min, 'max', max);
      if (min !== max) {
        await this.alignImages
          .where(['examId', 'pageNumber'])
          .between([this.examId, min], [this.examId, max], false, keepuper)
          .modify(k => {
            k.pageNumber = k.pageNumber - (i + 1);
          });
      }
    }
  }

  async removePageNonAlignForExamForPagesAndReorder(pages: number[]) {
    const totalpage = await this.nonAlignImages.where('examId').equals(this.examId).count();
    await this.transaction('rw', 'exams', 'templates', 'alignImages', 'nonAlignImages', async () => {
      const arr = await this.nonAlignImages
        .where(['examId', 'pageNumber'])
        .anyOf(pages.map(p => [this.examId, p]))
        .toArray();
      await this.nonAlignImages.bulkDelete(arr.map(t => t.id!));
      console.error('delete all image');
    });

    const pagesorder = pages.sort(this.compareNumbers);
    for (let i = 0; i < pages.length; i++) {
      let max = totalpage;
      let keepuper = true;
      if (i < pagesorder.length - 1) {
        max = pagesorder[i + 1];
        keepuper = false;
      }
      const min = pagesorder[i];
      if (min !== max) {
        await this.nonAlignImages
          .where(['examId', 'pageNumber'])
          .between([this.examId, min], [this.examId, max], false, keepuper)
          .modify(k => {
            k.pageNumber = k.pageNumber - (i + 1);
          });
      }
    }
  }
  async moveTemplatePages(from: number, to: number) {
    if (from !== to) {
      await this.templates.where({ examId: this.examId, pageNumber: from }).modify(i => {
        i.pageNumber = -1000;
      });

      if (from < to) {
        await this.templates
          .where(['examId', 'pageNumber'])
          .between([this.examId, from], [this.examId, to], false, true)
          .modify(i => {
            i.pageNumber = i.pageNumber - 1;
          });
      } else {
        await this.templates
          .where(['examId', 'pageNumber'])
          .between([this.examId, to], [this.examId, from], true, false)
          .modify(i => {
            i.pageNumber = i.pageNumber + 1;
          });
      }
      await this.templates.where({ examId: this.examId, pageNumber: -1000 }).modify(i => {
        i.pageNumber = to;
      });
    }
  }

  async removePageTemplateForExamForPage(page: number) {
    await this.transaction('rw', 'exams', 'templates', 'alignImages', 'nonAlignImages', () => {
      this.templates.where({ examId: this.examId, pageNumber: page }).delete();
    });
  }

  async getAlignSortByPageNumber() {
    return await this.alignImages.where({ examId: this.examId }).sortBy('pageNumber');
  }
  async addExam() {
    return await this.exams.add({
      id: this.examId,
    });
  }

  async addTemplate(elt: AlignImage) {
    return await this.templates.add({
      examId: this.examId,
      pageNumber: elt.pageNumber,
      value: elt.value,
    });
  }

  async countNonAlignWithPageNumber(pageInscan: number) {
    return await this.nonAlignImages.where({ examId: this.examId, pageNumber: pageInscan }).count();
  }

  async countAlignWithPageNumber(pageInscan: number) {
    return await this.alignImages.where({ examId: this.examId, pageNumber: pageInscan }).count();
  }
}

export class AppDB implements CacheService {
  dbs: Map<number, ExamIndexDB> = new Map<number, ExamIndexDB>();

  /* async populate() {
  } */

  async resetDatabase(examId: number): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.resetDatabase();
  }

  async removeExam(examId: number): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.removeExam();
  }

  async removeElementForExam(examId: number): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    this.dbs.delete(examId);

    return db1.removeElementForExam();
  }

  async removeElementForExamForPages(examId: number, pageStart: number, pageEnd: number): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.removeElementForExamForPages(pageStart, pageEnd);
  }

  async removePageAlignForExam(examId: number): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.removePageAlignForExam();
  }

  async removePageAlignForExamForPage(examId: number, page: number): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }

    return db1.removePageAlignForExamForPage(page);
  }

  async removePageNonAlignForExamForPage(examId: number, page: number): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }

    return db1.removePageNonAlignForExamForPage(page);
  }

  async removePageAlignForExamForPages(examId: number, pageStart: number, pageEnd: number): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }

    return db1.removePageAlignForExamForPages(pageStart, pageEnd);
  }

  async removePageNonAlignForExamForPages(examId: number, pageStart: number, pageEnd: number): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }

    return db1.removePageNonAlignForExamForPages(pageStart, pageEnd);
  }

  async addAligneImage(elt: AlignImage): Promise<void> {
    let db1 = this.dbs.get(elt.examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(elt.examId);
      this.dbs.set(elt.examId, db1);
    }
    return db1.addAligneImage(elt);
  }

  async addNonAligneImage(elt: AlignImage): Promise<void> {
    let db1 = this.dbs.get(elt.examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(elt.examId);
      this.dbs.set(elt.examId, db1);
    }
    return db1.addNonAligneImage(elt);
  }

  async addNonAligneImages(elts: AlignImage[]): Promise<void> {
    if (elts.length > 0) {
      let db1 = this.dbs.get(elts[0].examId);
      if (db1 === undefined) {
        db1 = new ExamIndexDB(elts[0].examId);
        this.dbs.set(elts[0].examId, db1);
      }
      return db1.addNonAligneImages(elts);
    } else {
      return;
    }
  }

  export(examId: number, options?: ExportOptions): Promise<Blob> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.export(options);
  }
  import(examId: number, blob: Blob, options?: ImportOptions): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.import(blob, options);
  }

  async countPageTemplate(examId: number): Promise<number> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.countPageTemplate();
  }

  async countAlignImage(examId: number): Promise<number> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.countAlignImage();
  }

  async countNonAlignImage(examId: number): Promise<number> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.countNonAlignImage();
  }

  async getFirstNonAlignImage(examId: number, pageInscan: number): Promise<NonAlignImage | undefined> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.getFirstNonAlignImage(pageInscan);
  }
  async getFirstAlignImage(examId: number, pageInscan: number): Promise<AlignImage | undefined> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.getFirstAlignImage(pageInscan);
  }
  async getFirstTemplate(examId: number, pageInscan: number): Promise<Template | undefined> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.getFirstTemplate(pageInscan);
  }
  async getAllTemplate(examId: number): Promise<Template[] | undefined> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.getAllTemplate();
  }

  async getNonAlignImageBetweenAndSortByPageNumber(examId: number, p1: number, p2: number): Promise<NonAlignImage[]> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.getNonAlignImageBetweenAndSortByPageNumber(p1, p2);
  }

  async getAlignImageBetweenAndSortByPageNumber(examId: number, p1: number, p2: number): Promise<AlignImage[]> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.getAlignImageBetweenAndSortByPageNumber(p1, p2);
  }

  async getNonAlignImagesForPageNumbers(examId: number, pages: number[]): Promise<ImageDB[]> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.getNonAlignImagesForPageNumbers(pages);
  }
  async getAlignImagesForPageNumbers(examId: number, pages: number[]): Promise<ImageDB[]> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.getAlignImagesForPageNumbers(pages);
  }

  async getNonAlignSortByPageNumber(examId: number): Promise<NonAlignImage[]> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.getNonAlignSortByPageNumber();
  }

  async getAlignSortByPageNumber(examId: number): Promise<AlignImage[]> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.getAlignSortByPageNumber();
  }
  async addExam(examId: number): Promise<number> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.addExam();
  }

  async addTemplate(elt: AlignImage): Promise<number> {
    let db1 = this.dbs.get(elt.examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(elt.examId);
      this.dbs.set(elt.examId, db1);
    }
    return db1.addTemplate(elt);
  }

  async countNonAlignWithPageNumber(examId: number, pageInscan: number): Promise<number> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.countNonAlignWithPageNumber(pageInscan);
  }

  async countAlignWithPageNumber(examId: number, pageInscan: number): Promise<number> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.countAlignWithPageNumber(pageInscan);
  }

  async moveNonAlignPages(examId: number, from: number, to: number): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.moveNonAlignPages(from, to);
  }
  async moveAlignPages(examId: number, from: number, to: number): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.moveAlignPages(from, to);
  }

  removePageAlignForExamForPagesAndReorder(examId: number, pages: number[]): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.removePageAlignForExamForPagesAndReorder(pages);
  }
  removePageNonAlignForExamForPagesAndReorder(examId: number, pages: number[]): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.removePageNonAlignForExamForPagesAndReorder(pages);
  }

  moveTemplatePages(examId: number, pageNumber: number, lastPage: number): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.moveTemplatePages(pageNumber, lastPage);
  }

  removePageTemplateForExamForPage(examId: number, lastPage: number): Promise<void> {
    let db1 = this.dbs.get(examId);
    if (db1 === undefined) {
      db1 = new ExamIndexDB(examId);
      this.dbs.set(examId, db1);
    }
    return db1.removePageTemplateForExamForPage(lastPage);
  }
}

export interface CacheService {
  resetDatabase(examId: number): Promise<void>;
  removeExam(examId: number): Promise<void>;
  removeElementForExam(examId: number): Promise<void>;
  removePageAlignForExam(examId: number): Promise<void>;
  removeElementForExamForPages(examId: number, pageStart: number, pageEnd: number): Promise<void>;
  removePageAlignForExamForPages(examId: number, pageStart: number, pageEnd: number): Promise<void>;
  removePageAlignForExamForPage(examId: number, page: number): Promise<void>;
  removePageNonAlignForExamForPage(examId: number, page: number): Promise<void>;

  removePageNonAlignForExamForPages(examId: number, pageStart: number, pageEnd: number): Promise<void>;
  addAligneImage(elt: AlignImage): Promise<any>;
  addNonAligneImage(elt: AlignImage): Promise<any>;
  addNonAligneImages(elts: AlignImage[]): Promise<any>;
  export(examId: number, options?: ExportOptions): Promise<Blob>;
  import(examId: number, blob: Blob, options?: ImportOptions): Promise<void>;
  countPageTemplate(examId: number): Promise<number>;
  countAlignImage(examId: number): Promise<number>;
  countNonAlignImage(examId: number): Promise<number>;
  getFirstNonAlignImage(examId: number, pageInscan: number): Promise<ImageDB | undefined>;
  getFirstAlignImage(examId: number, pageInscan: number): Promise<ImageDB | undefined>;
  getFirstTemplate(examId: number, pageInscan: number): Promise<Template | undefined>;
  getAllTemplate(examId: number): Promise<Template[] | undefined>;
  getNonAlignImageBetweenAndSortByPageNumber(examId: number, p1: number, p2: number): Promise<ImageDB[]>;
  getAlignImageBetweenAndSortByPageNumber(examId: number, p1: number, p2: number): Promise<ImageDB[]>;
  getNonAlignImagesForPageNumbers(examId: number, pages: number[]): Promise<ImageDB[]>;
  getAlignImagesForPageNumbers(examId: number, pages: number[]): Promise<ImageDB[]>;

  getNonAlignSortByPageNumber(examId: number): Promise<ImageDB[]>;
  getAlignSortByPageNumber(examId: number): Promise<ImageDB[]>;
  addExam(examId: number): Promise<number>;
  addTemplate(elt: AlignImage): Promise<number>;
  countNonAlignWithPageNumber(examId: number, pageInscan: number): Promise<number>;
  countAlignWithPageNumber(examId: number, pageInscan: number): Promise<number>;
  moveAlignPages(examId: number, from: number, to: number): Promise<void>;
  moveNonAlignPages(examId: number, from: number, to: number): Promise<void>;

  removePageAlignForExamForPagesAndReorder(examId: number, pages: number[]): Promise<void>;
  removePageNonAlignForExamForPagesAndReorder(examId: number, pages: number[]): Promise<void>;
  moveTemplatePages(examId: number, pageNumber: number, lastPage: number): Promise<void>;
  removePageTemplateForExamForPage(examId: number, lastPage: number): Promise<void>;
}

export const db = new AppDB();
