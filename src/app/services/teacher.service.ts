import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DefaultArrayAnswer } from '../interfaces/default-array-answer.interface';
import { IUser } from '../interfaces/user.interface';
import { API_URL } from '../urls-tokens';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient
  ) {}

  isUserATeacher(user: IUser): Observable<boolean> {
    return this.http
      .get<DefaultArrayAnswer>(
        `${this.apiUrl}/api/teachers?filters[user][id][$eq]=${user.id}`
      )
      .pipe(
        map((res) => {
          return res.data.length > 0 ? true : false;
        })
      );
  }
}
