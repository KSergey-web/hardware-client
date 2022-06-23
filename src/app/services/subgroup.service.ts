import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { queryParamEnum } from '../enums/query-param.enum';
import { PaginationInfo } from '../interfaces/pagination-info.interface';
import { ISubgroup } from '../interfaces/subgroup.interface';
import { INewSubgroup } from '../pages/managing-subgroups/interfaces/new-subgroup.interface';
import { API_URL } from '../urls-tokens';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SubgroupService {
  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getSubgroupsByCurrentCreator(
    page: number = 1
  ): Observable<{ subgroups: ISubgroup[]; pagination: PaginationInfo }> {
    const pagination = `pagination[page]=${page}`;
    return this.http.get<{
      subgroups: ISubgroup[];
      pagination: PaginationInfo;
    }>(`${this.apiUrl}/api/subgroups/by-current-creator` + '?' + pagination);
  }

  getSubgroups(
    page: number = 1
  ): Observable<{ subgroups: ISubgroup[]; pagination: PaginationInfo }> {
    const pagination = `pagination[page]=${page}`;
    return this.http.get<{
      subgroups: ISubgroup[];
      pagination: PaginationInfo;
    }>(
      `${this.apiUrl}/api/subgroups` +
        '?' +
        pagination +
        '&' +
        queryParamEnum.serialize +
        '&' +
        queryParamEnum.populate1lvl
    );
  }

  createSubgroup(newSubgroup: INewSubgroup): Observable<{ data: ISubgroup }> {
    const body: any = {
      data: { ...newSubgroup, creator: this.authService.currentUser!.id },
    };
    body.data.users = newSubgroup.users?.map((user) => user.id);
    return this.http.post<any>(`${this.apiUrl}/api/subgroups`, body);
  }

  getSubgroupById(id: number): Observable<ISubgroup> {
    return this.http
      .get<{ subgroup: ISubgroup }>(
        `${this.apiUrl}/api/subgroups/${id}?` +
          queryParamEnum.populate1lvl +
          '&' +
          queryParamEnum.serialize
      )
      .pipe(
        map((res) => {
          return res.subgroup;
        })
      );
  }

  updateSubgroup(subgroup: ISubgroup): Observable<{ data: any }> {
    const body: any = {
      data: { ...subgroup },
    };
    delete body.data.id;
    return this.http.put<any>(
      `${this.apiUrl}/api/subgroups/${subgroup.id}`,
      body
    );
  }
}
