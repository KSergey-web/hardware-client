import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbModalModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { SharePipesModule } from 'src/app/share-pipes/share-pipes.module';
import { CreateSubgroupComponent } from './create-subgroup/create-subgroup.component';
import { ManagingSubgroupsComponent } from './managing-subgroups.component';
import { AddUserComponent } from './subgroup-form/add-user/add-user.component';
import { SubgroupFormComponent } from './subgroup-form/subgroup-form.component';

const routes: Routes = [
  {
    path: '',
    component: ManagingSubgroupsComponent,
  },
];

@NgModule({
  declarations: [
    ManagingSubgroupsComponent,
    SubgroupFormComponent,
    AddUserComponent,
    CreateSubgroupComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    CommonModule,
    NgbModalModule,
    NgbCollapseModule,
    SharePipesModule,
    NgbDatepickerModule,
    RouterModule.forChild(routes),
  ],
  exports: [SubgroupFormComponent, ManagingSubgroupsComponent],
})
export class ManagingSubgroupsModule {}
