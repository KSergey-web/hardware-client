import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IEquipment } from 'src/app/interfaces/equipment.interface';
import { ISession } from 'src/app/interfaces/session.interface';
import { AlteraDe1SoCComponent } from '../set-of-equipments/altera-de1-so-c/altera-de1-so-c.component';
import { EquipmentSocketService } from '../communication-services/equipment-socket-service';
import { STK500Component } from '../set-of-equipments/stk500/stk500.component';
import { Stm32Component } from '../set-of-equipments/stm32/stm32.component';
import { EquipmentItem } from './equipment-item';
import { EquipmentDirective } from './equipment.directive';
import { equipmentTypeEnum } from 'src/app/enums/equipments.enum';
import { EquipmentCommunicationService } from '../communication-services/equipment-communication.service';
import {
  I_BUTTON_INTERACTION_SERVICE,
  I_FIRMWARE_INTERACTION_SERVICE,
  I_RESISTOR_INTERACTION_SERVICE,
  I_SWITCH_INTERACTION_SERVICE,
} from '../equipment-elements/equipment-elements-tokens';
import { EquipmentCommunicationWithSocketService } from '../communication-services/equipment-communication-with-socket.service copy';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss'],
  providers: [
    EquipmentSocketService,
    EquipmentCommunicationService,
    EquipmentCommunicationWithSocketService,
    {
      provide: I_BUTTON_INTERACTION_SERVICE,
      useExisting: EquipmentCommunicationService,
    },
    {
      provide: I_SWITCH_INTERACTION_SERVICE,
      useExisting: EquipmentCommunicationService,
    },
    {
      provide: I_FIRMWARE_INTERACTION_SERVICE,
      useExisting: EquipmentCommunicationService,
    },
    {
      provide: I_RESISTOR_INTERACTION_SERVICE,
      useExisting: EquipmentCommunicationService,
    },
  ],
})
export class EquipmentComponent implements AfterViewInit, OnChanges {
  equipment!: IEquipment;
  @Input() session!: ISession;

  @ViewChild(EquipmentDirective, { static: false })
  private equipmentHost!: EquipmentDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}
  ngAfterViewInit(): void {
    this.addEquipmentToComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.equipment = changes['session'].currentValue.equipment;
    console.warn(this.equipment);
  }

  private addEquipmentToComponent() {
    const equipment = this.session?.equipment;
    if (!equipment) throw new Error('Equipment was not downloaded');
    const equipmentItem: EquipmentItem =
      this.selectEquipmentComponent(equipment);
    const viewContainerRef = this.equipmentHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<{
      equipment: IEquipment;
    }>(equipmentItem.component);
    componentRef.instance.equipment = equipmentItem.equipment;
  }

  private selectEquipmentComponent(equipment: IEquipment): EquipmentItem {
    const type = equipment.type;
    switch (type) {
      case equipmentTypeEnum.stk500:
        return new EquipmentItem(STK500Component, equipment);
      case equipmentTypeEnum.alteraDe1SoC:
        return new EquipmentItem(AlteraDe1SoCComponent, equipment);
      case equipmentTypeEnum.stm32:
        return new EquipmentItem(Stm32Component, equipment);
      default:
        throw new Error('There is no matching type of equipmnets');
    }
  }
}
