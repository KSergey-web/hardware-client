import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_INTERMEDIARY_URL } from '../urls-tokens';

@Injectable({
  providedIn: 'root',
})
export class SessionInProgressService {
  constructor(
    private http: HttpClient,
    @Inject(API_INTERMEDIARY_URL) private apiUrl: string
  ) {}

  sessionId?: number;

  checkEquipmentServerBySession(sessionId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/v1/api/equipment/check-availability-server/session/${sessionId}?command=/`,
      { responseType: 'text' }
    );
  }
}
