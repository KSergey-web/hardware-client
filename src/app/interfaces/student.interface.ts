import { IGroup } from './group.interface';
import { IUser } from './user.interface';

export interface IStudent extends IUser {
  group?: IGroup;
}
