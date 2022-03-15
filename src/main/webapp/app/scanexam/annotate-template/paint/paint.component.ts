import { Component, Input } from '@angular/core';

@Component({
  selector: 'jhi-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.scss'],
})
export class PaintComponent {
  @Input()
  content: any;
}
