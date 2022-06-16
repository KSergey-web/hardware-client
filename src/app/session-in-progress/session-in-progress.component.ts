import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISession } from '../interfaces/session.interface';
import { SessionService } from '../services/session.service';
import { SessionInProgressService } from './session-in-progress.service';

import { Timer } from '../share/timer/timer.service';

@Component({
  selector: 'app-session-in-progress',
  templateUrl: './session-in-progress.component.html',
  styleUrls: ['./session-in-progress.component.scss'],
})
export class SessionInProgressComponent implements OnInit, OnDestroy {
  session?: ISession;
  timer?: Timer;

  isConnectedToSession = false;

  onConnected() {
    this.isConnectedToSession = true;
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private sessionService: SessionService,
    private router: Router,
    private sessionInProgressService: SessionInProgressService
  ) {}

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  initTimer() {
    try {
      this.timer = Timer.createWithEndDate(this.session!.end);
    } catch (err) {
      alert('Этот сеанс уже закончен');
      this.router.navigate(['my-sessions']);
      return;
    }
    this.timer!.time$.pipe(takeUntil(this.onDestroy$)).subscribe({
      complete: () => {
        if (this.timer?.isFinished) {
          alert('Время сеанса вышло.');
        }
        this.router.navigate(['my-sessions']);
      },
    });
    this.timer!.startTimer();
  }

  private getSession() {
    const sessionid: number = this.activateRoute.snapshot.params['id'];
    this.sessionService
      .getSessionById(sessionid)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((session) => {
        this.session = session;
        this.sessionInProgressService.sessionId = session?.id;
        this.initTimer();
      });
  }

  ngOnInit(): void {
    this.getSession();
  }

  exitSession(): void {
    this.router.navigate(['my-sessions']);
  }
}
