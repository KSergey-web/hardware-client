import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISession } from '../../interfaces/session.interface';
import { SessionService } from '../../services/session.service';
import { EditSessionComponent } from './edit-session/edit-session.component';
import { NewSessionComponent } from './new-session/new-session.component';

@Component({
  selector: 'app-sessions-management',
  templateUrl: './sessions-management.component.html',
  styleUrls: ['./sessions-management.component.scss'],
})
export class SessionsManagementComponent implements OnInit, OnDestroy {
  sessions: ISession[] = [];
  currentPage: number = 1;
  selectedPage: number = 1;
  pageCount: number = 1;
  totalCount: number = 0;

  constructor(
    private sessionService: SessionService,
    private modalService: NgbModal
  ) {}

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    this.getSessions();
  }

  onChangePage(): void {
    if (this.selectedPage == this.currentPage) return;
    this.currentPage = this.selectedPage;
    this.getSessions();
  }

  private getSessions() {
    this.sessionService
      .getSessionsByCurrentCreator(this.selectedPage)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res) => {
        this.sessions = res.sessions;
        this.currentPage = res.pagination?.page ?? 1;
        this.pageCount = res.pagination?.pageCount ?? 1;
        this.totalCount = res.pagination?.total ?? 0;
      });
  }

  editSession(session: ISession): void {
    const modalRef = this.modalService.open(EditSessionComponent, {
      size: 'lg',
    });
    (modalRef.componentInstance as EditSessionComponent).editedSession =
      session;
    this.performResultModal(modalRef);
  }

  private performResultModal(modalRef: NgbModalRef): void {
    modalRef.result.then(
      (result) => {
        this.getSessions();
      },
      (reason) => {
        this.outDismissReason(reason);
      }
    );
  }

  createNewSession() {
    const modalRef = this.modalService.open(NewSessionComponent, {
      size: 'lg',
    });
    this.performResultModal(modalRef);
  }

  private outDismissReason(reason: any): void {
    if (reason === ModalDismissReasons.ESC) {
      ('by pressing ESC');
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      ('by clicking on a backdrop');
    } else {
      console.error(`with: ${reason}`);
    }
  }

  deleteSession($event: MouseEvent, session: ISession): void {
    $event.stopPropagation();
    this.sessionService
      .deleteSession(session)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (res) => {
          this.getSessions();
        },
        (err) => {
          console.error(err);
          alert(`Не удалось удалить сессию`);
        }
      );
  }
}
