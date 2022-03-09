import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITemplate } from '../template.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-template-detail',
  templateUrl: './template-detail.component.html',
})
export class TemplateDetailComponent implements OnInit {
  template: ITemplate | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

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
