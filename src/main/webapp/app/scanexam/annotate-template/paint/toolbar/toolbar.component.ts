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
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { EventHandlerService } from '../event-handler.service';
import { DrawingTools } from '../models';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { TranslateDirective } from '../../../../shared/language/translate.directive';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'jhi-graphical-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [ConfirmDialogModule, PrimeTemplate, TranslateDirective, ButtonDirective, NgClass, FaIconComponent, TranslateModule],
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
  selected: DrawingTools;

  constructor(
    private eventService: EventHandlerService,
    private confirmationService: ConfirmationService,
    public translateService: TranslateService,
  ) {
    this.selected = this.eventService.selectedTool;
  }

  ngOnInit(): void {
    this.selected = DrawingTools.SELECT;
    this.eventService.registerSelectedToolObserver(s => {
      this.selected = s;
    });
    this.eventService.setConfirmationService(this.confirmationService);
  }

  select(tool: DrawingTools) {
    this.eventService.selectedTool = tool;
    this.selected = this.eventService.selectedTool;
  }
}
