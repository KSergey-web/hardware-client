import { Component } from '@angular/core';
import { ISwitchesManagement } from '../controls/switches/switches-management.interface';

@Component({
  selector: 'app-altera-de1-so-c',
  templateUrl: './altera-de1-so-c.component.html',
  styleUrls: ['./altera-de1-so-c.component.scss'],
})
export class AlteraDe1SoCComponent {
  switchesManagment: ISwitchesManagement = {
    numberOfSwitches: 8,
  };
}
