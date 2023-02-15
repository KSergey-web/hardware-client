import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharePipesModule } from 'src/app/share-pipes/share-pipes.module';
import { WaitingRoomComponent } from './waiting-room.component';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomComponent,
  },
];

@NgModule({
  imports: [SharePipesModule, CommonModule, RouterModule.forChild(routes)],
  exports: [WaitingRoomComponent],
  declarations: [WaitingRoomComponent],
  providers: [],
})
export class WaitingRoomModule {}
