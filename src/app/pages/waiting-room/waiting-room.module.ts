import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharePipesModule } from 'src/app/share-pipes/share-pipes.module';
import { WaitingRoomComponent } from './waiting-room.component';

@NgModule({
  imports: [SharePipesModule, CommonModule],
  exports: [],
  declarations: [WaitingRoomComponent],
  providers: [],
})
export class WaitingRoomModule {}
