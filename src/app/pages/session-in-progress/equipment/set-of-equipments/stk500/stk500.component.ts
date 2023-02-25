import { Component } from '@angular/core';
import { EquipmentCommunicationWithSocketService } from '../../communication-services/equipment-communication-with-socket.service copy';
import {
  I_BUTTON_INTERACTION_SERVICE,
  I_RESISTOR_INTERACTION_SERVICE,
} from '../../equipment-elements/equipment-elements-tokens';
import { IResistorManagement } from '../../equipment-elements/resistor/resistor-management.interface';

@Component({
  selector: 'app-stk500',
  templateUrl: './stk500.component.html',
  styleUrls: ['./stk500.component.scss'],
  providers: [
    {
      provide: I_BUTTON_INTERACTION_SERVICE,
      useExisting: EquipmentCommunicationWithSocketService,
    },
    {
      provide: I_RESISTOR_INTERACTION_SERVICE,
      useExisting: EquipmentCommunicationWithSocketService,
    },
  ],
})
export class STK500Component {
  resistorManagment: IResistorManagement = {
    minValue: 32,
    maxValue: 4095,
  };
}
