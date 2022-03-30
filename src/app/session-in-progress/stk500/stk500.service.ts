import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_STK500_URL, API_URL } from 'src/app/app.module';

@Injectable({
  providedIn: 'root',
})
export class STK500Service {
  constructor(
    private http: HttpClient,
    @Inject(API_STK500_URL) private apiUrlSTK500: string
  ) {}

  sendButtonsAndResistorCommand(
    button: string = '00000000',
    resistor: string = '00000'
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrlSTK500}/stk500/button/` + button + '/resistor/' + resistor
    );
  }

  valueResistorToCommand(value: number): string {
    let command: string = '10000';
    const strValue = value.toString();
    const lenght = strValue.length;
    command = command.slice(0, 5 - lenght) + strValue;
    return command;
  }

  uploadHex(selectedFile: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', selectedFile, selectedFile.name);
    return this.http.post<any>(`${this.apiUrlSTK500}/stk500/upload`, fd);
  }

  clean(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlSTK500}/stk500/clean`);
  }

  reset(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlSTK500}/stk500/reset`);
  }
}
