import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFinalResult } from '../final-result.model';

@Component({
  selector: 'jhi-final-result-detail',
  templateUrl: './final-result-detail.component.html',
})
export class FinalResultDetailComponent implements OnInit {
  finalResult: IFinalResult | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ finalResult }) => {
      this.finalResult = finalResult;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
