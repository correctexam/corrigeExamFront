/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component } from '@angular/core';
import { EventHandlerService } from '../event-handler.service';
import { DrawingTools } from '../models';

@Component({
  selector: 'jhi-graphical-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class GraphicalToolbarComponent {
  DrawingTools = DrawingTools;
  selected = this.fabricService.selectedTool;

  constructor(private fabricService: EventHandlerService) {}

  async select(tool: DrawingTools) {
    this.fabricService.selectedTool = tool;
    this.selected = this.fabricService.selectedTool;
  }
}
