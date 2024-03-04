/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { GradeType } from 'app/entities/enumerations/grade-type.model';
import { LocalStorageService } from 'ngx-webstorage';
import { IPreference } from '../services/align-images.service';
import { IGradedComment } from 'app/entities/graded-comment/graded-comment.model';
import { IHybridGradedComment, NewHybridGradedComment } from '../../entities/hybrid-graded-comment/hybrid-graded-comment.model';
import { ITextComment } from 'app/entities/text-comment/text-comment.model';

interface IPreferenceForQuestion {
  point: number;
  step: number;
  gradeType: GradeType;
  typeId: number;
  defaultpoint?: number;
}
@Injectable({
  providedIn: 'root',
})
export class PreferenceService {
  constructor(public localStorageService: LocalStorageService) {}

  getPreference(): IPreference {
    let pref: IPreference | null = this.localStorageService.retrieve('preferences');
    if (pref === null) {
      const defaultvalue: IPreference = {
        qcm_min_width_shape: 10,
        qcm_min_height_shape: 10,
        qcm_epsilon: 0.02, // 0.03
        qcm_differences_avec_case_blanche: 0.1,
        linelength: 15,
        repairsize: 3,
        dilatesize: 3,
        morphsize: 3,
        drawcontoursizeh: 4,
        drawcontoursizev: 4,
        minCircle: 6,
        maxCircle: 20,
        numberofpointToMatch: 5,
        numberofgoodpointToMatch: 0,
        defaultAlignAlgowithMarker: true,
        removeHorizontalName: true,
        pdfscale: 2,
        cacheDb: 'indexdb',
        imageTypeExport: 'image/webp',
        exportImageCompression: 0.66,
      };
      this.localStorageService.store('preferences', defaultvalue);
      pref = defaultvalue;
    }
    return pref;
  }

  save(pref: IPreference): void {
    this.localStorageService.store('preferences', pref);
  }

  clearToDefault(): IPreference {
    const defaultvalue = {
      qcm_min_width_shape: 10,
      qcm_min_height_shape: 10,
      qcm_epsilon: 0.02, // 0.03
      qcm_differences_avec_case_blanche: 0.1,
      linelength: 15,
      repairsize: 3,
      dilatesize: 3,
      morphsize: 3,
      drawcontoursizeh: 4,
      drawcontoursizev: 4,
      minCircle: 6,
      maxCircle: 20,
      numberofpointToMatch: 5,
      numberofgoodpointToMatch: 0,
      defaultAlignAlgowithMarker: true,
      removeHorizontalName: true,
      pdfscale: 2,
      cacheDb: 'indexdb',
      imageTypeExport: 'image/webp',
      exportImageCompression: 0.66,
    };
    this.localStorageService.store('preferences', defaultvalue);
    return defaultvalue;
  }

  showKeyboardShortcuts(): boolean {
    const pref: boolean | null = this.localStorageService.retrieve('shortcut');
    if (pref === null) {
      this.localStorageService.store('shortcut', true);
      return true;
    }
    return pref;
  }
  setKeyboardShortcuts(shortcut: boolean): void {
    this.localStorageService.store('shortcut', shortcut);
  }
  resetKeyboardShortcuts(): void {
    this.localStorageService.store('shortcut', true);
  }

  resetFirstCorrectMessage(): void {
    this.localStorageService.store('firstCorrectMessage', true);
  }

  showFirstCorrectMessage(): boolean {
    const pref: boolean | null = this.localStorageService.retrieve('firstCorrectMessage');
    if (pref === null) {
      this.localStorageService.store('firstCorrectMessage', true);
      return true;
    }
    return pref;
  }
  setFirstCorrectMessage(shortcut: boolean): void {
    this.localStorageService.store('firstCorrectMessage', shortcut);
  }

  resetFirstCourseMessage(): void {
    this.localStorageService.store('firstCourseMessage', true);
  }

  showFirstCourseMessage(): boolean {
    const pref: boolean | null = this.localStorageService.retrieve('firstCourseMessage');
    if (pref === null) {
      this.localStorageService.store('firstCourseMessage', true);
      return true;
    }
    return pref;
  }
  setFirstCourseMessage(shortcut: boolean): void {
    this.localStorageService.store('firstCourseMessage', shortcut);
  }

  minimizeComments(): boolean {
    const pref: boolean | null = this.localStorageService.retrieve('minimizeComments');
    if (pref === null) {
      this.localStorageService.store('minimizeComments', false);
      return false;
    }
    return pref;
  }
  setMinimizeComments(shortcut: boolean): void {
    this.localStorageService.store('minimizeComments', shortcut);
  }

  resetminimizeComment(): void {
    this.localStorageService.store('minimizeComments', false);
  }

