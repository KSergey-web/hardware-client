import { IUser } from './user.interface';

export interface ISubgroup {
  id: number;
  creator?: IUser;
  users?: IUser[];
  bookings?: any[];
  name: string;
}
