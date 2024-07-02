import { Component, Input } from '@angular/core';

import { GarbageCollector } from 'app/admin/metrics/metrics.model';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, DecimalPipe } from '@angular/common';
import { TranslateDirective } from '../../../../shared/language/translate.directive';

@Component({
  selector: 'jhi-metrics-garbagecollector',
  templateUrl: './metrics-garbagecollector.component.html',
  standalone: true,
  imports: [TranslateDirective, NgIf, NgbProgressbar, DecimalPipe],
})
export class MetricsGarbageCollectorComponent {
  /**
   * object containing garbage collector related metrics
   */
  @Input() garbageCollectorMetrics?: GarbageCollector;

  /**
   * boolean field saying if the metrics are in the process of being updated
   */
  @Input() updating?: boolean;
}
