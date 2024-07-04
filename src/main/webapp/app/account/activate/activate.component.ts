import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { mergeMap } from 'rxjs/operators';

import { ActivateService } from './activate.service';
import { NgIf } from '@angular/common';
import { TranslateDirective } from '../../shared/language/translate.directive';

@Component({
  selector: 'jhi-activate',
  templateUrl: './activate.component.html',
  standalone: true,
  imports: [TranslateDirective, NgIf, RouterLink],
})
export class ActivateComponent implements OnInit {
  error = false;
  success = false;

  constructor(
    private activateService: ActivateService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(mergeMap(params => this.activateService.get(params.key))).subscribe({
      next: () => (this.success = true),
      error: () => (this.error = true),
    });
  }
}
