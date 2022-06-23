import { IUser } from 'src/app/interfaces/user.interface';

export interface ISubgroupFormProperties {
  name?: string;
  users?: IUser[];
  headerText?: string;
  acceptButtonText?: string;
  creator?: IUser;
}
