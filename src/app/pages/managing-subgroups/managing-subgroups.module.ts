import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbCollapseModule,
  NgbModalModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { SharePipesModule } from 'src/app/share-pipes/share-pipes.module';
import { ManagingSubgroupsComponent } from './managing-subgroups.component';
import { AddUserComponent } from './subgroup-form/add-user/add-user.component';
import { SubgroupFormComponent } from './subgroup-form/subgroup-form.component';
import { EditSubgroupComponent } from './edit-subgroup/edit-subgroup.component';
import { CreateSubgroupComponent } from './create-subgroup/create-subgroup.component';

@NgModule({
  declarations: [
    ManagingSubgroupsComponent,
    SubgroupFormComponent,
    AddUserComponent,
    EditSubgroupComponent,
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
  ],
})
export class ManagingSubgroupsModule {}
