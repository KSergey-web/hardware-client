import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import { EditSessionComponent } from '../edit-session/edit-session.component';
import { ISession } from '../interfaces/session.interface';
import { NewSessionComponent } from '../new-session/new-session.component';
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
    this.getSessions();
  }

  private getSessions() {
    this.authService.currentUser$.subscribe((user) => {
      this.sessionService.getSessionsByCreator(user.id).subscribe((sessions) => {
        this.sessions = sessions;
      });
    });
  }

  editSession(session: ISession): void {
    const modalRef = this.modalService.open(EditSessionComponent);
    (modalRef.componentInstance as EditSessionComponent).editedSession = session;
    this.performResultModal(modalRef);
  }

  private performResultModal(modalRef: NgbModalRef): void {
    modalRef.result.then((result) => {
      this.getSessions();
    }, (reason) => {
      this.outDismissReason(reason);
    });
  }


  createNewSession() {
    const modalRef = this.modalService.open(NewSessionComponent);
    this.performResultModal(modalRef);
  }



  private outDismissReason(reason: any): void {
    if (reason === ModalDismissReasons.ESC) {
      'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      'by clicking on a backdrop';
    } else {
      console.error(`with: ${reason}`);
    }
  }

  deleteSession($event: MouseEvent,session: ISession): void{
    $event.stopPropagation();
    this.sessionService.deleteSession(session).subscribe(res => {
      this.getSessions()
    }, err => {
      console.error(err);
      alert(`Не удалось удалить сессию`)
    })
  }
}
