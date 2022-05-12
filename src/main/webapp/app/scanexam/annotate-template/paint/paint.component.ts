import { Component, Input } from '@angular/core';
import { IExam } from '../../../entities/exam/exam.model';
import { Subject } from 'rxjs';

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

  numero = new Subject<string>();

  previousState(): void {
    window.history.back();
  }

  updateNumero(numero: string): void {
    // eslint-disable-next-line no-console
    this.numero.next(numero);
  }
}
