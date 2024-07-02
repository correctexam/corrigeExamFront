import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HttpServerRequests } from 'app/admin/metrics/metrics.model';
import { filterNaN } from 'app/core/util/operators';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, DecimalPipe, KeyValuePipe } from '@angular/common';
import { TranslateDirective } from '../../../../shared/language/translate.directive';

@Component({
  selector: 'jhi-metrics-request',
  templateUrl: './metrics-request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslateDirective, NgIf, NgFor, NgbProgressbar, DecimalPipe, KeyValuePipe],
})
export class MetricsRequestComponent {
  /**
   * object containing http request related metrics
   */
  @Input() requestMetrics?: HttpServerRequests;

  /**
   * boolean field saying if the metrics are in the process of being updated
   */
  @Input() updating?: boolean;

  filterNaN = (input: number): number => filterNaN(input);
}
