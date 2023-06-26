import { Component } from '@angular/core';
import { EquipmentCommunicationWithSocketService } from '../../communication-services/equipment-communication-with-socket.service copy';
import {
  I_BUTTON_INTERACTION_SERVICE,
  I_SWITCH_INTERACTION_SERVICE,
} from '../../equipment-elements/equipment-elements-tokens';
import { ISwitchesManagement } from '../../equipment-elements/switches/switches-management.interface';

@Component({
  selector: 'app-altera-de1-so-c',
  templateUrl: './altera-de1-so-c.component.html',
  styleUrls: ['./altera-de1-so-c.component.scss'],
  providers: [
    {
      provide: I_BUTTON_INTERACTION_SERVICE,
      useExisting: EquipmentCommunicationWithSocketService,
    },
    {
      provide: I_SWITCH_INTERACTION_SERVICE,
      useExisting: EquipmentCommunicationWithSocketService,
    },
  ],
})
export class AlteraDe1SoCComponent {
  switchesManagment: ISwitchesManagement = {
    numberOfSwitches: 8,
  };
}
