/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component } from '@angular/core';
import { EventHandlerService } from '../../event-handler.service';
import { DrawingColours } from '../../models';

@Component({
  selector: 'jhi-colour-palette',
  templateUrl: './colour-palette.component.html',
  styleUrls: ['./colour-palette.component.scss'],
})
export class ColourPaletteComponent {
  public colours = Object.values(DrawingColours);
  public selectedColour: DrawingColours;

  constructor(private fabricService: EventHandlerService) {
    this.selectedColour = fabricService.selectedColour;
  }

  onSelect(colour: DrawingColours) {
    this.fabricService.selectedColour = colour;
    this.selectedColour = this.fabricService.selectedColour;
  }
}
