import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import { EditSessionComponent } from '../edit-session/edit-session.component';
import { ISession } from '../interfaces/session.interface';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-sessions-management',
  templateUrl: './sessions-management.component.html',
  styleUrls: ['./sessions-management.component.scss']
})
export class SessionsManagementComponent implements OnInit {

  sessions: ISession[] = [];

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private modalService: NgbModal
  ) { }

    ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.sessionService.getSessionsByCreator(user.id).subscribe((sessions) => {
        this.sessions = sessions;
      });
    });
  }

  editSession(session: ISession): void{
    const modalRef = this.modalService.open(EditSessionComponent);
    (modalRef.componentInstance as EditSessionComponent).editedSession = session; 
  }
}
