import { Component, Input } from '@angular/core';

import { Services } from 'app/admin/metrics/metrics.model';
import { NgIf, NgFor, DecimalPipe, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'jhi-metrics-endpoints-requests',
  templateUrl: './metrics-endpoints-requests.component.html',
  standalone: true,
  imports: [NgIf, NgFor, DecimalPipe, KeyValuePipe],
})
export class MetricsEndpointsRequestsComponent {
  /**
   * object containing service related metrics
   */
  @Input() endpointsRequestsMetrics?: Services;

  /**
   * boolean field saying if the metrics are in the process of being updated
   */
  @Input() updating?: boolean;
}
