import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IEquipment } from '../interfaces/equipment.interface';
import { API_URL } from '../urls-tokens';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  constructor(
    @Inject(API_URL) private apiUrl: string,
    private router: Router,
    private http: HttpClient
  ) {}

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
}
