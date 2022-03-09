import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IZone } from '../zone.model';

@Component({
  selector: 'jhi-zone-detail',
  templateUrl: './zone-detail.component.html',
})
export class ZoneDetailComponent implements OnInit {
  zone: IZone | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ zone }) => {
      this.zone = zone;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
