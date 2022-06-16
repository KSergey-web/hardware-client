import { Component, OnDestroy, OnInit } from '@angular/core';
import { IResistorManagement } from '../controls/resistor/resistor-management.interface';

@Component({
  selector: 'app-stk500',
  templateUrl: './stk500.component.html',
  styleUrls: ['./stk500.component.scss'],
})
export class STK500Component {
  resistorManagment: IResistorManagement = {
    minValue: 32,
    maxValue: 4095,
  };
}
