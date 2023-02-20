import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISession } from 'src/app/interfaces/session.interface';
import { DateFormatter } from 'src/app/services/date-formatter.service';
import { SessionService } from 'src/app/services/session.service';
import { CommonModalDialogBoxBuilder } from 'src/app/widgets/common-dialog-boxes/common-modal-dialog-box-builder.class';
import { ILdapUser } from '../../subgroup/add-users/ldap-user.interface';
import { BusyErrorDto } from '../../subgroup/create-session-by-booking/busy.dto-error';
import { INewSession } from '../../subgroup/create-session-by-booking/new-session.interface';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.scss'],
})
export class EditSessionComponent implements OnInit, OnDestroy {
  @Input() editedSession!: ISession;
  editedSessionCopy: ISession | null = null;
  constructor(
    private activeModal: NgbActiveModal,
    private sessionService: SessionService,
    private modalService: NgbModal,
    private dateFormatter: DateFormatter
  ) {}
  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  ngOnInit(): void {
    this.editedSessionCopy = _.cloneDeep(this.editedSession);
  }

  saveSession(session: INewSession): void {
    this.sessionService
      .updateSession(session, this.editedSession.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (res) => {
          this.activeModal.close();
        },
        (err) => {
          console.error(err);
          if (err.status === 400) {
            this.createBusyErrorAlert(err as unknown as BusyErrorDto);
          } else {
            alert('Не удалось сохранить сессию');
          }
        }
      );
  }

  saveSessionForUserFromLdap(
    session: Omit<INewSession, 'user'> & { user: ILdapUser }
  ): void {
    this.sessionService
      .updateSessionForUserFromLdap(session, this.editedSession.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (res) => {
          this.activeModal.close();
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          if (err.status === 400) {
            this.createBusyErrorAlert(err as unknown as BusyErrorDto);
          } else {
            alert('Не удалось сохранить сессию');
          }
        }
      );
  }

  createBusyErrorAlert(busyError: BusyErrorDto) {
    const { begin: sessionBegin, end: sessionEnd } =
      busyError.error.error.details.busy;
    const bulder = new CommonModalDialogBoxBuilder(this.modalService);
    bulder
      .addHeader('Не удалось сохранить сессию')
      .addText(
        `Уже существует сессия, которая начинается в ${this.dateFormatter.getFormattedDateTime(
          sessionBegin
        )} и заканчивается в ${this.dateFormatter.getFormattedDateTime(
          sessionEnd
        )}`
      )
      .setDangerStyle()
      .openAlertModal();
  }
}
