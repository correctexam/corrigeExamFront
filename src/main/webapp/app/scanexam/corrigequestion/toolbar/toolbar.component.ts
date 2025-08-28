/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component } from '@angular/core';
import { faUserGraduate, faHashtag, faEraser, faHandPointer, faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import { DrawingTools } from 'app/scanexam/annotate-template/paint/models';
import { EventCanevascorrectionHandlerService } from '../event-canevascorrection-handler.service';
import { ConfirmationService } from 'primeng/api';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { KeyValuePipe, NgClass, NgFor } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustomSvgIconLoaderComponent } from '../customsvgiconloader/customsvgiconloader.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PreferenceService } from '../../preference-page/preference.service';

@Component({
  selector: 'jhi-graphical-toolbarcorrection',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [NgClass, FaIconComponent, TranslatePipe, NgFor, KeyValuePipe],
  providers: [DialogService, TranslateService],
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

  svgdialog: DynamicDialogRef | undefined;

  customcomments: Map<string, string> = new Map();

  constructor(
    public eventService: EventCanevascorrectionHandlerService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private _sanitizer: DomSanitizer,
    private pref: PreferenceService,
    private translate: TranslateService,
  ) {
    this.selected = this.eventService.selectedTool;
  }

  ngOnInit(): void {
    this.eventService.registerSelectedToolObserver(s => {
      this.selected = s;
    });
    this.customcomments = this.pref.getAllDefaultSVGCustomComments();
    this.eventService.setConfirmationService(this.confirmationService);
  }

  showSVGDialog(): any {
    this.translate.get('scanexam.svgdialogtitle').subscribe(tit => {
      this.svgdialog = this.dialogService.open(CustomSvgIconLoaderComponent, {
        header: tit,
        width: '70%',
        height: '90vh',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        closable: true,
      });
      this.svgdialog.onClose.subscribe((svgicons: any) => {
        this.customcomments = this.pref.getAllDefaultSVGCustomComments();

        if (svgicons) {
          //   this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.name });
        }
      });
    });
  }

  async select(tool: DrawingTools) {
    this.eventService.selectedTool = tool;
    this.selected = this.eventService.selectedTool;
    if (tool !== DrawingTools.CUSTOMSVG) {
      this.eventService.svgselect = '';
    }
  }
  selectSVG(s: string) {
    this.select(DrawingTools.CUSTOMSVG);
    this.eventService.svgselect = s;
  }

  getSVGImageUrl(image: string): SafeResourceUrl {
    const base64string = btoa(image);
    return this._sanitizer.bypassSecurityTrustResourceUrl(`data:image/svg+xml;base64,${base64string}`);
  }
}
