/* eslint-disable @typescript-eslint/no-unsafe-return */
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

  removeElementForExamForPages(examId: number, pageStart: number, pageEnd: number): Promise<void> {
    return this.service.removeElementForExamForPages(examId, pageStart, pageEnd);
  }

  addAligneImage(elt: AlignImage): Promise<any> {
    return this.service.addAligneImage(elt);
  }
  addNonAligneImage(elt: AlignImage): Promise<any> {
    return this.service.addNonAligneImage(elt);
  }
  export(examId: number, options?: ExportOptions | undefined): Promise<Blob> {
    return this.service.export(examId, options);
  }
  import(examId: number, blob: Blob, options?: ImportOptions | undefined): Promise<void> {
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
  addExam(examId: number): Promise<number> {
    return this.service.addExam(examId);
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
}
