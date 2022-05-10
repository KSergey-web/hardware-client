import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_INTERMEDIARY_URL } from 'src/app/app.module';
import { SessionInProgressService } from '../../session-in-progress.service';

@Injectable({
  providedIn: 'root'
})
export class AlteraDe1SoCService {

  constructor(
    private http: HttpClient,
    @Inject(API_INTERMEDIARY_URL) private apiUrl: string,
    private sessionInProgressService: SessionInProgressService
  ) {}

  private get sessionId():  number | undefined {
    return this.sessionInProgressService.sessionId;
  }

  sendSwitchAction(
    switchInd: number,
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/v1/api/equipment/send-command/session/${this.sessionId}?command=/switch/${switchInd}`
    );
  }

  sendButtonAction(
    buttonInd: number,
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/v1/api/equipment/send-command/session/${this.sessionId}?command=/button/${buttonInd}`
    );
  }



  uploadSof(selectedFile: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', selectedFile, selectedFile.name);
    return this.http.post<any>(`${this.apiUrl}/v1/api/equipment/send-file/session/${this.sessionId}?command=/upload`, fd);
  }

  clean(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/v1/api/equipment/send-command/session/${this.sessionId}?command=/clean`);
  }

  reset(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/v1/api/equipment/send-command/session/${this.sessionId}?command=/reset`);
  }

  getStatusSwitches(): Observable<{switches: string}> {
    return this.http.get<{switches: string}>(`${this.apiUrl}/v1/api/equipment/send-command/session/${this.sessionId}?command=/status-switches`);
  }

  turnOffSwitches(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/v1/api/equipment/send-command/session/${this.sessionId}?command=/turnOffSwitches`);
  }

  checkEquipmentServer(): Observable<any> {
    return this.http.get(`${this.apiUrl}/v1/api/equipment/check-availability-server/session/?command=/`,{ responseType: 'text' });
  }
}
