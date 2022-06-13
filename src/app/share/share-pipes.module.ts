import { NgModule } from '@angular/core';
import { SafePipe } from './safe/safe.pipe';
import { TimerPipe } from './timer/timer.pipe';
@NgModule({
  declarations: [SafePipe, TimerPipe],
  exports: [SafePipe, TimerPipe],
})
export class SharePipesModule {}
