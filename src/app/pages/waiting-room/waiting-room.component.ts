import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISession } from '../../interfaces/session.interface';
import { SessionService } from '../../services/session.service';
import { Timer } from '../../share-pipes/timer/timer.service';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent implements OnInit, OnDestroy {
  session?: ISession;
  timer?: Timer;

  constructor(
    private activateRoute: ActivatedRoute,
    private sessionService: SessionService,
    private router: Router
  ) {}

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  initTimer() {
    try {
      this.timer = Timer.createWithEndDate(this.session!.begin);
    } catch (err) {
      this.router.navigate(['session', this.session?.id]);
      return;
    }
    this.timer!.time$.pipe(takeUntil(this.onDestroy$)).subscribe({
      complete: () => {
        this.router.navigate(['session', this.session?.id]);
      },
    });
    this.timer!.startTimer();
  }

  ngOnInit(): void {
    const sessionid: number = this.activateRoute.snapshot.params['id'];
    this.sessionService
      .getSessionById(sessionid)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((session) => {
        this.session = session;
        this.initTimer();
      });
  }

  exitSession(): void {
    this.router.navigate(['my-sessions']);
  }
}