  getPreferenceForQuestion(): IPreferenceForQuestion {
    let pref: IPreferenceForQuestion | null = this.localStorageService.retrieve('preferences4question');
    if (pref === null) {
      const defaultvalue: IPreferenceForQuestion = {
        point: 2,
        step: 4,
        gradeType: GradeType.DIRECT,
        typeId: 2,
      };
      this.localStorageService.store('preferences4question', defaultvalue);
      pref = defaultvalue;
    }
    return pref;
  }
  savePref4Question(pref: IPreferenceForQuestion): void {
    this.localStorageService.store('preferences4question', pref);
  }

  saveFilterStudentPreference(pref: boolean): void {
    this.localStorageService.store('filterstudentpreference', pref);
  }
  getFilterStudentPreference(): boolean {
    let pref: boolean | null = this.localStorageService.retrieve('filterstudentpreference');
    if (pref === null) {
      const defaultvalue = false;
      this.localStorageService.store('filterstudentpreference', defaultvalue);
      pref = defaultvalue;
    }
    return pref;
  }

  saveImagePerLine(pref: number): void {
    this.localStorageService.store('saveImagePerLine', pref);
  }

  getImagePerLine(): number {
    let pref: number | null = this.localStorageService.retrieve('saveImagePerLine');
    if (pref === null) {
      const defaultvalue = 2;
      this.localStorageService.store('saveImagePerLine', defaultvalue);
      pref = defaultvalue;
    }
    return pref;
  }

  saveNbreCluster(pref: number): void {
    this.localStorageService.store('saveNbreCluster', pref);
  }

  getNbreCluster(): number {
    let pref: number | null = this.localStorageService.retrieve('saveNbreCluster');
    if (pref === null) {
      const defaultvalue = 5;
      this.localStorageService.store('saveNbreCluster', defaultvalue);
      pref = defaultvalue;
    }
    return pref;
  }

  saveCluster4Question(key: string, pref: Map<number, number[]>): void {
    this.localStorageService.store('cluster_' + key, JSON.stringify(pref, this.replacer));
  }
  getCluster4Question(key: string): Map<number, number[]> | null {
    const spref: string | null = this.localStorageService.retrieve('cluster_' + key);
    if (spref === null) {
      return null;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(spref, this.reviver);
    }
  }

  saveCommentSort4Question(examId_qId: string, pref: Map<number, number>): void {
    this.localStorageService.store('commentsort_' + examId_qId, JSON.stringify(pref, this.replacer));
  }
  getCommentSort4Question(examId_qId: string): Map<number, number> {
    const spref: string | null = this.localStorageService.retrieve('commentsort_' + examId_qId);
    if (spref === null) {
      return new Map();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(spref, this.reviver);
    }
  }

  saveDefaultHybridComment(c: IHybridGradedComment[]): void {
    const cs = JSON.parse(JSON.stringify(c, this.replacer), this.reviver);
    cs.forEach((c1: any) => {
      delete c1.id;
    });

    this.localStorageService.store('defaultHybridComment', JSON.stringify(cs, this.replacer));
  }
  saveDefaultGradedComment(c: IGradedComment[]): void {
    const cs = JSON.parse(JSON.stringify(c, this.replacer), this.reviver);
    cs.forEach((c1: any) => {
      delete c1.id;
    });
    this.localStorageService.store('defaultGradedComment', JSON.stringify(cs, this.replacer));
  }
  saveDefaultTextComment(c: ITextComment[]): void {
    const cs = JSON.parse(JSON.stringify(c, this.replacer), this.reviver);
    cs.forEach((c1: any) => {
      delete c1.id;
    });
    this.localStorageService.store('defaultTextComment', JSON.stringify(cs, this.replacer));
  }

  clearDefaultHybridComment(): void {
    this.localStorageService.store('defaultHybridComment', null);
  }
  clearDefaultGradedComment(): void {
    this.localStorageService.store('defaultGradedComment', null);
  }
  clearDefaultTextComment(): void {
    this.localStorageService.store('defaultTextComment', null);
  }

  getDefaultHybridComment(): NewHybridGradedComment[] | null {
    const c = this.localStorageService.retrieve('defaultHybridComment');
    if (c === null) {
      return null;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(c, this.reviver);
    }
  }
  getDefaultGradedComment(): IGradedComment[] | null {
    const c = this.localStorageService.retrieve('defaultGradedComment');
    if (c === null) {
      return null;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(c, this.reviver);
    }
  }
  getDefaultTextComment(): ITextComment[] | null {
    const c = this.localStorageService.retrieve('defaultTextComment');
    if (c === null) {
      return null;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(c, this.reviver);
    }
  }

  replacer(key: any, value: any): any {
    if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }
  reviver(key: any, value: any): any {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }
}
