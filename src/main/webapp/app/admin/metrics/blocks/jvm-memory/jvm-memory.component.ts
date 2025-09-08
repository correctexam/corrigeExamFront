import { Component, Input } from '@angular/core';

import { JvmMetrics } from 'app/admin/metrics/metrics.model';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'jhi-jvm-memory',
  templateUrl: './jvm-memory.component.html',
  standalone: true,
  imports: [NgbProgressbar, DecimalPipe, KeyValuePipe],
})
export class JvmMemoryComponent {
  /**
   * object containing all jvm memory metrics
   */
  @Input() jvmMemoryMetrics?: { [key: string]: JvmMetrics };

  /**
   * boolean field saying if the metrics are in the process of being updated
   */
  @Input() updating?: boolean;
}
