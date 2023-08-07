import {Pipe, PipeTransform} from '@angular/core';
import {formatDateTime} from './date-utils';

@Pipe({
  name: 'psmFormatDateTime'
})
export class PsmFormatDateTimePipe implements PipeTransform {
  transform(date: Date | null | undefined, part? : 'date' | 'time'): string {
    return formatDateTime(date, part);
  }
}
