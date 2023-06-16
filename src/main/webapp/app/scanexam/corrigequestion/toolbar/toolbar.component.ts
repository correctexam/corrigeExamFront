/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component } from '@angular/core';
import { faUserGraduate, faHashtag, faEraser, faHandPointer, faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import { DrawingTools } from 'app/scanexam/annotate-template/paint/models';
import { EventCanevascorrectionHandlerService } from '../event-canevascorrection-handler.service';

@Component({
  selector: 'jhi-graphical-toolbarcorrection',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class GraphicalToolbarCorrectionComponent {
  faNote = faUserGraduate;
  faHashtagLock = faHashtag;
  faEraser = faEraser;
  faHandPointer = faHandPointer;
  faTrash = faTrash;
  faPencil = faPencil;

  DrawingTools = DrawingTools;
  selected: DrawingTools;

  constructor(private eventService: EventCanevascorrectionHandlerService) {
    this.selected = this.eventService.selectedTool;
  }

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
