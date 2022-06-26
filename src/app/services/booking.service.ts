import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { queryParamEnum } from '../enums/query-param.enum';
import { IBooking } from '../interfaces/booking.interface';
import { ISubgroup } from '../interfaces/subgroup.interface';
import { INewBooking } from '../pages/subgroup/booking-form/booking.interface';
import { API_URL } from '../urls-tokens';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient
  ) {}

  getBookingsOfSubgoup(subgroup: ISubgroup): Observable<IBooking[]> {
    return this.http
      .get<{
        bookings: IBooking[];
      }>(`${this.apiUrl}/api/bookings/by-subgroup/${subgroup.id}`)
      .pipe(
        map((res) => {
          return this.strDatesToObjectDatesForBookings(res.bookings);
        })
      );
  }

  createBooking(newBooking: INewBooking): Observable<{ data: IBooking }> {
    const body: any = {
      data: newBooking,
    };
    return this.http.post<any>(
      `${this.apiUrl}/api/bookings` + '?' + queryParamEnum.serialize,
      body
    );
  }

  updateBooking(
    booking: INewBooking,
    bookingId: number
  ): Observable<{ data: any }> {
    const body: any = {
      data: booking,
    };
    delete body.data.id;
    return this.http.put<any>(`${this.apiUrl}/api/bookings/${bookingId}`, body);
  }

  strDatesToObjectDatesForBooking(booking: any): IBooking {
    booking.begin = new Date(booking.begin);
    booking.end = new Date(booking.end);
    return booking;
  }

  strDatesToObjectDatesForBookings(bookings: any[]): IBooking[] {
    bookings = bookings.map((booking) =>
      this.strDatesToObjectDatesForBooking(booking)
    );
    return bookings;
  }
}
