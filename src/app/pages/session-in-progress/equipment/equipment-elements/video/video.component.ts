import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, OnDestroy {
  @Input()
  stream_url?: string;
  constructor() {}

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    // fromEvent(window, 'focus')
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe(this.reset.bind(this));
  }

  visible = true;

  reset() {
    this.visible = false;
    setTimeout(() => (this.visible = true));
  }
}
