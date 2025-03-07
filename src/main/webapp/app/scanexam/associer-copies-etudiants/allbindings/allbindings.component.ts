import { Component, OnInit } from '@angular/core';
import { IExamSheet } from 'app/entities/exam-sheet/exam-sheet.model';
import { IExam } from 'app/entities/exam/exam.model';
import { IStudent } from 'app/entities/student/student.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExamSheetService } from '../../../entities/exam-sheet/service/exam-sheet.service';
import { firstValueFrom } from 'rxjs';
import { StudentService } from 'app/entities/student/service/student.service';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateDirective } from '../../../shared/language/translate.directive';
import { NgIf, NgClass, DecimalPipe } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'jhi-allbindings',
  templateUrl: './allbindings.component.html',
  styleUrls: ['./allbindings.component.scss'],
  standalone: true,
  imports: [TableModule, PrimeTemplate, NgIf, TranslateDirective, NgClass, TooltipModule, DecimalPipe, TranslateModule],
})
export class AllbindingsComponent implements OnInit {
  students: any[] = [];
  exam!: IExam;
  nbreFeuilleParCopie!: number;
  columnstyle = { width: '75%' };
  showName = true;
  showFirstname = true;
  showIne = true;
  nobutton = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public sheetService: ExamSheetService,
    public studentService: StudentService,
  ) {}

  ngOnInit(): void {
    if (this.config.data?.exam) {
      this.exam = this.config.data.exam;
    }
    if (this.config.data?.nbreFeuilleParCopie) {
      this.nbreFeuilleParCopie = this.config.data.nbreFeuilleParCopie;
    }

    if (this.config.data?.students) {
      const students = this.config.data.students;
      students.forEach((s: any) => {
        if (s.nameImage) {
          s.nameImageImg = this.imagedata_to_image(s.nameImage);
        }
        if (s.firstnameImage) {
          s.firstnameImageImg = this.imagedata_to_image(s.firstnameImage);
        }
        if (s.ineImage) {
          s.ineImageImg = this.imagedata_to_image(s.ineImage);
        }
        s.recognizedStudentShow = s.recognizedStudent?.name + ' ' + s.recognizedStudent?.firstname + ' (' + s.recognizedStudent?.ine + ')';
        s.currentStudent = s.page / this.nbreFeuilleParCopie;
      });
      if (students.length > 0) {
        const imgs = [students[0].nameImage, students[0].firstnameImage, students[0].ineImage];
        this.showName = students[0].nameImage !== undefined;
        this.showFirstname = students[0].firstnameImage !== undefined;
        this.showIne = students[0].ineImage !== undefined;
        const length = imgs.filter(e => e !== undefined).length;
        //      console.error(length);
        if (length > 1) {
          this.columnstyle = { width: Math.floor(75 / length) + '%' };
        } else {
          this.columnstyle = { width: '75%' };
        }
      }

      students.sort((a: any, b: any) => b.predictionprecision - a.predictionprecision);

      this.students = students;
    }
  }

  imagedata_to_image(imagedata: ImageData): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx?.putImageData(imagedata, 0, 0);
    return canvas.toDataURL();
  }

  async bindStudentInternal(student: IStudent, currentStudent: number, element: any): Promise<void> {
    const examSheet4CurrentStudent1: IExamSheet[] = [
      ...new Set(this.students.filter(s => s.recognizedStudent !== undefined).flatMap(s => s.recognizedStudent.examSheets!)),
    ].filter(
      sh =>
        sh &&
        sh.pagemin === currentStudent * this.nbreFeuilleParCopie &&
        sh.pagemax === (currentStudent + 1) * this.nbreFeuilleParCopie - 1 &&
        sh.scanId === this.exam.scanfileId,
    );
    // ExamSheetExist
    if (examSheet4CurrentStudent1.length === 1) {
      const sheet = examSheet4CurrentStudent1[0];
      sheet.students = [student];
      await firstValueFrom(this.sheetService.updateStudents(sheet.id!, [student.id!]));
      element.bound = true;
    }
    // ExamSheetNotExist
    else {
      const sheets: IExamSheet[] | null = (
        await firstValueFrom(
          this.sheetService.query({
            scanId: this.exam.scanfileId,
            pagemin: currentStudent * this.nbreFeuilleParCopie,
            pagemax: (currentStudent + 1) * this.nbreFeuilleParCopie - 1,
          }),
        )
      ).body;
      if (sheets !== null && sheets.length === 1) {
        await firstValueFrom(this.sheetService.updateStudents(sheets[0].id!, [student.id!]));
        element.bound = true;
      }
    }
  }

  async bindAllStudent(element: any): Promise<void> {
    this.nobutton = true;
    const students = [...this.students.filter(s => s.predictionprecision >= element.predictionprecision)];
    students.sort((a: any, b: any) => b.predictionprecision - a.predictionprecision);
    for (const s of students) {
      try {
        if (s.bound === undefined || s.bound === false) {
          await this.bindStudentInternal(s.recognizedStudent, s.currentStudent, s);
        }
      } catch (e) {
        console.error('could not bind ', s.recognizedStudent, e);
      }
    }
    this.nobutton = false;
  }

  async bindStudent(student: IStudent, currentStudent: number, element: any): Promise<void> {
    this.nobutton = true;
    try {
      await this.bindStudentInternal(student, currentStudent, element);
    } catch (e) {
      console.error('could not bind ', student, e);
    }
    this.nobutton = false;
  }

  selectedColor(item: any): string {
    if (item.bound) {
      return 'text-green-400';
    } else {
      return '';
    } /* else {
      return 'text-red-400';
    }*/
  }
}
