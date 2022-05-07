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

  public apiUrlAlteraDe1SoC: string = '';

  sendSwitchAction(
    switchInd: number,
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/v1/api/equipment/send-command/session/${this.sessionId}?command=/altera-de1-so-c/switch/${switchInd}`
    );
  }

  sendButtonAction(
    buttonInd: number,
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/v1/api/equipment/send-command/session/${this.sessionId}?command=/altera-de1-so-c/button/${buttonInd}`
    );
  }



  uploadSof(selectedFile: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', selectedFile, selectedFile.name);
    return this.http.post<any>(`${this.apiUrlAlteraDe1SoC}/altera-de1-so-c/upload`, fd);
  }

  clean(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlAlteraDe1SoC}/altera-de1-so-c/clean`);
  }

  reset(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlAlteraDe1SoC}/altera-de1-so-c/reset`);
  }

  getStatusSwitches(): Observable<{switches: string}> {
    return this.http.get<{switches: string}>(`${this.apiUrlAlteraDe1SoC}/altera-de1-so-c/status-switches`);
  }

  turnOffSwitches(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlAlteraDe1SoC}/altera-de1-so-c/turnOffSwitches`);
  }

  checkEquipmentServer(): Observable<any> {
    return this.http.get(`${this.apiUrlAlteraDe1SoC}`,{ responseType: 'text' });
  }
}
