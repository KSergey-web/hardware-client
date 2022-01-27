import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Data, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from './app.module';
import { AuthService } from './auth.service';
import { roleUserEnum } from './enums/role-user.enum';
import { AnswerArraySessionsPopulate1 } from './interfaces/answer-array-sessions-populate1.interface copy';
import { AnswerArrayStudentsPopulate1 } from './interfaces/answer-array-students-populate1.interface';
import { DefaultAnswer } from './interfaces/default-answer.interface';
import { IEquipment } from './interfaces/equipment.interface';
import { IGroup } from './interfaces/group.interface';
import { INewSession, ISession } from './interfaces/session.interface';
import { IStudent } from './interfaces/student.interface';
import { IUser } from './interfaces/user.interface';

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


  getInfoAboutStudentByUserId(userId: number): Observable<null | IStudent>{
    const filter0 = `filters[user][id][$eq][0]=${userId}`;
    return this.http.get<AnswerArrayStudentsPopulate1>(
      `${this.apiUrl}/api/students?populate=%2A&` + filter0).pipe(
        map((res) => {
          if (res.data.length === 0) return null;
          return this.getStudentsFromResponse(res)[0];
        })
      );
  }

  getStudentsFromResponse(res: AnswerArrayStudentsPopulate1): IStudent[] {
    const students: IStudent[] = [];
    res.data.forEach((item) => {
      const student: any = {
        id: item.attributes.user.data.id,
        ...item.attributes.user.data.attributes
      };
      student.group = {
        id: item.attributes.group.data.id,
        ...item.attributes.group.data.attributes,
      };
      students.push(student as IStudent);
    });
    return students;
  }

  getSessionsByUser(id: number): Observable<ISession[]> {
    const filter0 = `filters[$and][0][user][id][$eq]=${id}`;
    const filter1 = `filters[$and][1][end][$gte]=${new Date().toJSON()}`;
    return this.http
      .get<AnswerArraySessionsPopulate1>(
        `${this.apiUrl}/api/sessions?populate=%2A&` + filter0 + '&' + filter1
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
        `${this.apiUrl}/api/sessions?populate=%2A&` + filter0 + '&' + filter1
      )
      .pipe(
        map((res) => {
          console.log(res);
          return this.getSessionsFromResponse(res);
        })
      );
  }

  getEquipments(): Observable<IEquipment[]> {
    return this.http
      .get<{ data: Array<{ id: number; attributes: { name: string } }> }>(
        `${this.apiUrl}/api/equipments`
      )
      .pipe(
        map((res): IEquipment[] => {
          const equipments: IEquipment[] = [];
          res.data.forEach((item) => {
            equipments.push({ id: item.id, name: item.attributes.name });
          });
          return equipments;
        })
      );
  }

  getGroups(): Observable<IGroup[]> {
    return this.http
      .get<{ data: Array<{ id: number; attributes: { name: string } }> }>(
        `${this.apiUrl}/api/groups`
      )
      .pipe(
        map((res): IGroup[] => {
          const groups: IGroup[] = [];
          res.data.forEach((item) => {
            groups.push({ id: item.id, name: item.attributes.name });
          });
          return groups;
        })
      );
  }

  getStudentsFromGroup(group: IGroup): Observable<IStudent[]> {
    return this.http
      .get<{
        data: {
          id: number;
          attributes: {
            name: string;
            students: {
              data: Array<{
                id: number;
                attributes: {
                  user: DefaultAnswer;
                };
              }>;
            };
          };
        };
      }>(
        `${this.apiUrl}/api/groups/${group.id}?populate[students][populate][0]=user`
      )
      .pipe(
        map((res): IStudent[] => {
          const students: IStudent[] = [];
          res.data.attributes.students.data.forEach((item) => {
            const userAttributs: any = {
              id: item.attributes.user.data.id,
              ...item.attributes.user.data.attributes,
            };
            students.push(userAttributs as IStudent);
          });
          return students;
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

  udateSession(session: INewSession): Observable<{data: any}>  {
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
    lastDate.setDate(date.getDate() + 1);
    const filter0 = `filters[$and][0][begin][$gte]=${date.toJSON()}`;
    const filter1 = `filters[$and][1][begin][$lt]=${lastDate.toJSON()}`;
    const filter2 = `filters[$and][2][equipment][id][$eq]=${equipment.id}`;
    return this.http
      .get<AnswerArraySessionsPopulate1>(
        `${this.apiUrl}/api/sessions?populate=%2A&sort[0]=begin%3Aasc&` +
          filter0 +
          '&' +
          filter1 +
          '&' +
          filter2
      )
      .pipe(
        map((res) => {
          return this.getSessionsFromResponse(res);
        })
      );
  }

  getSessionsFromResponse(res: AnswerArraySessionsPopulate1): ISession[] {
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
}
