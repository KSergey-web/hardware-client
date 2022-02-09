import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from '../app.module';
import { DefaultAnswer } from '../interfaces/default-answer.interface';
import { IGroup } from '../interfaces/group.interface';
import { IStudent } from '../interfaces/student.interface';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    @Inject(API_URL) private apiUrl: string,
    private router: Router,
    private http: HttpClient,
  ) {}

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
}
