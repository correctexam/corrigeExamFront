/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'jhi-partial-align-modal',
  templateUrl: './partial-align-modal.component.html',
  styleUrls: ['./partial-align-modal.component.scss'],
})
export class PartialAlignModalComponent implements OnInit {
  startPage = 1;
  endPage = 1;
  showmapping = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {}

  ngOnInit(): void {}

  process(): void {
    this.ref.close({
      startPage: this.startPage,
      endPage: this.endPage,
      showmapping: this.showmapping,
    });
  }
}
