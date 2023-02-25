import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_INTERMEDIARY_URL } from 'src/app/urls-tokens';
import { SessionInProgressService } from '../../session-in-progress.service';
import { EquipmentCommunicationService } from './equipment-communication.service';
import { EquipmentSocketService } from './equipment-socket-service';

@Injectable()
export class EquipmentCommunicationWithSocketService extends EquipmentCommunicationService {
  constructor(
    protected http: HttpClient,
    @Inject(API_INTERMEDIARY_URL) protected apiUrl: string,
    protected sessionInProgressService: SessionInProgressService,
    protected equipmentSocketService: EquipmentSocketService
  ) {
    super(http, apiUrl, sessionInProgressService);
  }

  override sendSwitchAction(switchInd: number): Observable<any> {
    return this.equipmentSocketService.sendCommand(`/switch/${switchInd}`);
  }

  override sendButtonAction(buttonInd: number): Observable<any> {
    return this.equipmentSocketService.sendCommand(`/button/${buttonInd}`);
  }

  override sendResistorAction(resistor: number): Observable<any> {
    return this.equipmentSocketService.sendCommand(`/resistor/${resistor}`);
  }
}
