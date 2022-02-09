import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EditSessionComponent } from '../edit-session/edit-session.component';
import { ISession } from '../interfaces/session.interface';
import { NewSessionComponent } from '../new-session/new-session.component';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-sessions-management',
  templateUrl: './sessions-management.component.html',
  styleUrls: ['./sessions-management.component.scss']
})
export class SessionsManagementComponent implements OnInit, OnDestroy {

  sessions: ISession[] = [];

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private modalService: NgbModal
  ) { }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    this.getSessions();
  }

  private getSessions() {
    this.authService.currentUser$.pipe(takeUntil(this.onDestroy$)).subscribe((user) => {
      this.sessionService.getSessionsByCreator(user.id).pipe(takeUntil(this.onDestroy$)).subscribe((sessions) => {
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
    this.sessionService.deleteSession(session).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
      this.getSessions()
    }, err => {
      console.error(err);
      alert(`Не удалось удалить сессию`)
    })
  }
}
