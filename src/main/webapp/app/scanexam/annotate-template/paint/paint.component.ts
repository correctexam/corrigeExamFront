import { Component, Input } from '@angular/core';
import { IExam } from '../../../entities/exam/exam.model';

@Component({
  selector: 'jhi-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.scss'],
})
export class PaintComponent {
  @Input()
  content: any;
  @Input()
  exam!: IExam;
}
