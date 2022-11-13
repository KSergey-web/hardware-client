import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from 'src/app/interfaces/user.interface';
import { API_INTERMEDIARY_URL } from 'src/app/urls-tokens';
import { ILdapUser } from './ldap-user.interface';

@Injectable()
export class LdapGroupStoreService {
  constructor(
    @Inject(API_INTERMEDIARY_URL) private apiUrl: string,
    private http: HttpClient
  ) {}

  getUsersByGroup(groupName: string): Observable<Array<ILdapUser>> {
    const path =
      this.apiUrl + `/v1/api/ldap/group/${groupName.replace(' ', '')}/users`;
    console.log(path);
    return this.http
      .get<{ users: ILdapUser[] }>(path)
      .pipe(map((res) => res.users));
  }

  addUsersToSubgroup(
    subgroupId: number,
    users: ILdapUser[]
  ): Observable<Array<IUser>> {
    const path = this.apiUrl + `/v1/api/strapi/subgroups/${subgroupId}/users`;
    return this.http
      .patch<{ users: IUser[] }>(path, { users })
      .pipe(map((res) => res.users));
  }
}
