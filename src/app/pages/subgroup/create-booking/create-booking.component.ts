import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISubgroup } from 'src/app/interfaces/subgroup.interface';
import { BookingService } from 'src/app/services/booking.service';
import { CommonModalDialogBoxBuilder } from 'src/app/widgets/common-dialog-boxes/common-modal-dialog-box-builder.class';
import { INewBooking } from '../booking-form/booking.interface';
import { IBookingFormProperties } from '../booking-form/subgroup-form-properties.inteface';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnDestroy {
  initValuesForForm?: IBookingFormProperties;
  @Input() subgroup!: ISubgroup;

  constructor(
    private bookingService: BookingService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
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
    this.initValuesForForm.acceptButtonText = 'Создать';
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

  onSubmit(booking: INewBooking) {
    booking.subgroup = this.subgroup.id;
    this.bookingService
      .createBooking(booking)
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
