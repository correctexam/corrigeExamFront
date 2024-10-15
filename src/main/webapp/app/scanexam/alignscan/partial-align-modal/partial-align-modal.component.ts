import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { TranslateDirective } from '../../../shared/language/translate.directive';

@Component({
  selector: 'jhi-partial-align-modal',
  templateUrl: './partial-align-modal.component.html',
  styleUrls: ['./partial-align-modal.component.scss'],
  standalone: true,
  imports: [TranslateDirective, InputNumberModule, FormsModule, CheckboxModule, TooltipModule, TranslateModule],
})
export class PartialAlignModalComponent implements OnInit {
  startPage = 1;
  endPage = 1;
  showmapping = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {}

  ngOnInit(): void {
    if (this.config.data?.startPage) {
      this.startPage = this.config.data.startPage;
    }
    if (this.config.data?.endPage) {
      this.endPage = this.config.data.endPage;
    }
  }

  process(): void {
    this.ref.close({
      startPage: this.startPage,
      endPage: this.endPage,
      showmapping: this.showmapping,
    });
  }
}
