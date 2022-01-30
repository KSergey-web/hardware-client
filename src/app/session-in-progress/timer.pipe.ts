import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { ITimer } from './timer.interface';

@Pipe({
    name: 'timer'
})
export class TimerPipe implements PipeTransform {
    transform(value: ITimer | null, args?: any): string {
        if (!value) return 'Error time';
        const h = ('0' + value.hours).slice(-2);
        const m = ('0' + value.minutes).slice(-2);
        const s = ('0' + value.seconds).slice(-2);
        return h + ':' + m + ':' + s;
    }
}

