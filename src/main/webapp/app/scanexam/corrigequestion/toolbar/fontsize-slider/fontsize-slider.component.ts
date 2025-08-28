import { Component } from '@angular/core';
import { EventCanevascorrectionHandlerService } from 'app/scanexam/corrigequestion/event-canevascorrection-handler.service';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';

@Component({
  selector: 'jhi-fontsize-slider',
  templateUrl: './fontsize-slider.component.html',
  styleUrls: ['./fontsize-slider.component.scss'],
  standalone: true,
  imports: [SliderModule, FormsModule, TooltipModule, TranslateDirective, TranslatePipe],
})
export class FontsizeSliderComponent {
  min = 15;
  max = 50;
  smallStep = 5;
  private v: number;
  get value(): number {
    return this.v;
  }
  set value(selected: number) {
    this.eventHandler.selectedFontsize = selected;
    this.v = this.eventHandler.selectedFontsize;
  }

  constructor(private eventHandler: EventCanevascorrectionHandlerService) {
    this.v = this.eventHandler.selectedFontsize;
  }
}
