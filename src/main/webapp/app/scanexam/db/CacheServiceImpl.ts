import { Injectable } from '@angular/core';
import { ExportOptions, ImportOptions } from 'dexie-export-import';
import { AlignImage, AppDB, CacheService, ImageDB, Template } from './db';
import { PreferenceService } from '../preference-page/preference.service';
import { SqliteCacheService } from './dbsqlite';

@Injectable({
  providedIn: 'root',
})
export class CacheServiceImpl implements CacheService {
  service: CacheService;

  constructor(private preference: PreferenceService) {
    this.service = new AppDB();
    if (preference.getPreference().cacheDb === 'sqlite') {
      this.service = new SqliteCacheService();
      (this.service as SqliteCacheService).load();
    }
  }

  cleanOutDatedCached(examIds: number[]): Promise<void> {
    return this.service.cleanOutDatedCached(examIds);
  }

  getNonAlignImagesForPageNumbers(examId: number, pages: number[]): Promise<ImageDB[]> {
    return this.service.getNonAlignImagesForPageNumbers(examId, pages);
  }
  getAlignImagesForPageNumbers(examId: number, pages: number[]): Promise<ImageDB[]> {
    return this.service.getAlignImagesForPageNumbers(examId, pages);
  }

  resetDatabase(examId: number): Promise<void> {
    return this.service.resetDatabase(examId);
  }
  removeExam(examId: number): Promise<void> {
    return this.service.removeExam(examId);
  }
  removeElementForExam(examId: number): Promise<void> {
    return this.service.removeElementForExam(examId);
  }

  removePageAlignForExam(examId: number): Promise<void> {
    return this.service.removePageAlignForExam(examId);
  }

  removeElementForExamForPages(examId: number, pageStart: number, pageEnd: number): Promise<void> {
    return this.service.removeElementForExamForPages(examId, pageStart, pageEnd);
  }
  removePageAlignForExamForPages(examId: number, pageStart: number, pageEnd: number): Promise<void> {
    return this.service.removePageAlignForExamForPages(examId, pageStart, pageEnd);
  }
  removePageAlignForExamForPage(examId: number, page: number): Promise<void> {
    return this.service.removePageAlignForExamForPage(examId, page);
  }

  removePageNonAlignForExamForPage(examId: number, page: number): Promise<void> {
    return this.service.removePageNonAlignForExamForPage(examId, page);
  }

  removePageNonAlignForExamForPages(examId: number, pageStart: number, pageEnd: number): Promise<void> {
    return this.service.removePageNonAlignForExamForPages(examId, pageStart, pageEnd);
  }

  addAligneImage(elt: AlignImage): Promise<any> {
    return this.service.addAligneImage(elt);
  }
  addNonAligneImage(elt: AlignImage): Promise<any> {
    return this.service.addNonAligneImage(elt);
  }
  addNonAligneImages(elts: AlignImage[]): Promise<any> {
    return this.service.addNonAligneImages(elts);
  }
  export(examId: number, options?: ExportOptions): Promise<Blob> {
    return this.service.export(examId, options);
  }
  import(examId: number, blob: Blob, options?: ImportOptions): Promise<void> {
    return this.service.import(examId, blob, options);
  }
  countPageTemplate(examId: number): Promise<number> {
    return this.service.countPageTemplate(examId);
  }
  countAlignImage(examId: number): Promise<number> {
    return this.service.countAlignImage(examId);
  }
  countNonAlignImage(examId: number): Promise<number> {
    return this.service.countNonAlignImage(examId);
  }
  getFirstNonAlignImage(examId: number, pageInscan: number): Promise<ImageDB | undefined> {
    return this.service.getFirstNonAlignImage(examId, pageInscan);
  }
  getFirstAlignImage(examId: number, pageInscan: number): Promise<ImageDB | undefined> {
    return this.service.getFirstAlignImage(examId, pageInscan);
  }
  getFirstTemplate(examId: number, pageInscan: number): Promise<Template | undefined> {
    return this.service.getFirstTemplate(examId, pageInscan);
  }
  getAllTemplate(examId: number): Promise<Template[] | undefined> {
    return this.service.getAllTemplate(examId);
  }
  getNonAlignImageBetweenAndSortByPageNumber(examId: number, p1: number, p2: number): Promise<ImageDB[]> {
    return this.service.getNonAlignImageBetweenAndSortByPageNumber(examId, p1, p2);
  }
  getAlignImageBetweenAndSortByPageNumber(examId: number, p1: number, p2: number): Promise<ImageDB[]> {
    return this.service.getAlignImageBetweenAndSortByPageNumber(examId, p1, p2);
  }
  getNonAlignSortByPageNumber(examId: number): Promise<ImageDB[]> {
    return this.service.getNonAlignSortByPageNumber(examId);
  }
  getAlignSortByPageNumber(examId: number): Promise<ImageDB[]> {
    return this.service.getAlignSortByPageNumber(examId);
  }
  addExam(examId: number, d: Date): Promise<number> {
    return this.service.addExam(examId, d);
  }

  getExamTimestamp(examId: number): Promise<number> {
    return this.service.getExamTimestamp(examId);
  }

  addTemplate(elt: AlignImage): Promise<number> {
    return this.service.addTemplate(elt);
  }
  countNonAlignWithPageNumber(examId: number, pageInscan: number): Promise<number> {
    return this.service.countNonAlignWithPageNumber(examId, pageInscan);
  }
  countAlignWithPageNumber(examId: number, pageInscan: number): Promise<number> {
    return this.service.countAlignWithPageNumber(examId, pageInscan);
  }

  moveNonAlignPages(examId: number, from: number, to: number): Promise<void> {
    return this.service.moveNonAlignPages(examId, from, to);
  }
  moveAlignPages(examId: number, from: number, to: number): Promise<void> {
    return this.service.moveAlignPages(examId, from, to);
  }
  removePageAlignForExamForPagesAndReorder(examId: number, pages: number[]): Promise<void> {
    return this.service.removePageAlignForExamForPagesAndReorder(examId, pages);
  }
  removePageNonAlignForExamForPagesAndReorder(examId: number, pages: number[]): Promise<void> {
    return this.service.removePageNonAlignForExamForPagesAndReorder(examId, pages);
  }

  moveTemplatePages(examId: number, pageNumber: number, lastPage: number): Promise<void> {
    return this.service.moveTemplatePages(examId, pageNumber, lastPage);
  }

  removePageTemplateForExamForPage(examId: number, lastPage: number): Promise<void> {
    return this.service.removePageTemplateForExamForPage(examId, lastPage);
  }
}
