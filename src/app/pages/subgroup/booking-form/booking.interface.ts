import { IBooking } from 'src/app/interfaces/booking.interface';

export interface INewBooking {
  subgroup?: number;
  equipment?: number;
  begin?: Date;
  end?: Date;
  session_duration?: number;
  max_session_duration_per_day?: number;
}
