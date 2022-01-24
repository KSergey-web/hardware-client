import { IEquipment } from './equipment.interface';
import { IUser } from './user.interface';

export interface ISession {
  id?: number;
  user?: IUser;
  creator?: IUser;
  equipment?: IEquipment;
  begin: Date;
  end: Date;
}
