/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
import { ExportOptions } from 'dexie-export-import';
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { Observable, scan } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { CacheServiceImpl } from '../db/CacheServiceImpl';
import { PreferenceService } from '../preference-page/preference.service';

export interface CacheUploadNotification {
  setMessage(v: string): void;
  setSubMessage(v: string): void;
  setBlocked(v: boolean): void;
  setProgress(v: number): void;
}

export interface CacheDownloadNotification {
  setMessage(v: string): void;
  setSubMessage(v: string): void;
  setBlocked(v: boolean): void;
  setProgress(v: number): void;
  setShowAssociation(v: boolean): void;
  setShowAlignement(v: boolean): void;
  setShowCorrection(v: boolean): void;
}

interface Upload {
  progress: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  body?: any;
}

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}

function isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
  return event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.UploadProgress;
}

const initialState: Upload = { state: 'PENDING', progress: 0 };
const calculateState = (upload: Upload, event: HttpEvent<unknown>): Upload => {
  if (isHttpProgressEvent(event)) {
    return {
      progress: event.total ? Math.round((100 * event.loaded) / event.total) : upload.progress,
      state: 'IN_PROGRESS',
    };
  }
  if (isHttpResponse(event)) {
    // eslint-disable-next-line no-console
    return {
      progress: 100,
      state: 'DONE',
      body: event.body,
    };
  }
  return upload;
};

@Injectable({
  providedIn: 'root',
})
export class CacheUploadService {
  constructor(
    private http: HttpClient,
    public applicationConfigService: ApplicationConfigService,
    private db: CacheServiceImpl,
    private preferenceService: PreferenceService,
  ) {}

  async exportCache(
    examId: number,
    translateService: TranslateService,
    messageService: MessageService,
    numberPageInScan: number,
    cacheUploadNotification: CacheUploadNotification,
  ): Promise<void> {
    if (this.preferenceService.getPreference().cacheDb !== 'sqlite') {
      const o: ExportOptions = {
        noTransaction: true,
        //        numRowsPerChunk: 100,
        prettyJson: true,
      };
      cacheUploadNotification.setBlocked(true);
      const step = 50;
      let nbrPart = Math.trunc((numberPageInScan - 1) / step) + 2;
      const lastPart = numberPageInScan % step;
      if (lastPart === 0) {
        nbrPart = nbrPart - 1;
      }
      o.filter = (table: string, value: any) => {
        return (
          (table === 'exams' && value.id === examId) /* && value.pageNumber <10*/ || (table === 'templates' && value.examId === examId)
        );
      };
      //        (table === 'nonAlignImages' && value.examId === examId) ||
      //        (table === 'alignImages' && value.examId === examId);
      const filename = examId + '_exam_template_indexdb.json';
      await this.exportPart(examId, translateService, messageService, 1, nbrPart, o, cacheUploadNotification, filename);

      for (let k = 0; k < nbrPart - 2; k++) {
        o.filter = (table: string, value: any) => {
          // (table === 'exams' && value.id === examId) /* && value.pageNumber <10*/
          // || (table === 'templates' && value.examId === examId);
          return (
            (table === 'nonAlignImages' &&
              value.examId === examId &&
              value.examId === examId &&
              value.pageNumber <= (k + 1) * step &&
              value.pageNumber > step * k) ||
            (table === 'alignImages' &&
              value.examId === examId &&
              value.examId === examId &&
              value.pageNumber <= (k + 1) * step &&
              value.pageNumber > step * k)
          );
        };
        const filename1 = examId + '_part_' + (k + 1) + '_indexdb.json';

        const success = await this.exportPart(
          examId,
          translateService,
          messageService,
          k + 2,
          nbrPart,
          o,
          cacheUploadNotification,
          filename1,
        );
        if (!success) {
          cacheUploadNotification.setBlocked(false);
          return;
        }
      }
      if (lastPart !== 0) {
        o.filter = (table: string, value: any) =>
          // (table === 'exams' && value.id === examId) /* && value.pageNumber <10*/
          // || (table === 'templates' && value.examId === examId);
          (table === 'nonAlignImages' &&
            value.examId === examId &&
            value.pageNumber <= (nbrPart - 1) * step &&
            value.pageNumber > step * (nbrPart - 2)) ||
          (table === 'alignImages' &&
            value.examId === examId &&
            value.pageNumber <= (nbrPart - 1) * step &&
            value.pageNumber > step * (nbrPart - 2));
        const filename1 = examId + '_part_' + (nbrPart - 1) + '_indexdb.json';

        await this.exportPart(examId, translateService, messageService, nbrPart, nbrPart, o, cacheUploadNotification, filename1);
      }
      cacheUploadNotification.setBlocked(false);
    } else {
      cacheUploadNotification.setBlocked(true);
      const blob = await this.db.export(examId, {});
      const file = new File([blob], examId + '.sqlite3');
      cacheUploadNotification.setProgress(0);
      translateService.get('scanexam.uploadcacheencours').subscribe(res => cacheUploadNotification.setMessage('' + res + ' db '));
      translateService.get('scanexam.uploadcacheencoursdetail').subscribe(res => cacheUploadNotification.setSubMessage('' + res));
      const p = new Promise<boolean>(resolve => {
        this.uploadCache(file).subscribe(
          e => {
            cacheUploadNotification.setProgress(e.progress);
            if (e.state === 'DONE') {
              cacheUploadNotification.setMessage('');
              cacheUploadNotification.setSubMessage('');
              resolve(true);
            }
          },
          () => {
            messageService.add({
              severity: 'error',
              summary: translateService.instant('scanexam.uploadcacheko'),
              detail: translateService.instant('scanexam.uploadcachekodetail'),
            });

            cacheUploadNotification.setBlocked(false);
            cacheUploadNotification.setMessage('');
            cacheUploadNotification.setSubMessage('');
            resolve(false);
          },
        );
      });
      const success = await p;
      cacheUploadNotification.setBlocked(false);

      if (!success) {
        messageService.add({
          severity: 'error',
          summary: translateService.instant('scanexam.uploadcacheko'),
          detail: translateService.instant('scanexam.uploadcachekodetail'),
        });
        return;
      } else {
        messageService.add({
          severity: 'success',
          summary: translateService.instant('scanexam.uploadcacheok'),
          detail: translateService.instant('scanexam.uploadcacheokdetail'),
        });
      }
    }
    return;
  }

