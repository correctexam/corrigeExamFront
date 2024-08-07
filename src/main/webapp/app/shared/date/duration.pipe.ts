import { Pipe, PipeTransform } from '@angular/core';

import dayjs from 'dayjs';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(value: any): string {
    if (value) {
      return dayjs.duration(value).humanize();
    }
    return '';
  }
}
