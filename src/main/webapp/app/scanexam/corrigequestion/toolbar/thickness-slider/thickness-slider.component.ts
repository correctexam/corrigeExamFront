import { Component } from '@angular/core';
import { DrawingThickness } from '../../../annotate-template/paint/models';
import { EventCanevascorrectionHandlerService } from 'app/scanexam/corrigequestion/event-canevascorrection-handler.service';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';

@Component({
  selector: 'jhi-thickness-slider',
  templateUrl: './thickness-slider.component.html',
  styleUrls: ['./thickness-slider.component.scss'],
  standalone: true,
  imports: [SliderModule, FormsModule, TooltipModule, TranslateDirective, TranslatePipe],
})
export class ThicknessSliderComponent {
  min = DrawingThickness.THIN;
  max = DrawingThickness.THICK;
  smallStep = 2;
  private v: DrawingThickness;
  get value(): DrawingThickness {
    return this.v;
  }
  set value(selected: DrawingThickness) {
    this.eventHandler.selectedThickness = selected;
    this.v = this.eventHandler.selectedThickness;
  }

  constructor(private eventHandler: EventCanevascorrectionHandlerService) {
    this.v = this.eventHandler.selectedThickness;
  }
}
