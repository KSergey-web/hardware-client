import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements OnInit, OnDestroy {
  logs: string[] = [];

  @Input() onLog$?: Subject<string>;
  @ViewChild('console', { static: false })
  private console: ElementRef | undefined;

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    if (!this.onLog$) throw Error('onLog is undefined');
    this.onLog$.pipe(takeUntil(this.onDestroy$)).subscribe((log) => {
      this.logs.push(log);
      this.console!.nativeElement.scrollTop =
        this.console!.nativeElement.scrollHeight;
    });
  }
}
