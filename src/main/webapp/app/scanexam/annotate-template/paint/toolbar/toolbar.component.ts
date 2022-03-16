/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
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
  selected = this.eventService.selectedTool;

  constructor(private eventService: EventHandlerService) {}

  ngOnInit(): void {
    this.eventService.registerSelectedToolObserver(s => {
      this.selected = s;
    });
  }

  async select(tool: DrawingTools) {
    this.eventService.selectedTool = tool;
    this.selected = this.eventService.selectedTool;
  }
}
