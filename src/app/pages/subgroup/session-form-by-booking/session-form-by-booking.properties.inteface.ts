import { IEquipment } from 'src/app/interfaces/equipment.interface';

export interface ISessionFormByBookingProperties {
  acceptButtonText?: string;
  equipment?: IEquipment;
  booking_begin?: Date;
  booking_end?: Date;
  session_duration?: number;
  max_session_duration_per_day?: number;
  bookingId: number;
}
