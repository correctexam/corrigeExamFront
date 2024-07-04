import { Component } from '@angular/core';
import { EventCanevascorrectionHandlerService } from 'app/scanexam/corrigequestion/event-canevascorrection-handler.service';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { TranslateDirective } from '../../../../shared/language/translate.directive';

@Component({
  selector: 'jhi-fontsize-slider',
  templateUrl: './fontsize-slider.component.html',
  styleUrls: ['./fontsize-slider.component.scss'],
  standalone: true,
  imports: [TranslateDirective, SliderModule, FormsModule, TooltipModule, TranslateModule],
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
