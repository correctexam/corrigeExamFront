/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component } from '@angular/core';
import {
  faFileSignature,
  faQuestion,
  faSignature,
  faUserGraduate,
  faHashtag,
  faEraser,
  faHandPointer,
  faTrash,
  faPencil,
} from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { EventHandlerService } from '../event-handler.service';
import { DrawingTools } from '../models';

@Component({
  selector: 'jhi-graphical-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class GraphicalToolbarComponent {
  faNom = faFileSignature;
  faPrenom = faSignature;
  faQuestion = faQuestion;
  faNote = faUserGraduate;
  faHashtagLock = faHashtag;
  faEraser = faEraser;
  faHandPointer = faHandPointer;
  faTrash = faTrash;
  faPencil = faPencil;
  DrawingTools = DrawingTools;
  selected = this.eventService.selectedTool;

  constructor(
    private eventService: EventHandlerService,
    private confirmationService: ConfirmationService,
    public translateService: TranslateService
  ) {}

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
