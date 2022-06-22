import { NgModule } from '@angular/core';
import { FioPipe } from './fio/fio.pipe';
import { SafePipe } from './safe/safe.pipe';
import { TimerPipe } from './timer/timer.pipe';
@NgModule({
  declarations: [SafePipe, TimerPipe, FioPipe],
  exports: [SafePipe, TimerPipe, FioPipe],
})
export class SharePipesModule {}
