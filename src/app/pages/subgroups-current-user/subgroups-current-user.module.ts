import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharePipesModule } from 'src/app/share-pipes/share-pipes.module';
import { SubgroupsCurrentUserComponent } from './subgroups-current-user.component';

const routes: Routes = [
  {
    path: '',
    component: SubgroupsCurrentUserComponent,
  },
];

@NgModule({
  imports: [CommonModule, SharePipesModule, RouterModule.forChild(routes)],
  exports: [SubgroupsCurrentUserComponent],
  declarations: [SubgroupsCurrentUserComponent],
  providers: [],
})
export class SubgroupsCurrentUserModule {}
