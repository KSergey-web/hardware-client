import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { API_INTERMEDIARY_URL } from 'src/app/urls-tokens';
import { environment } from 'src/environments/environment';
import { AlteraDe1SoCComponent } from './altera-de1-so-c/altera-de1-so-c.component';
import { EquipmentControlsModule } from './controls/equipment-controls.module';
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
  ],
})
export class EquipmentsModule {}
