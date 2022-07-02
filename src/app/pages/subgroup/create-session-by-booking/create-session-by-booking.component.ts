import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IBooking } from 'src/app/interfaces/booking.interface';
import { SessionService } from 'src/app/services/session.service';
import { CommonModalDialogBoxBuilder } from 'src/app/widgets/common-dialog-boxes/common-modal-dialog-box-builder.class';
import { ISessionDates } from '../session-form-by-booking/session-dates.interface';
import { ISessionFormByBookingProperties } from '../session-form-by-booking/session-form-by-booking.properties.inteface';
import { INewSession } from './new-session.interface';

@Component({
  selector: 'app-create-session-by-booking',
  templateUrl: './create-session-by-booking.component.html',
  styleUrls: ['./create-session-by-booking.component.scss'],
})
export class CreateSessionByBookingComponent implements OnInit, OnDestroy {
  initValuesForForm?: ISessionFormByBookingProperties;
  @Input() booking!: IBooking;

  constructor(
    private sessionService: SessionService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.InitSessionForm();
  }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onDissmis() {
    this.activeModal.dismiss();
  }

  private InitSessionForm() {
    this.initValuesForForm = {};
    this.initValuesForForm.acceptButtonText = 'Создать';
    this.initValuesForForm.equipment = this.booking.equipment;
    this.initValuesForForm.booking_begin = this.booking.begin;
    this.initValuesForForm.booking_end = this.booking.end;
    this.initValuesForForm.session_duration = this.booking.session_duration;
    this.initValuesForForm.max_session_duration_per_day =
      this.booking.max_session_duration_per_day;
  }

  SomeError(err: HttpErrorResponse) {
    console.error(err);
    const bulder = new CommonModalDialogBoxBuilder(this.modalService);
    bulder
      .addHeader('Ошибка')
      .addText('Что-то пошло не так')
      .setDangerStyle()
      .openAlertModal();
  }

  onSubmit(sessionDates: ISessionDates) {
    let newSession: INewSession = {
      ...sessionDates,
      booking: this.booking.id,
    };
    console.log(newSession);
    this.sessionService
      .signupForSession(newSession)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (res) => this.activeModal.close(res),
        error: (err: HttpErrorResponse) => {
          console.error(err);
          const bulder = new CommonModalDialogBoxBuilder(this.modalService);
          bulder
            .addHeader('Ошибка')
            .addText(
              `Не удалось создать бронь. Статус ${err.status}. ${err.message}`
            )
            .setDangerStyle()
            .openAlertModal();
        },
      });
  }
}
