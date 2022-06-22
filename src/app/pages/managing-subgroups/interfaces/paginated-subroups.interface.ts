import { PaginationInfo } from 'src/app/interfaces/pagination-info.interface';
import { ISubgroup } from 'src/app/interfaces/subgroup.interface';

export interface IPaginatedSubroups {
  subgroups: ISubgroup[];
  pagination?: PaginationInfo;
}
