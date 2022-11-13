import { IUser } from 'src/app/interfaces/user.interface';

export type ILdapUser = Pick<Partial<IUser>, 'id'> & Omit<IUser, 'id'>;
