import { Component, Input } from '@angular/core';
import { IExam } from '../../../entities/exam/exam.model';
import { Subject } from 'rxjs';
import { EventHandlerService } from './event-handler.service';

@Component({
  selector: 'jhi-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.scss'],
})
export class PaintComponent {
  @Input()
  content: any;
  @Input()
  exam?: IExam;

  numero = new Subject<string>();

  constructor(public eventHandlerService: EventHandlerService) {}

  previousState(): void {
    window.history.back();
  }

  updateNumero(numero: string): void {
    this.numero.next(numero);
  }
}
