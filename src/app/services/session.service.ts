import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Data, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from '../app.module';
import { AnswerArraySessionsPopulate1 } from '../interfaces/answer-array-sessions-populate1.interface copy';
import { DefaultAnswer } from '../interfaces/default-answer.interface';
import { IEquipment } from '../interfaces/equipment.interface';
import { INewSession, ISession } from '../interfaces/session.interface';
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


  

  

  getSessionsByUser(id: number): Observable<ISession[]> {
    const filter0 = `filters[$and][0][user][id][$eq]=${id}`;
    const filter1 = `filters[$and][1][end][$gte]=${new Date().toJSON()}`;
    return this.http
      .get<AnswerArraySessionsPopulate1>(
        `${this.apiUrl}/api/sessions?populate=%2A&sort[0]=begin%3Aasc&` + filter0 + '&' + filter1
      )
      .pipe(
        map((res) => {
          return this.getSessionsFromResponse(res);
        })
      );
  }

  getSessionsByCreator(id: number): Observable<ISession[]> {
    const filter0 = `filters[$and][0][creator][id][$eq]=${id}`;
    const filter1 = `filters[$and][1][end][$gte]=${new Date().toJSON()}`;
    return this.http
      .get<AnswerArraySessionsPopulate1>(
        `${this.apiUrl}/api/sessions?populate=%2A&sort[0]=begin%3Aasc&` + filter0 + '&' + filter1
      )
      .pipe(
        map((res) => {
          return this.getSessionsFromResponse(res);
        })
      );
  }

  

  

  createSession(newSession: INewSession): Observable<{data: any}> {
    const body = {
      data: { ...newSession, creator: this.authService.currentUser!.id },
    };
    console.log(body);
    return this.http.post<any>(`${this.apiUrl}/api/sessions`, body);
  }

  updateSession(session: INewSession): Observable<{data: any}>  {
    const body: any = {
      data: { ...session },
    };
    delete body.data.id;
    console.log(body);
    return this.http.put<any>(`${this.apiUrl}/api/sessions/${session.id}`, body);
  }

  getSessionsInDateByEquipment(
    equipment: IEquipment,
    date: Date
  ): Observable<ISession[]> {
    const lastDate = new Date(date);
    lastDate.setHours(23);
    lastDate.setMinutes(59);
    lastDate.setSeconds(59);
    const filter0 = `filters[$and][0][begin][$gte]=${date.toJSON()}`;
    const filter1 = `filters[$and][1][begin][$lt]=${lastDate.toJSON()}`;
    const filter2 = `filters[$and][2][equipment][id][$eq]=${equipment.id}`;
    const filter3 = `filters[$and][3][end][$gte]=${(new Date()).toJSON()}`;
    return this.http
      .get<AnswerArraySessionsPopulate1>(
        `${this.apiUrl}/api/sessions?populate=%2A&sort[0]=begin%3Aasc&` +
          filter0 +
          '&' +
          filter1 +
          '&' +
          filter2 +
          '&' +
          filter3
      )
      .pipe(
        map((res) => {
          return this.getSessionsFromResponse(res);
        })
      );
  }


  private getSessionsFromResponse(res: AnswerArraySessionsPopulate1): ISession[] {
    const sessions: ISession[] = [];
    res.data.forEach((item) => {
      const session: any = {
        id: item.id,
        ...item.attributes,
      };
      session.user = {
        id: item.attributes.user.data.id,
        ...item.attributes.user.data.attributes,
      };
      session.creator = {
        id: item.attributes.creator.data.id,
        ...item.attributes.creator.data.attributes,
      };
      session.equipment = {
        id: item.attributes.equipment.data.id,
        ...item.attributes.equipment.data.attributes,
      };
      session.begin = new Date(session.begin);
      session.end = new Date(session.end);
      sessions.push(session as ISession);
    });
    return sessions;
  }

  deleteSession(session: ISession): Observable<DefaultAnswer> {
    return this.http.delete<DefaultAnswer>(
      `${this.apiUrl}/api/sessions/${session.id}`);
  }

  private getSessionFromDefaultAnswer(data: any): ISession{
    const session: any = {
      id: data.id,
      ...data.attributes,
    };
    session.user = {
      id: data.attributes.user.data.id,
      ...data.attributes.user.data.attributes,
    };
    session.creator = {
      id: data.attributes.creator.data.id,
      ...data.attributes.creator.data.attributes,
    };
    session.equipment = {
      id: data.attributes.equipment.data.id,
      ...data.attributes.equipment.data.attributes,
    };
    session.begin = new Date(session.begin);
    session.end = new Date(session.end);
    return session;
  }

  getSessionById(id: number): Observable<ISession>{
    return this.http.get<DefaultAnswer>(
      `${this.apiUrl}/api/sessions/${id}?populate=%2A`).pipe(map(res => this.getSessionFromDefaultAnswer(res.data)
      ));
  }
}