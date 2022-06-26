import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { IBooking } from 'src/app/interfaces/booking.interface';
import { ISubgroup } from 'src/app/interfaces/subgroup.interface';
import { BookingService } from 'src/app/services/booking.service';
import { takeUntil } from 'rxjs/operators';
import { EditBookingComponent } from '../edit-booking/edit-booking.component';
import { CreateBookingComponent } from '../create-booking/create-booking.component';

@Component({
  selector: 'app-list-bookings',
  templateUrl: './list-bookings.component.html',
  styleUrls: ['./list-bookings.component.scss'],
})
export class ListBookingsComponent implements OnDestroy, OnInit {
  bookings: IBooking[] = [];
  @Input() subgroup!: ISubgroup;
  @Input() update$!: Subject<any>;

  constructor(
    private modalService: NgbModal,
    private bookingService: BookingService
  ) {}

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  subOnUpdate() {
    this.update$.subscribe(() => {
      this.getBookings();
    });
  }

  ngOnInit(): void {
    this.getBookings();
  }

  editBooking(booking: IBooking) {
    const modalRef = this.modalService.open(EditBookingComponent, {
      size: 'lg',
    });
    (modalRef.componentInstance as EditBookingComponent).booking = booking;
    (modalRef.componentInstance as EditBookingComponent).subgroup =
      this.subgroup;
    this.performResultModal(modalRef);
  }

  private performResultModal(modalRef: NgbModalRef): void {
    modalRef.result.then(() => {
      this.getBookings();
    });
  }

  private getBookings() {
    this.bookingService
      .getBookingsOfSubgoup(this.subgroup)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((bookings) => {
        console.log('bb');
        this.bookings = bookings;
      });
  }

  createBooking() {
    const modalRef = this.modalService.open(CreateBookingComponent, {
      size: 'lg',
    });
    (modalRef.componentInstance as CreateBookingComponent).subgroup =
      this.subgroup!;
    this.performResultModal(modalRef);
  }
}