  private async exportPart(
    examId: number,
    translateService: TranslateService,
    messageService: MessageService,
    part: number,
    nbrPart: number,
    o: ExportOptions,
    cacheUploadNotification: CacheUploadNotification,
    filename: string,
  ): Promise<boolean> {
    translateService
      .get('scanexam.exportcacheencours')
      .subscribe(res => cacheUploadNotification.setMessage('' + res + ' Part ' + part + '/' + nbrPart));
    try {
      const value = await this.db.export(examId, o);

      const file = new File([value], filename);

      cacheUploadNotification.setProgress(0);
      translateService
        .get('scanexam.uploadcacheencours')
        .subscribe(res => cacheUploadNotification.setMessage('' + res + ' Part ' + part + '/' + nbrPart));
      translateService.get('scanexam.uploadcacheencoursdetail').subscribe(res => cacheUploadNotification.setSubMessage('' + res));
      const p = new Promise<boolean>(resolve => {
        this.uploadCache(file).subscribe(
          e => {
            cacheUploadNotification.setProgress(e.progress);
            if (e.state === 'DONE') {
              /* setBlocked(false);
              messageService.add({
                severity: 'success',
                summary: translateService.instant('scanexam.uploadcacheok'),
                detail: translateService.instant('scanexam.uploadcacheokdetail'),
              }); */
              cacheUploadNotification.setMessage('');
              cacheUploadNotification.setSubMessage('');
              resolve(true);
            }
          },
          () => {
            messageService.add({
              severity: 'error',
              summary: translateService.instant('scanexam.uploadcacheko'),
              detail: translateService.instant('scanexam.uploadcachekodetail'),
            });

            cacheUploadNotification.setBlocked(false);
            cacheUploadNotification.setMessage('');
            cacheUploadNotification.setSubMessage('');
            resolve(false);
          },
        );
      });
      return await p;
    } catch (e2) {
      messageService.add({
        severity: 'error',
        summary: translateService.instant('scanexam.uploadcacheko'),
        detail: translateService.instant('scanexam.uploadcachekodetail'),
      });
      cacheUploadNotification.setBlocked(false);
      cacheUploadNotification.setMessage('');
      cacheUploadNotification.setSubMessage('');
      return false;
    }
  }

