import { IUser } from 'src/app/interfaces/user.interface';

export interface ISubgroupFormProperties {
  name?: string;
  users?: IUser[];
  acceptButtonText?: string;
  creator?: IUser;
}
