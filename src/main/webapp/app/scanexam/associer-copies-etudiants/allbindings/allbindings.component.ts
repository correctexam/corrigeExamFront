import { Component, OnInit } from '@angular/core';
import { IExamSheet } from 'app/entities/exam-sheet/exam-sheet.model';
import { IExam } from 'app/entities/exam/exam.model';
import { IStudent } from 'app/entities/student/student.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExamSheetService } from '../../../entities/exam-sheet/service/exam-sheet.service';
import { firstValueFrom } from 'rxjs';
import { StudentService } from 'app/entities/student/service/student.service';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'jhi-allbindings',
  templateUrl: './allbindings.component.html',
  styleUrls: ['./allbindings.component.scss'],
})
export class AllbindingsComponent implements OnInit {
  students: any[] = [];
  exam!: IExam;
  nbreFeuilleParCopie!: number;
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
        s.nameImageImg = this.imagedata_to_image(s.nameImage);
        s.firstnameImageImg = this.imagedata_to_image(s.firstnameImage);
        s.ineImageImg = this.imagedata_to_image(s.ineImage);
        s.recognizedStudentShow = s.recognizedStudent?.name + ' ' + s.recognizedStudent?.firstname + ' (' + s.recognizedStudent?.ine + ')';
        s.currentStudent = s.page / this.nbreFeuilleParCopie;
      });
      this.students = students;
      console.error(this.students);
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

  async bindStudent(student: IStudent, currentStudent: number): Promise<void> {
    let examSheet4CurrentStudentId: (number | undefined)[] = [];
    if (student.examSheets) {
      examSheet4CurrentStudentId = student.examSheets.filter((ex: any) => ex?.scanId === this.exam.scanfileId).map(ex1 => ex1.id);
    }
    // Récupère la sheet courante.
    const examSheet4CurrentPage: IExamSheet[] = (
      this.students
        .filter(
          s =>
            s.examSheets?.some(
              (ex: any) => ex?.scanId === this.exam.scanfileId && ex.pagemin === currentStudent * this.nbreFeuilleParCopie,
            ),
        )
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .map(s => s.examSheets) as any
    ).flat();
    // Passe cette sheet à -1 -1. sémantique plus associé

    for (const ex of examSheet4CurrentPage.filter(ex2 => !examSheet4CurrentStudentId.includes(ex2.id))) {
      ex.pagemin = -1;
      ex.pagemax = -1;
      await firstValueFrom(this.sheetService.update(ex));
    }

    // Pour l'étudiant sélectionné. récupère la sheet. Si elle exite, on met à jour les bonnes pages sinon on crée la page.

    const examS4Student = student.examSheets?.filter((ex: IExamSheet) => ex.scanId === this.exam.scanfileId);
    if (examS4Student !== undefined && examS4Student.length > 0) {
      for (const ex of examS4Student) {
        ex.pagemin = currentStudent * this.nbreFeuilleParCopie;
        ex.pagemax = (currentStudent + 1) * this.nbreFeuilleParCopie - 1;
        await firstValueFrom(this.sheetService.update(ex));
      }
    } else {
      const sheet: IExamSheet = {
        name: uuid(),
        pagemin: currentStudent * this.nbreFeuilleParCopie,
        pagemax: (currentStudent + 1) * this.nbreFeuilleParCopie - 1,
        scanId: this.exam.scanfileId,
        students: [student],
      };
      const e = await firstValueFrom(this.sheetService.create(sheet));
      student.examSheets?.push(e.body!);
      await firstValueFrom(this.studentService.update(student));
    }
  }
}
