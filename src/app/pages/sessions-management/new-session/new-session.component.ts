import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateFormatter } from 'src/app/services/date-formatter.service';
import { CommonModalDialogBoxBuilder } from 'src/app/widgets/common-dialog-boxes/common-modal-dialog-box-builder.class';
import { SessionService } from '../../../services/session.service';
import { ILdapUser } from '../../subgroup/add-users/ldap-user.interface';
import { BusyErrorDto } from '../../subgroup/create-session-by-booking/busy.dto-error';
import { INewSession } from '../../subgroup/create-session-by-booking/new-session.interface';

@Component({
  selector: 'app-new-session',
  templateUrl: './new-session.component.html',
  styleUrls: ['./new-session.component.scss'],
})
export class NewSessionComponent implements OnInit, OnDestroy {
  ngOnInit(): void {}

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  constructor(
    private sessionService: SessionService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private dateFormatter: DateFormatter
  ) {}

  createSession(session: INewSession): void {
    this.sessionService
      .createSession(session)
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
            alert('Не удалось создать сессию');
          }
        }
      );
  }

  createSessionForUserFromLdap(
    session: Omit<INewSession, 'user'> & { user: ILdapUser }
  ): void {
    this.sessionService
      .createSessionForUserFromLdap(session)
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
            alert('Не удалось создать сессию');
          }
        }
      );
  }

  createBusyErrorAlert(busyError: BusyErrorDto) {
    const { begin: sessionBegin, end: sessionEnd } =
      busyError.error.error.details.busy;
    const bulder = new CommonModalDialogBoxBuilder(this.modalService);
    bulder
      .addHeader('Не удалось создать сессию')
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