  async importCache(
    examId: number,
    translateService: TranslateService,
    messageService: MessageService,
    cacheDownloadNotification: CacheDownloadNotification,
    showFailMessage: boolean,
  ): Promise<void> {
    translateService.get('scanexam.downloadcacheencours').subscribe(res => cacheDownloadNotification.setMessage('' + res + ''));
    translateService.get('scanexam.downloadcacheencoursdetail').subscribe(res => cacheDownloadNotification.setSubMessage('' + res));
    cacheDownloadNotification.setProgress(-1);

    if (this.preferenceService.getPreference().cacheDb !== 'sqlite') {
      await this.db.removeElementForExam(examId);
      let p = new Promise(resolve => {
        this.getCache(examId + 'indexdb.json').subscribe(data => {
          resolve(data);
        });
      });

      const datas: Blob[] = [];
      let data = (await p) as Blob;
      if (data.size === 0) {
        p = new Promise(resolve => {
          this.getCache(examId + '_exam_template_indexdb.json').subscribe(d => {
            resolve(d);
          });
        });
        data = (await p) as Blob;

        if (data.size === 0) {
          if (showFailMessage) {
            messageService.add({
              severity: 'warn',
              summary: translateService.instant('scanexam.downloadcacheko'),
              detail: translateService.instant('scanexam.downloadcachekodetail'),
            });
          }

          cacheDownloadNotification.setBlocked(false);
          cacheDownloadNotification.setMessage('');
          return;
        } else {
          datas.push(data);
          let part = 1;
          cacheDownloadNotification.setSubMessage('Part ' + part);

          p = new Promise(resolve => {
            this.getCache(examId + '_part_' + part + '_indexdb.json').subscribe(d => {
              resolve(d);
            });
          });
          data = (await p) as Blob;
          while (data.size > 0) {
            datas.push(data);
            part = part + 1;
            cacheDownloadNotification.setSubMessage('Part ' + part);

            p = new Promise(resolve => {
              this.getCache(examId + '_part_' + part + '_indexdb.json').subscribe(d => {
                resolve(d);
              });
            });
            data = (await p) as Blob;
          }
        }
      } else {
        datas.push(data);
      }
      for (let i = 0; i < datas.length; i++) {
        try {
          translateService.get('scanexam.importToDexie').subscribe(res => cacheDownloadNotification.setMessage('' + res + ''));
          cacheDownloadNotification.setSubMessage('Part ' + (i + 1));

          await this.db.import(examId, datas[i], {
            acceptNameDiff: true,
            acceptMissingTables: true,
            acceptVersionDiff: true,
            acceptChangedPrimaryKey: true,
          });
        } catch (err: any) {
          messageService.add({
            severity: 'warn',
            summary: translateService.instant('scanexam.downloadcacheko'),
            detail: translateService.instant('scanexam.downloadcachekodetail'),
          });
          cacheDownloadNotification.setBlocked(false);
          cacheDownloadNotification.setMessage('');
          cacheDownloadNotification.setSubMessage('');

          return;
        }
      }

      messageService.add({
        severity: 'success',
        summary: translateService.instant('scanexam.downloadcacheok'),
        detail: translateService.instant('scanexam.downloadcacheokdetail'),
      });
      cacheDownloadNotification.setBlocked(false);
      cacheDownloadNotification.setShowAssociation(true);
      cacheDownloadNotification.setShowCorrection(true);
    } else {
      cacheDownloadNotification.setBlocked(true);
      const p = new Promise(resolve => {
        this.getCache(examId + '.sqlite3').subscribe(d => {
          resolve(d);
        });
      });
      const data = (await p) as Blob;

      if (data.size === 0) {
        messageService.add({
          severity: 'warn',
          summary: translateService.instant('scanexam.downloadcacheko'),
          detail: translateService.instant('scanexam.downloadcachekodetail'),
        });
        cacheDownloadNotification.setBlocked(false);
        return;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await this.db.import(examId, data, {
          acceptNameDiff: true,
          acceptMissingTables: true,
          acceptVersionDiff: true,
          acceptChangedPrimaryKey: true,
        });
        messageService.add({
          severity: 'success',
          summary: translateService.instant('scanexam.downloadcacheok'),
          detail: translateService.instant('scanexam.downloadcacheokdetail'),
        });
        cacheDownloadNotification.setBlocked(false);
        cacheDownloadNotification.setShowAssociation(true);
        cacheDownloadNotification.setShowCorrection(true);
      }
    }
  }

