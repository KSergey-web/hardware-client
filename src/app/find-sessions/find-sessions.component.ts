import { ThisReceiver } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IEquipment } from '../interfaces/equipment.interface';
import { ISession } from '../interfaces/session.interface';
import { AuthService } from '../services/auth.service';
import { EquipmentService } from '../services/equipment.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-find-sessions',
  templateUrl: './find-sessions.component.html',
  styleUrls: ['./find-sessions.component.scss'],
})
export class FindSessionsComponent implements OnInit, OnDestroy {
  sessions: ISession[] = [];

  sourceSessions: ISession[] = [];

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router
  ) {}

  getSessions(): void {
    this.sessionService
      .getNearestSessions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((sessions) => {
        this.sessions = sessions;
        this.sourceSessions = sessions;
      });
  }

  connectToSession(sessionid: number): void {
    this.router.navigate(['waiting-room', sessionid]);
  }

  ngOnInit(): void {
    this.getSessions();
  }

  filterByCreatorCurrentUser(event: any) {
    if (event.target.checked) {
      this.sessions = this.sourceSessions.filter(
        (session) => session.creator?.id === this.authService.currentUser?.id
      );
    } else {
      this.sessions = this.sourceSessions;
    }
  }
}
