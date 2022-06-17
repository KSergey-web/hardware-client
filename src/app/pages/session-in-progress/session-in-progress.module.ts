import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from '../../app-routing.module';
import { SharePipesModule } from '../../share-pipes/share-pipes.module';
import { API_INTERMEDIARY_URL } from '../../urls-tokens';
import { EquipmentElementsModule } from './equipment/equipment-elements/equipment-elements.module';
import { EquipmentsModule } from './equipment/equipments.module';
import { SessionInProgressComponent } from './session-in-progress.component';
import { SessionInProgressService } from './session-in-progress.service';
import { TryConnectToSessionComponent } from './try-connect-to-session/try-connect-to-session.component';

@NgModule({
  declarations: [SessionInProgressComponent, TryConnectToSessionComponent],
  imports: [
    EquipmentsModule,
    EquipmentElementsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    SharePipesModule,
  ],
  providers: [
    SessionInProgressService,
    {
      provide: API_INTERMEDIARY_URL,
      useValue: environment.intermediaryServerAddres,
    },
  ],
})
export class SessionInProgressModule {}
