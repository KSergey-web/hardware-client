import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharePipesModule } from 'src/app/share-pipes/share-pipes.module';
import { SubgroupsCurrentUserComponent } from './subgroups-current-user.component';

@NgModule({
  imports: [CommonModule, SharePipesModule],
  exports: [SubgroupsCurrentUserComponent],
  declarations: [SubgroupsCurrentUserComponent],
  providers: [],
})
export class SubgroupsCurrentUserModule {}
