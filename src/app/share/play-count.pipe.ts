import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'playCount'
})
export class PlayCountPipe implements PipeTransform {
  transform(value: number): string | number {
    return value > 10000 ? Math.floor(value / 10000) + '万' : value;
  }
}
