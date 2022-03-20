import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from 'src/app/app.module';

@Injectable({
  providedIn: 'root'
})
export class STK500Service {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) { }

  uploadButtonCommand(button: string = '00000000', resistor: string = '00000') {
    console.log(`${this.apiUrl}/?command=python c:\\STK-scripts\\STK_but_adc.py ` + button + " " + resistor);
    // return this.http
    //   .get(`${this.apiUrl}/?command=python c:\\STK-scripts\\STK_but_adc.py ` + button + resistor)
  }

  uploadHex(selectedFile: File){
      const fd = new FormData();
      fd.append('file', selectedFile, selectedFile.name);
      return this.http.post<Task>(`${this.apiUrl}/`, fd)
  }
}
