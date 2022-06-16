import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { API_INTERMEDIARY_URL } from 'src/app/urls-tokens';
import { environment } from 'src/environments/environment';
import { AlteraDe1SoCComponent } from './altera-de1-so-c/altera-de1-so-c.component';
import { EquipmentCommunicationService } from './communication-services/equipment-communication.service';
import { EquipmentControlsModule } from './controls/equipment-controls.module';
import {
  I_ALTERA_DE1_So_C_SERVICE,
  I_STK500_SERVICE,
  I_STM32_SERVICE,
} from './equipment-service-tokens';
import { EquipmentComponent } from './equipment/equipment.component';
import { EquipmentDirective } from './equipment/equipment.directive';
import { STK500Component } from './stk500/stk500.component';
import { Stm32Component } from './stm32/stm32.component';

@NgModule({
  declarations: [
    STK500Component,
    AlteraDe1SoCComponent,
    Stm32Component,
    EquipmentComponent,
    EquipmentDirective,
  ],
  imports: [
    EquipmentControlsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [EquipmentComponent],
  providers: [
    {
      provide: API_INTERMEDIARY_URL,
      useValue: environment.intermediaryServerAddres,
    },
    {
      provide: I_STK500_SERVICE,
      useClass: EquipmentCommunicationService,
    },
    {
      provide: I_ALTERA_DE1_So_C_SERVICE,
      useClass: EquipmentCommunicationService,
    },
    {
      provide: I_STM32_SERVICE,
      useClass: EquipmentCommunicationService,
    },
  ],
})
export class EquipmentsModule {}
