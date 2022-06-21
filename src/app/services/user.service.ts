import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '../interfaces/user.interface';
import { API_URL } from '../urls-tokens';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getUsersByFIO(fio: string): Observable<IUser[]> {
    fio = fio.replace(/\s+/g, ' ').trim();
    const [first_name, last_name] = fio.split(' ');
    return this.http.get<IUser[]>(
      `${this.apiUrl}/api/users` +
        '?' +
        `filters[first_name][$containsi][0]=${first_name}` +
        '&' +
        'sort[0]=first_name%3Aasc' +
        (last_name
          ? '&' + `filters[last_name][$containsi][1]=${last_name}`
          : '')
    );
  }
}
