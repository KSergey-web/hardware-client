import { IBooking } from 'src/app/interfaces/booking.interface';

export interface INewBooking
  extends Partial<Omit<IBooking, 'subgroup' | 'equipment'>> {
  subgroup: number;
  equipment: number;
}
