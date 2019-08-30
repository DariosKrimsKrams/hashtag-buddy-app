import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse',
  // pure: false
})

export class ReversePipe implements PipeTransform {
  public transform(value): void {
    return value.slice().reverse();
  }
}