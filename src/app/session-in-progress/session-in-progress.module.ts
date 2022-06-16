import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from '../app-routing.module';
import { SharePipesModule } from '../share/share-pipes.module';
import { API_INTERMEDIARY_URL } from '../urls-tokens';
import { EquipmentControlsModule } from './equipments/controls/equipment-controls.module';
import { EquipmentsModule } from './equipments/equipments.module';
import { SessionInProgressComponent } from './session-in-progress.component';

@NgModule({
  declarations: [SessionInProgressComponent],
  imports: [
    EquipmentsModule,
    EquipmentControlsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    SharePipesModule,
  ],
  providers: [
    {
      provide: API_INTERMEDIARY_URL,
      useValue: environment.intermediaryServerAddres,
    },
  ],
})
export class SessionInProgressModule {}
