import { Type } from '@angular/core';
import { IEquipment } from '../../../interfaces/equipment.interface';

export class EquipmentItem {
  constructor(public component: Type<any>, public equipment: IEquipment) {}
}
