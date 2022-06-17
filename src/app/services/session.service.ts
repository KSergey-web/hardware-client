import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { queryParamEnum } from '../enums/query-param.enum';
import { DefaultAnswer } from '../interfaces/default-answer.interface';
import { IEquipment } from '../interfaces/equipment.interface';
import { PaginationInfo } from '../interfaces/pagination-info.interface';
import { INewSession, ISession } from '../interfaces/session.interface';
import { API_URL } from '../urls-tokens';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(
    @Inject(API_URL) private apiUrl: string,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getSessionsByCurrentUser(): Observable<ISession[]> {
    return this.http
      .get<{ sessions: any[] }>(`${this.apiUrl}/api/sessions/my-sessions`)
      .pipe(
        map((res) => {
          return this.strDatesToObjectDatesForSessions(res.sessions);
        })
      );
  }

  getSessionsByCurrentCreator(
    page: number = 1
  ): Observable<{ sessions: ISession[]; pagination?: PaginationInfo }> {
    const pagination = `pagination[page]=${page}`;
    return this.http
      .get<{ sessions: any[]; pagination?: PaginationInfo }>(
        `${this.apiUrl}/api/sessions/by-current-creator` + '?' + pagination
      )
      .pipe(
        map((res) => {
          res.sessions = this.strDatesToObjectDatesForSessions(res.sessions);
          return res;
        })
      );
  }

  createSession(newSession: INewSession): Observable<{ data: any }> {
    const body = {
      data: { ...newSession, creator: this.authService.currentUser!.id },
    };
    return this.http.post<any>(`${this.apiUrl}/api/sessions`, body);
  }

  updateSession(session: INewSession): Observable<{ data: any }> {
    const body: any = {
      data: { ...session },
    };
    delete body.data.id;
    return this.http.put<any>(
      `${this.apiUrl}/api/sessions/${session.id}`,
      body
    );
  }

  getSessionsInDateByEquipment(
    equipment: IEquipment,
    date: Date
  ): Observable<ISession[]> {
    const endDate = new Date(date);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    return this.http
      .get<{ sessions: ISession[] }>(
        `${this.apiUrl}/api/sessions/equipment/${
          equipment.id
        }/begin-date/${date.toJSON()}/end-date/${endDate.toJSON()}`
      )
      .pipe(
        map((res) => {
          return this.strDatesToObjectDatesForSessions(res.sessions);
        })
      );
  }

  strDatesToObjectDatesForSession(session: any): ISession {
    session.begin = new Date(session.begin);
    session.end = new Date(session.end);
    return session;
  }

  strDatesToObjectDatesForSessions(sessions: any[]): ISession[] {
    sessions = sessions.map((session) =>
      this.strDatesToObjectDatesForSession(session)
    );
    return sessions;
  }

  deleteSession(session: ISession): Observable<DefaultAnswer> {
    return this.http.delete<DefaultAnswer>(
      `${this.apiUrl}/api/sessions/${session.id}`
    );
  }

  getSessionById(id: number): Observable<ISession> {
    return this.http
      .get<{ data: any }>(
        `${this.apiUrl}/api/sessions/${id}?` +
          queryParamEnum.populate1lvl +
          '&' +
          queryParamEnum.serialize
      )
      .pipe(
        map((res) => {
          return this.strDatesToObjectDatesForSession(res.data);
        })
      );
  }

  getNearestAndStarted(): Observable<ISession[]> {
    return this.http
      .get<{ sessions: any[] }>(
        `${this.apiUrl}/api/sessions/nearest-and-started`
      )
      .pipe(
        map((res) => {
          return this.strDatesToObjectDatesForSessions(res.sessions);
        })
      );
  }
}
