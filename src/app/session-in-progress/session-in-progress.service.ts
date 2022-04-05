import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SessionInProgressService {

  constructor(
    private http: HttpClient,
  ) {}

  checkEquipmentServer(url: string): Observable<any> {
    return this.http.get(`${url}`,{ responseType: 'text' });
  }
}
