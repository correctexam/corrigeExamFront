import { Component, OnDestroy, OnInit } from '@angular/core';

import { AlertService, Alert } from 'app/core/util/alert.service';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'jhi-alert',
  templateUrl: './alert.component.html',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, NgbAlert],
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alerts = this.alertService.get();
  }

  setClasses(alert: Alert): { [key: string]: boolean } {
    const classes = { 'jhi-toast': Boolean(alert.toast) };
    if (alert.position) {
      return { ...classes, [alert.position]: true };
    }
    return classes;
  }

  ngOnDestroy(): void {
    this.alertService.clear();
  }

  close(alert: Alert): void {
    alert.close?.(this.alerts);
  }
}
