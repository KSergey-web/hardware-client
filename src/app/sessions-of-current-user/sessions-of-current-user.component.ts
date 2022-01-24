import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ISession } from '../interfaces/session.interface';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-sessions-of-current-user',
  templateUrl: './sessions-of-current-user.component.html',
  styleUrls: ['./sessions-of-current-user.component.scss']
})
export class SessionsOfCurrentUserComponent implements OnInit {

  sessions: ISession[] = [];

  constructor(
    private sessionService: SessionService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.sessionService.getSessionsByUser(user.id).subscribe(sessions => {
        this.sessions = sessions;
      });
    })
  }
}
