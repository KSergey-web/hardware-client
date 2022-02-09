import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditSessionComponent } from '../edit-session/edit-session.component';
import { ISession } from '../interfaces/session.interface';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-sessions-of-current-user',
  templateUrl: './sessions-of-current-user.component.html',
  styleUrls: ['./sessions-of-current-user.component.scss'],
})
export class SessionsOfCurrentUserComponent implements OnInit {
  sessions: ISession[] = [];

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.sessionService.getSessionsByUser(user.id).subscribe((sessions) => {
        this.sessions = sessions;
      });
    });
  }
}
