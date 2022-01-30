import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';
import { AuthService } from '../auth.service';
import { ISession } from '../interfaces/session.interface';
import { SessionService } from '../session.service';
import { Timer } from './timer.class';
import { ITimer } from './timer.interface';

@Component({
  selector: 'app-session-in-progress',
  templateUrl: './session-in-progress.component.html',
  styleUrls: ['./session-in-progress.component.scss']
})
export class SessionInProgressComponent implements OnInit {

  session?: ISession;
  timer?: Timer;

  constructor(
    private activateRoute: ActivatedRoute,
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router
  ) { }

  initTimer() {
    try{
    this.timer = Timer.createWithEndDate(this.session!.end);
    } catch (err){
      alert('Этот сеанс уже закончен');
      this.router.navigate(['my-sessions']);
      return;
    }
    this.timer!.time$.subscribe({
      complete: () => {
        alert('Время сеанса вышло.');
        this.router.navigate(['my-sessions']);
      }
    })
    this.timer!.startTimer();
  }

  ngOnInit(): void {
    const sessionid: number = this.activateRoute.snapshot.params['id'];
    this.sessionService.getSessionById(sessionid).subscribe(
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
