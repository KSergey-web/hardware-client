import { IEquipment } from './equipment.interface';
import { ISubgroup } from './subgroup.interface';

export interface IBooking {
  id: number;
  subgroup?: ISubgroup;
  equipment?: IEquipment;
  begin: Date;
  end: Date;
  session_duration: number;
  max_sessions_count_per_day: number;
}
