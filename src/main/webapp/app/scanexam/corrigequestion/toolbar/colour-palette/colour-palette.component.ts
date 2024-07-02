/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component } from '@angular/core';
import { DrawingColours } from '../../../annotate-template/paint/models';
import { EventCanevascorrectionHandlerService } from 'app/scanexam/corrigequestion/event-canevascorrection-handler.service';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { NgFor, NgStyle, NgClass } from '@angular/common';
import { TranslateDirective } from '../../../../shared/language/translate.directive';

@Component({
  selector: 'jhi-colour-palette',
  templateUrl: './colour-palette.component.html',
  styleUrls: ['./colour-palette.component.scss'],
  standalone: true,
  imports: [TranslateDirective, NgFor, NgStyle, NgClass, TooltipModule, TranslateModule],
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
