import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CacheMetrics } from 'app/admin/metrics/metrics.model';
import { filterNaN } from 'app/core/util/operators';
import { NgIf, NgFor, DecimalPipe, KeyValuePipe } from '@angular/common';
import { TranslateDirective } from '../../../../shared/language/translate.directive';

@Component({
  selector: 'jhi-metrics-cache',
  templateUrl: './metrics-cache.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslateDirective, NgIf, NgFor, DecimalPipe, KeyValuePipe],
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
