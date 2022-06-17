import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISession } from '../../interfaces/session.interface';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-sessions-of-current-user',
  templateUrl: './sessions-of-current-user.component.html',
  styleUrls: ['./sessions-of-current-user.component.scss'],
})
export class SessionsOfCurrentUserComponent implements OnInit, OnDestroy {
  sessions: ISession[] = [];
  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessionService
      .getSessionsByCurrentUser()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((sessions) => {
        this.sessions = sessions;
      });
  }
}
