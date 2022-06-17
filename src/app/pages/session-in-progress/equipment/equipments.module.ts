import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { API_INTERMEDIARY_URL } from 'src/app/urls-tokens';
import { environment } from 'src/environments/environment';
import { SessionInProgressService } from '../session-in-progress.service';
import { EquipmentComponent } from './equipment-component/equipment.component';
import { EquipmentDirective } from './equipment-component/equipment.directive';
import { EquipmentElementsModule } from './equipment-elements/equipment-elements.module';
import { AlteraDe1SoCComponent } from './set-of-equipments/altera-de1-so-c/altera-de1-so-c.component';
import { STK500Component } from './set-of-equipments/stk500/stk500.component';
import { Stm32Component } from './set-of-equipments/stm32/stm32.component';

@NgModule({
  declarations: [
    STK500Component,
    AlteraDe1SoCComponent,
    Stm32Component,
    EquipmentComponent,
    EquipmentDirective,
  ],
  imports: [
    EquipmentElementsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [EquipmentComponent],
  providers: [],
})
export class EquipmentsModule {}
