import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatter'
})
export class DateFormatterPipe implements PipeTransform {

  transform(value: string | undefined): string {
    return value!.substring(0, 10) + ' \n' +  value!.substring(11, 16);

  }

}
