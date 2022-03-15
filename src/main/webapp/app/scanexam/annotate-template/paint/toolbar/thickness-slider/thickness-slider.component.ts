import { Component } from '@angular/core';
import { EventHandlerService } from '../../event-handler.service';
import { DrawingThickness } from '../../models';

@Component({
  selector: 'jhi-thickness-slider',
  templateUrl: './thickness-slider.component.html',
  styleUrls: ['./thickness-slider.component.scss'],
})
export class ThicknessSliderComponent {
  min = DrawingThickness.THIN;
  max = DrawingThickness.THICK;
  smallStep = 2;
  private v = this.eventHandler.selectedThickness;
  get value(): DrawingThickness {
    return this.v;
  }
  set value(selected: DrawingThickness) {
    this.eventHandler.selectedThickness = selected;
    this.v = this.eventHandler.selectedThickness;
  }

  constructor(private eventHandler: EventHandlerService) {}
}
