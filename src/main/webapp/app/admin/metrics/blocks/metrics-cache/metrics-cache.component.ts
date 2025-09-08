import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CacheMetrics } from 'app/admin/metrics/metrics.model';
import { filterNaN } from 'app/core/util/operators';
import { DecimalPipe, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'jhi-metrics-cache',
  templateUrl: './metrics-cache.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DecimalPipe, KeyValuePipe],
})
export class MetricsCacheComponent {
  /**
   * object containing all cache related metrics
   */
  @Input() cacheMetrics?: { [key: string]: CacheMetrics };

  /**
   * boolean field saying if the metrics are in the process of being updated
   */
  @Input() updating?: boolean;

  filterNaN = (input: number): number => filterNaN(input);
}
