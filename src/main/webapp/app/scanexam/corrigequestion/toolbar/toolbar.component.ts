/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component } from '@angular/core';
import { faUserGraduate, faHashtag, faEraser, faHandPointer, faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import { DrawingTools } from 'app/scanexam/annotate-template/paint/models';
import { EventCanevascorrectionHandlerService } from '../event-canevascorrection-handler.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';

@Component({
  selector: 'jhi-graphical-toolbarcorrection',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [NgClass, FaIconComponent, TranslateModule],
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

  constructor(
    private eventService: EventCanevascorrectionHandlerService,
    private confirmationService: ConfirmationService,
  ) {
    this.selected = this.eventService.selectedTool;
  }

  ngOnInit(): void {
    this.eventService.registerSelectedToolObserver(s => {
      this.selected = s;
    });
    this.eventService.setConfirmationService(this.confirmationService);
  }

  async select(tool: DrawingTools) {
    this.eventService.selectedTool = tool;
    this.selected = this.eventService.selectedTool;
  }
}
