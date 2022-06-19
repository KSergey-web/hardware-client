import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbButtonsModule,
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

@NgModule({
  imports: [
    NgbTimepickerModule,
    NgbDatepickerModule,
    NgbButtonsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    SharePipesModule,
    CommonModule,
    NgbCollapseModule,
  ],
  declarations: [
    SessionsManagementComponent,
    SessionFormComponent,
    NewSessionComponent,
    EditSessionComponent,
    SessionDateFormComponent,
  ],
  providers: [],
})
export class SessionsManagementModule {}
