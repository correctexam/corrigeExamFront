/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component } from '@angular/core';
import { DrawingColours } from '../../../annotate-template/paint/models';
import { EventCanevascorrectionHandlerService } from 'app/scanexam/corrigequestion/event-canevascorrection-handler.service';

@Component({
  selector: 'jhi-colour-palette',
  templateUrl: './colour-palette.component.html',
  styleUrls: ['./colour-palette.component.scss'],
})
export class ColourPaletteComponent {
  public colours = Object.values(DrawingColours);
  public selectedColour: DrawingColours;

  constructor(private fabricService: EventCanevascorrectionHandlerService) {
    this.selectedColour = fabricService.selectedColour;
  }

  onSelect(colour: DrawingColours) {
    this.fabricService.selectedColour = colour;
    this.selectedColour = this.fabricService.selectedColour;
  }
}
