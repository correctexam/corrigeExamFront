import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import FileSaver from 'file-saver';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { WorkSheet } from 'xlsx';

const csvConfig = mkConfig({ useKeysAsHeaders: true });

@Injectable({
  providedIn: 'root',
})
export class ExportResultService {
  constructor(
    protected applicationConfigService: ApplicationConfigService,
    private http: HttpClient,
  ) {}

  prepareDataToExport(studentsresult: any[], libelles: any, deleteId: boolean): void {
    let maxQuestion = 0;
    studentsresult.forEach(res => {
      // eslint-disable-next-line no-console
      for (const key in res.notequestions) {
        // eslint-disable-next-line no-prototype-builtins
        if (res.notequestions.hasOwnProperty(key)) {
          if (+key > maxQuestion) {
            maxQuestion = +key;
          }
        }
      }
    });
    studentsresult.forEach(res => {
      for (let i = 1; i <= maxQuestion; i++) {
        if (libelles[i] !== undefined && libelles[i] !== '') {
          res['Q' + i + ' (' + libelles[i] + ')'] = undefined;
        } else {
          res['Q' + i] = undefined;
        }
      }
    });

    studentsresult.forEach(res => {
      if (res['note'] !== undefined && (typeof res['note'] === 'string' || res['note'] instanceof String)) {
        res['note'] = parseFloat((res['note'] as any).replaceAll(',', '.'));
      }
      if (res['abi'] !== undefined) {
        if (res['abi'] === 1) {
          res['abi'] = 'ABI';
        } else if (res['abi'] === 2) {
          res['abi'] = 'ABJ';
        } else {
          res['abi'] = false;
        }
      }
      for (const key in res.notequestions) {
        // eslint-disable-next-line no-prototype-builtins
        if (res.notequestions.hasOwnProperty(key)) {
          if (libelles[key] !== undefined && libelles[key] !== '') {
            res['Q' + key + ' (' + libelles[key] + ')'] = parseFloat(res.notequestions[key].replaceAll(',', '.'));
          } else {
            res['Q' + key] = parseFloat(res.notequestions[key].replaceAll(',', '.'));
          }
        }
      }
    });
    studentsresult.forEach((e: any) => delete e.notequestions);
    if (deleteId) {
      studentsresult.forEach((e: any) => delete e.id);
    }
  }

  async loadLibelle(examId: number): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (await firstValueFrom(this.http.get(this.applicationConfigService.getEndpointFor('api/getLibelleQuestions/' + examId)))) as any;
  }

  async exportExcelForModule(exaname: Map<number, string>, examresult: Map<number, any[]>, fileName: string): Promise<void> {
    const xlsx = await import('xlsx');
    const sheets = new Map<string, WorkSheet>();
    const sheetsF: any = {};
    const sheetsName: string[] = [];

    for (const examId of examresult.keys()) {
      const libelle = await this.loadLibelle(examId);
      this.prepareDataToExport(examresult.get(examId)!, libelle, false);
    }

    const general = new Map<number, any>();
    for (const examId of examresult.keys()) {
      const studentResults = examresult.get(examId)!;
      for (const studentResult of studentResults) {
        const res = general.get(studentResult.id) ? general.get(studentResult.id) : ({} as any);
        if (!general.has(studentResult.id)) {
          general.set(studentResult.id, res);
        }
        if (res['nom'] === undefined || res['nom'] === '') {
          res['nom'] = studentResult['nom'];
        }
        if (res['prenom'] === undefined || res['prenom'] === '') {
          res['prenom'] = studentResult['prenom'];
        }
        if (res['mail'] === undefined || res['mail'] === '') {
          res['mail'] = studentResult['mail'];
        }
        if (res[exaname.get(examId)!] === undefined || res[exaname.get(examId)!] === '') {
          if (studentResult['abi'] === false) {
            res[exaname.get(examId)!] = studentResult['note'];
          } else {
            res[exaname.get(examId)!] = studentResult['abi'];
          }
        }
      }
    }

    const worksheetgen = xlsx.utils.json_to_sheet([...general.values()]);
    sheets.set('summary', worksheetgen);

    for (const examId of examresult.keys()) {
      for (const studentsresult of examresult.get(examId)!) {
        studentsresult.forEach((e: any) => delete e.id);
      }
      const worksheet = xlsx.utils.json_to_sheet(examresult.get(examId)!);
      sheets.set('exam ' + examId, worksheet);
    }

    for (const sheet of sheets.keys()) {
      sheetsF[sheet] = sheets.get(sheet);
      sheetsName.push(sheet);
    }
    const workbook = { Sheets: sheetsF, SheetNames: sheetsName };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  exportExcel(studentsresult: any[], libelles: any, filename: string): void {
    import('xlsx').then(xlsx => {
      this.prepareDataToExport(studentsresult, libelles, true);
      const worksheet = xlsx.utils.json_to_sheet(studentsresult);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });

      this.saveAsExcelFile(excelBuffer, filename);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  exportCSV(studentsresult: any[], libelles: any, filename: string): void {
    this.prepareDataToExport(studentsresult, libelles, true);
    const csv = generateCsv(csvConfig)(studentsresult);
    csvConfig.filename = filename;
    // Get the button in your HTML
    download(csvConfig)(csv);
  }

  exportCsvForModule(exaname: Map<number, string>, examresult: Map<number, any[]>, fileName: string): void {
    for (const examId of examresult.keys()) {
      this.prepareDataToExport(examresult.get(examId)!, {}, false);
    }

    const general = new Map<number, any>();
    for (const examId of examresult.keys()) {
      const studentResults = examresult.get(examId)!;
      for (const studentResult of studentResults) {
        const res = general.get(studentResult.id) ? general.get(studentResult.id) : ({} as any);
        if (!general.has(studentResult.id)) {
          general.set(studentResult.id, res);
        }
        if (res['nom'] === undefined || res['nom'] === '') {
          res['nom'] = studentResult['nom'];
        }
        if (res['prenom'] === undefined || res['prenom'] === '') {
          res['prenom'] = studentResult['prenom'];
        }
        if (res['mail'] === undefined || res['mail'] === '') {
          res['mail'] = studentResult['mail'];
        }
        if (res[exaname.get(examId)!] === undefined || res[exaname.get(examId)!] === '') {
          if (studentResult['abi'] === false) {
            res[exaname.get(examId)!] = studentResult['note'];
          } else {
            res[exaname.get(examId)!] = studentResult['abi'];
          }
        }
      }
    }

    const csv = generateCsv(csvConfig)([...general.values()]);
    csvConfig.filename = fileName;
    // Get the button in your HTML
    download(csvConfig)(csv);
  }
}

export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
export function formatDateTime(date: Date): string {
  const formattedDate = formatDate(date); // Reuse formatDate function
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${formattedDate} ${hours}:${minutes}:${seconds}`;
}
