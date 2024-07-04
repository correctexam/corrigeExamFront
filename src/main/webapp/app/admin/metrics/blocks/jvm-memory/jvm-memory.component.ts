import { Component, Input } from '@angular/core';

import { JvmMetrics } from 'app/admin/metrics/metrics.model';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, DecimalPipe, KeyValuePipe } from '@angular/common';
import { TranslateDirective } from '../../../../shared/language/translate.directive';

@Component({
  selector: 'jhi-jvm-memory',
  templateUrl: './jvm-memory.component.html',
  standalone: true,
  imports: [TranslateDirective, NgIf, NgFor, NgbProgressbar, DecimalPipe, KeyValuePipe],
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
