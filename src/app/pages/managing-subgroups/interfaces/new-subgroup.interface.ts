import { IUser } from 'src/app/interfaces/user.interface';

export interface INewSubgroup {
  creator?: IUser;
  users?: IUser[];
  bookings?: any[];
  name: string;
}
