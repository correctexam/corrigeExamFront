import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ITemplate } from '../template.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertErrorComponent } from '../../../shared/alert/alert-error.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'jhi-template-detail',
  templateUrl: './template-detail.component.html',
  standalone: true,
  imports: [NgIf, AlertErrorComponent, AlertComponent, FaIconComponent, RouterLink],
})
export class TemplateDetailComponent implements OnInit {
  template: ITemplate | null = null;

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ template }) => {
      this.template = template;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
