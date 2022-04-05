import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EditSessionComponent } from '../edit-session/edit-session.component';
import { ISession } from '../interfaces/session.interface';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';

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

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((user) => {
        console.log(user);
        this.sessionService
          .getSessionsByUser(user.id)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((sessions) => {
            this.sessions = sessions;
          });
      });
  }
}
