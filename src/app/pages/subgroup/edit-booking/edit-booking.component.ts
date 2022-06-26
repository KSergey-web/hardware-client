import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IBooking } from 'src/app/interfaces/booking.interface';
import { ISubgroup } from 'src/app/interfaces/subgroup.interface';
import { BookingService } from 'src/app/services/booking.service';
import { CommonModalDialogBoxBuilder } from 'src/app/widgets/common-dialog-boxes/common-modal-dialog-box-builder.class';
import { INewBooking } from '../booking-form/booking.interface';
import { IBookingFormProperties } from '../booking-form/subgroup-form-properties.inteface';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.scss'],
})
export class EditBookingComponent implements OnInit, OnDestroy {
  initValuesForForm?: IBookingFormProperties;
  @Input() subgroup!: ISubgroup;
  @Input() booking!: IBooking;

  constructor(
    private bookingService: BookingService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.InitBookingForm();
  }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onDissmis() {
    this.activeModal.dismiss();
  }

  private InitBookingForm() {
    this.initValuesForForm = {};
    this.initValuesForForm.acceptButtonText = 'Сохранить';
    this.initValuesForForm.begin = this.booking.begin;
    this.initValuesForForm.end = this.booking.end;
    this.initValuesForForm.equipmentId = this.booking.equipment?.id;
    this.initValuesForForm.max_session_duration_per_day =
      this.booking.max_session_duration_per_day;
    this.initValuesForForm.session_duration = this.booking.session_duration;
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

  onSubmit(updatedBooking: INewBooking) {
    this.bookingService
      .updateBooking(updatedBooking, this.booking.id)
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
