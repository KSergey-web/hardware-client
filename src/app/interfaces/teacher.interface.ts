import { IGroup } from './group.interface';
import { IUser } from './user.interface';

export interface ITeacher extends IUser{
  department?: IGroup;
}
