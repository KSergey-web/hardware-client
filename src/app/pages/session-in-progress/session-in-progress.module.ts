import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ExitSessionInProgressGuard } from 'src/app/guards/exit-session-in-progress.guard';
import { SessionInProgressGuard } from 'src/app/guards/session-in-progress.guard';
import { SharePipesModule } from '../../share-pipes/share-pipes.module';
import { EquipmentElementsModule } from './equipment/equipment-elements/equipment-elements.module';
import { EquipmentsModule } from './equipment/equipments.module';
import { SessionInProgressComponent } from './session-in-progress.component';
import { SessionInProgressService } from './session-in-progress.service';
import { TryConnectToSessionComponent } from './try-connect-to-session/try-connect-to-session.component';

const routes: Routes = [
  {
    path: '',
    component: SessionInProgressComponent,
    canDeactivate: [ExitSessionInProgressGuard],
    canActivate: [SessionInProgressGuard],
  },
];

@NgModule({
  declarations: [SessionInProgressComponent, TryConnectToSessionComponent],
  imports: [
    EquipmentsModule,
    EquipmentElementsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    SharePipesModule,
    RouterModule.forChild(routes),
  ],
  providers: [SessionInProgressService],
  exports: [SessionInProgressComponent],
})
export class SessionInProgressModule {}
