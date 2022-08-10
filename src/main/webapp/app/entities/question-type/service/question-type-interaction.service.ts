/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable curly */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-console */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IQuestion } from '../../question/question.model';
import { QuestionService } from '../../question/service/question.service';
import { Observable } from 'rxjs';
import { QuestionTypeService } from './question-type.service';
import { db } from 'app/scanexam/db/db';
import { ExamService } from 'app/entities/exam/service/exam.service';
import { ExamSheetService } from 'app/entities/exam-sheet/service/exam-sheet.service';
import { StudentService } from 'app/entities/student/service/student.service';
import { IExam } from 'app/entities/exam/exam.model';
import { IStudent } from 'app/entities/student/student.model';
import { ExamSheet } from 'app/entities/exam-sheet/exam-sheet.model';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { IPage } from 'app/scanexam/alignscan/alignscan.component';
import { IZone } from 'app/entities/zone/zone.model';
import { AlignImagesService } from 'app/scanexam/services/align-images.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionTypeInteractionService {
  constructor(
    private http: HttpClient,
    private questionService: QuestionService,
    private studentService: StudentService,
    private examService: ExamService,
    private zoneService: ZoneService,
    private questionTypeService: QuestionTypeService,
    private examSheetService: ExamSheetService,
    private alignImagesService: AlignImagesService
  ) {}

  /**
   *
   * @param examId
   * @param align
   * @load in the service all the data related to the student sheets
   */
  loadSheets(examId: number, align: boolean): Page64[] {
    const pages: Page64[] = [];
    const dataImages = align ? db.alignImages.where({ examId: +examId }) : db.nonAlignImages.where({ examId: +examId });
    dataImages.each(data => {
      if (data.id === undefined) {
        data.id = -1;
      }
      data.value = this.base64root(JSON.parse(data.value).pages);
      pages.push({ base64String: data.value, id: data.id, pageNumber: data.pageNumber });
    });
    return pages;
  }

  private base64root(datatypebase64: string): string {
    return datatypebase64.replace('data:image/png;base64,', '');
  }

  /**
   *
   * @param examId
   * @returns a promise about all the questions of the exam
   */
  private getQuestions(examId: number): Promise<IQuestion[]> {
    return new Promise<IQuestion[]>(res => {
      this.questionService.query({ examId: +examId }).subscribe(data => {
        if (data.body !== null) {
          res(data.body);
        } else res([]);
      });
    });
  }

  public suite(examId: number, align: boolean): void {
    console.log('Click Suite');
    this.questionsAnswPNGs(examId, align).then(qas => console.log(qas));
  }

  public questionsAnswPNGs(examId: number, align: boolean): Promise<IQuestAnsw[]> {
    return new Promise<IQuestAnsw[]>(res => {
      this.getDataStudents(examId).then(dss => {
        console.log('Infos étudiants chargées');
        this.getQuestions(examId).then(questions => {
          console.log('Questions chargées');
          const promsQ: Promise<IStudAnswPic[]>[] = [];
          questions.forEach(q => {
            const promQ = this.pngQuestResp(examId, align, q, dss);
            promsQ.push(promQ);
          });
          Promise.all(promsQ).then(questResps => {
            const qas: IQuestAnsw[] = [];
            questResps.forEach(quest => {
              if (quest.length > 0) {
                const questId = quest[0].ansId;
                const studAns: { studId: number; answser: File[] }[] = [];
                quest.forEach(istudpic => {
                  studAns.push({ studId: istudpic.studId, answser: istudpic.answer });
                });
                const qa: IQuestAnsw = { questId, studAns };
                qas.push(qa);
              }
            });
            res(qas);
          });
        });
      });
    });
  }

  private pngQuestResp(examId: number, align: boolean, q: IQuestion, dss: DataStudent[]): Promise<IStudAnswPic[]> {
    return new Promise<IStudAnswPic[]>(res => {
      // const values : {studid :number,pageNum:number,imquest : File}[]= []
      this.zoneService.find(q.zoneId!).subscribe(dataZone => {
        // pour chaque zone associée à une question, on récupère la copie qui lui correspond, et on extraie l'image de cette zone
        this.pngsZoneSheets(dss, q, examId, align, dataZone.body!).then(studspics => {
          const promspics: IStudAnswPic[] = [];
          studspics.forEach(studpics => {
            if (studpics.answer.length > 0) {
              promspics.push(studpics);
            }
          });
          res(promspics);
        });
      });
    });
  }

  private pngsZoneSheets(dss: DataStudent[], q: IQuestion, examId: number, align: boolean, zone: IZone): Promise<IStudAnswPic[]> {
    return new Promise<IStudAnswPic[]>(res => {
      const promsPerPage: Promise<{ studid: number; pageNum: number; imquest: File }[]>[] = [];
      dss.forEach(ds => {
        const pzs = this.pngsZoneSheet(ds, q, examId, align, zone); // data par étudiant
        promsPerPage.push(pzs);
      });
      const promstudpics: Promise<IStudAnswPic>[] = [];
      promsPerPage.forEach(p => {
        const srps = this.studRepPerSheet(p, q.id!);
        promstudpics.push(srps);
      });
      Promise.all(promstudpics).then(studpics => res(studpics));
    });
  }

  // ne traite d'une partie des  données d'un seul étudiant
  private studRepPerSheet(p: Promise<{ studid: number; pageNum: number; imquest: File }[]>, questid: number): Promise<IStudAnswPic> {
    return new Promise<IStudAnswPic>(res => {
      p.then(infoptab => {
        this.promsOnePage(infoptab).then(stinfos => {
          const fs: File[] = [];
          let studentid = -1;
          stinfos.forEach(v => {
            // On gère le cas où au moins un fichier de capture n'a pas été trouvé (cela veut dire que l'étudiant ne participe pas à cet examen en particulier)
            if (v.imquest.name === 'nofile.png') studentid = -2;
            if (studentid !== -2) {
              fs.push(v.imquest);
              studentid = v.studid;
            }
          });
          const studrep: IStudAnswPic = { ansId: questid, answer: fs, studId: studentid };
          return res(studrep);
        });
      });
    });
  }

  private promsOnePage(
    infoptab: { studid: number; pageNum: number; imquest: File }[]
  ): Promise<{ studid: number; pageNum: number; imquest: File }[]> {
    return new Promise<{ studid: number; pageNum: number; imquest: File }[]>(res => {
      const promdatapage: { studid: number; pageNum: number; imquest: File }[] = [];
      infoptab.forEach(infop => {
        promdatapage.push(infop);
      });
      Promise.all(promdatapage).then(pagecontent => {
        res(pagecontent);
      });
    });
  }

  private pngsZoneSheet(
    ds: DataStudent,
    q: IQuestion,
    examId: number,
    align: boolean,
    zone: IZone
  ): Promise<{ studid: number; pageNum: number; imquest: File }[]> {
    return new Promise<{ studid: number; pageNum: number; imquest: File }[]>(res => {
      const promsZones: Promise<{ studid: number; pageNum: number; imquest: File }>[] = [];
      this.pngsSheetsQuest(ds, q, examId, align, zone).forEach(promPNG => {
        promsZones.push(promPNG);
      });
      Promise.all(promsZones).then(v => {
        res(v);
      });
    });
  }

  /**
   *
   * @param ds
   * @param q
   * @param examId
   * @param align
   * @param zone
   * @returns all the PNG that are associated to a specified zone
   */
  private pngsSheetsQuest(
    ds: DataStudent,
    q: IQuestion,
    examId: number,
    align: boolean,
    zone: IZone
  ): Promise<{ studid: number; pageNum: number; imquest: File }>[] {
    const promsCaptPNG: Promise<{ studid: number; pageNum: number; imquest: File }>[] = [];
    for (let i = ds.sheetInfos.pagemin!; i <= ds.sheetInfos.pagemax!; i++) {
      const psq = this.pngSheetQuest(
        examId,
        ds.student.id!,
        i,
        align,
        zone,
        'rep_stud_' + ds.student.id!.toString() + '_q_' + q.numero!.toString()
      );
      promsCaptPNG.push(psq);
    }
    return promsCaptPNG;
  }

  /**
   *
   * @param examId
   * @param studId
   * @param pageNumber
   * @param align
   * @param zone
   * @param nameFile
   * @returns the File of this zone, with the studId
   */
  private pngSheetQuest(
    examId: number,
    studId: number,
    pageNumber: number,
    align: boolean,
    zone: IZone,
    nameFile: string
  ): Promise<{ studid: number; pageNum: number; imquest: File }> {
    const prom = new Promise<{ studid: number; pageNum: number; imquest: File }>(res => {
      this.getZoneImage64(examId, pageNumber, align, zone).then(dataimage => {
        const fic = dataimage.length > 0 ? this.base64toPNG(this.base64root(dataimage), nameFile) : new File([], 'nofile.png');
        res({ studid: studId, pageNum: pageNumber, imquest: fic });
      });
    });
    return prom;
  }

  // TODO: à l'avenir, utiliser un service qui le fait (au lieu  de copier coller le code de corriger question.component )
  private getZoneImage64(examId: number, pageNumber: number, align: boolean, zone: IZone): Promise<string> {
    return new Promise<string>(res => {
      const images_alignment = align ? db.alignImages : db.nonAlignImages;
      images_alignment
        .where({ examId, pageNumber })
        .first()
        .then(algimg => {
          if (algimg === undefined) res('');
          else {
            const image = JSON.parse(algimg!.value);
            this.loadImage(image.pages, pageNumber).then(v => {
              let finalW = (zone.width! * v.width!) / 100000;
              let finalH = (zone.height! * v.height!) / 100000;
              let initX = (zone.xInit! * v.width!) / 100000 - ((zone.width! * v.width!) / 100000 - (zone.width! * v.width!) / 100000) / 2;
              if (initX < 0) {
                finalW = finalW + initX;
                initX = 0;
              }
              let initY =
                (zone.yInit! * v.height!) / 100000 - ((zone.height! * v.height!) / 100000 - (zone.height! * v.height!) / 100000) / 2;
              if (initY < 0) {
                finalH = finalH + initY;
                initY = 0;
              }
              // console.log(v)
              this.alignImagesService
                .imageCrop({
                  image: v.image,
                  x: initX,
                  y: initY,
                  width: finalW,
                  height: finalH,
                })
                .subscribe(imagedata => {
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  canvas.width = imagedata.width;
                  canvas.height = imagedata.height;
                  ctx?.putImageData(imagedata, 0, 0);
                  res(canvas.toDataURL());
                });
            });
          }
        });
    });
  }

  async loadImage(file: any, page1: number): Promise<IPage> {
    return new Promise(resolve => {
      const i = new Image();
      i.onload = () => {
        const editedImage: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
        editedImage.width = i.width;
        editedImage.height = i.height;
        const ctx = editedImage.getContext('2d');
        ctx!.drawImage(i, 0, 0);
        const inputimage = ctx!.getImageData(0, 0, i.width, i.height);
        resolve({ image: inputimage, page: page1, width: i.width, height: i.height });
      };
      i.src = file;
    });
  }

  private getDataStudents(examId: number): Promise<DataStudent[]> {
    console.log('Chargement données étudiant');
    return new Promise<DataStudent[]>(res => {
      const data: DataStudent[] = [];
      this.getStudentInfos(examId).then(students => {
        students.forEach(s => {
          s.examSheets?.forEach(sheet => {
            data.push({ student: s, sheetInfos: sheet });
          });
        });
      });
      res(data);
    });
  }

  private getCourseInfos(examId: number): Promise<IExam | null> {
    return new Promise<IExam | null>(res => {
      this.examService.find(+examId).subscribe(dataCourse => res(dataCourse.body));
    });
  }
  private getStudentInfos(examId: number): Promise<IStudent[]> {
    return new Promise<IStudent[]>(res => {
      this.getCourseInfos(examId).then(courseInfo => {
        if (courseInfo?.courseId !== undefined) {
          this.studentService.query({ courseId: courseInfo.courseId }).subscribe(studinfo => {
            if (studinfo.body !== null) {
              res(studinfo.body);
            } else {
              res([]);
            }
          });
        }
      });
    });
  }

  /* const questionBlob = this.b64toBlob(base64String, 'image/png');
   const questionFile =  new File([questionBlob], 'questionexam-' + this.currentExamId.toString() + '.png', { type: questionBlob.type });
   const formData = new FormData();
   formData.append('clientfile', questionFile);
   this.http.post('http://127.0.0.1:8000/question-assistant/' + 'uploadimage/', formData).subscribe(data=>{
     console.log(data)
   })
   // http://127.0.0.1:8000/question-assistant/*/

  // Stocke chaque zone de chaque copie

  private base64toPNG(base64str: string, imageName: string): File {
    const blobImg = this.b64toBlob(base64str, 'image/png');
    const png = new File([blobImg], imageName + '.png', { type: blobImg.type });
    return png;
  }

  sendTemplate(urlQuestionType: string, template64: string): Observable<any> {
    const templateBlob = this.b64toBlob(template64, 'application/pdf');
    const templateFile = new File([templateBlob], 'template-' + /* this.currentExamId.toString() +*/ '.pdf', { type: templateBlob.type });
    const formData = new FormData();
    formData.append('clientfile', templateFile);
    return this.http.post(urlQuestionType + 'uploadpdf/', formData);
  }

  private b64toBlob(b64Data: string, contentType: string): Blob {
    const byteCharacters = window.atob(b64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });
    return blob;
  }
}
export interface Page64 {
  id: number;
  pageNumber: number;
  base64String: string;
}

export interface DataStudent {
  student: IStudent;
  sheetInfos: ExamSheet;
}

// Pictures of a specfic student answser
export interface IStudAnswPic {
  ansId: number;
  studId: number;
  answer: File[];
}

// All of the student's anwsers to a specific question
export interface IQuestAnsw {
  questId: number;
  studAns: { studId: number; answser: File[] }[];
}
