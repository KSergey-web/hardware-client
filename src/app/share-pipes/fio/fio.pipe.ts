import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from 'src/app/interfaces/user.interface';

@Pipe({
  name: 'fio',
})
export class FioPipe implements PipeTransform {
  transform(
    user?: Pick<IUser, 'first_name' | 'last_name' | 'patronymic'> | null,
    args?: any
  ): string {
    if (!user) return `user ${user}`;
    const patronymic = user.patronymic ?? '';
    return [user.first_name, user.last_name, user.patronymic].join(' ');
  }
}
