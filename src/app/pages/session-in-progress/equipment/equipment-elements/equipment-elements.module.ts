import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharePipesModule } from 'src/app/share-pipes/share-pipes.module';
import { EquipmentCommunicationService } from '../communication-services/equipment-communication.service';
import {
  I_BUTTON_INTERACTION_SERVICE,
  I_FIRMWARE_INTERACTION_SERVICE,
  I_RESISTOR_INTERACTION_SERVICE,
  I_SWITCH_INTERACTION_SERVICE,
} from './equipment-elements-tokens';
import { ButtonsComponent } from './buttons/buttons.component';
import { ConsoleComponent } from './console/console.component';
import { EquipmentHandlerService } from './equipment-handler.service';
import { FileActionsComponent } from './file-actions/file-actions.component';
import { ResistorComponent } from './resistor/resistor.component';
import { SwitchesComponent } from './switches/switches.component';
import { VideoComponent } from './video/video.component';

@NgModule({
  declarations: [
    ConsoleComponent,
    ButtonsComponent,
    FileActionsComponent,
    SwitchesComponent,
    ResistorComponent,
    VideoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharePipesModule,
  ],
  exports: [
    ConsoleComponent,
    ButtonsComponent,
    FileActionsComponent,
    SwitchesComponent,
    ResistorComponent,
    VideoComponent,
  ],
  providers: [
    EquipmentHandlerService,

  ],
})
export class EquipmentElementsModule {}
