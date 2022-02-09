import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISession } from '../interfaces/session.interface';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';
import { Timer } from './timer.class';
import { ITimer } from './timer.interface';

@Component({
  selector: 'app-session-in-progress',
  templateUrl: './session-in-progress.component.html',
  styleUrls: ['./session-in-progress.component.scss']
})
export class SessionInProgressComponent implements OnInit, OnDestroy {

  session?: ISession;
  timer?: Timer;

  constructor(
    private activateRoute: ActivatedRoute,
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router
  ) { }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  initTimer() {
    try{
    this.timer = Timer.createWithEndDate(this.session!.end);
    } catch (err){
      alert('Этот сеанс уже закончен');
      this.router.navigate(['my-sessions']);
      return;
    }
    this.timer!.time$.pipe(takeUntil(this.onDestroy$)).subscribe({
      complete: () => {
        alert('Время сеанса вышло.');
        this.router.navigate(['my-sessions']);
      }
    })
    this.timer!.startTimer();
  }

  ngOnInit(): void {
    const sessionid: number = this.activateRoute.snapshot.params['id'];
    this.sessionService.getSessionById(sessionid).pipe(takeUntil(this.onDestroy$)).subscribe(
      session => {
        this.session = session;
        this.initTimer();
      }
    );
  }

  exitSession(): void{
    this.router.navigate(['my-sessions']);
  }
}