  private uploadCache(file: File): Observable<Upload> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http
      .post(this.applicationConfigService.getEndpointFor('api/uploadCache'), formData, {
        reportProgress: true,
        responseType: 'json',
        observe: 'events',
      })
      .pipe(scan(calculateState, initialState));
  }

  public async uploadStudentPdf(
    blob: Blob,
    examId: number,
    translateService: TranslateService,
    messageService: MessageService,
    filename: string,
    cacheUploadNotification: CacheUploadNotification,
  ): Promise<boolean> {
    const file = new File([blob], filename);
    cacheUploadNotification.setProgress(0);
    translateService.get('scanexam.uploadstudentsheetencours').subscribe(res => cacheUploadNotification.setMessage('' + res));
    translateService.get('scanexam.uploadstudentsheetencoursdetail').subscribe(res => cacheUploadNotification.setSubMessage('' + res));
    const p = new Promise<boolean>(resolve => {
      this.uploadPdfStudentSheet(file, examId).subscribe(
        e => {
          cacheUploadNotification.setProgress(e.progress);
          if (e.state === 'DONE') {
            cacheUploadNotification.setMessage('');
            cacheUploadNotification.setSubMessage('');
            resolve(true);
          }
        },
        () => {
          messageService.add({
            severity: 'error',
            summary: translateService.instant('scanexam.uploadstudentsheetko'),
            detail: translateService.instant('scanexam.uploadstudentsheetdetail'),
          });

          cacheUploadNotification.setBlocked(false);
          cacheUploadNotification.setMessage('');
          cacheUploadNotification.setSubMessage('');
          resolve(false);
        },
      );
    });
    const success = await p;
    cacheUploadNotification.setBlocked(false);

    if (!success) {
      messageService.add({
        severity: 'error',
        summary: translateService.instant('scanexam.uploadstudentsheetko'),
        detail: translateService.instant('scanexam.uploadstudentsheetkodetail'),
      });
    } else {
      messageService.add({
        severity: 'success',
        summary: translateService.instant('scanexam.uploadstudentsheetok'),
        detail: translateService.instant('scanexam.uploadstudentsheetokdetail'),
      });
    }

    return success;
  }

  private uploadPdfStudentSheet(file: File, examId: number): Observable<Upload> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http
      .post(this.applicationConfigService.getEndpointFor('api/uploadExportFinalStudent/' + examId), formData, {
        reportProgress: true,
        responseType: 'json',
        observe: 'events',
      })
      .pipe(scan(calculateState, initialState));
  }

  private getCache(filename: string): Observable<any> {
    // eslint-disable-next-line no-console
    // console.log(this.applicationConfigService.getEndpointFor('api/getCache/' + filename));
    return this.http.get(this.applicationConfigService.getEndpointFor('api/getCache/' + filename), {
      //  reportProgress: true,
      // observe: 'events',
      responseType: 'blob',
    });
  }

  getNoAlignImage(examId: number, pageNumber: number): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands

    return this.http.get(this.applicationConfigService.getEndpointFor('api/getCacheNonAlignPage/' + examId + '/' + pageNumber), {
      responseType: 'text',
    });
  }
  getAlignImage(examId: number, pageNumber: number): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return this.http.get(this.applicationConfigService.getEndpointFor('api/getCacheAlignPage/' + examId + '/' + pageNumber), {
      responseType: 'text',
    });
  }
}
