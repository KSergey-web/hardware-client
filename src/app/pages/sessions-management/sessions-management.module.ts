import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbPaginationModule,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { SharePipesModule } from 'src/app/share-pipes/share-pipes.module';
import { EditSessionComponent } from './edit-session/edit-session.component';
import { NewSessionComponent } from './new-session/new-session.component';
import { SessionDateFormComponent } from './session-form/session-date-form/session-date-form.component';
import { SessionFormComponent } from './session-form/session-form.component';
import { SessionsManagementComponent } from './sessions-management.component';

const routes: Routes = [
  {
    path: '',
    component: SessionsManagementComponent,
  },
];


@NgModule({
  imports: [
    NgbTimepickerModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    SharePipesModule,
    CommonModule,
    NgbCollapseModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    SessionsManagementComponent,
    SessionFormComponent,
    NewSessionComponent,
    EditSessionComponent,
    SessionDateFormComponent,
  ],
  exports: [SessionsManagementComponent],
  providers: [],
})
export class SessionsManagementModule {}
