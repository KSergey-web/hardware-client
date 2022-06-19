import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FindSessionsModule } from '../find-sessions/find-sessions.module';
import { SessionInProgressModule } from '../session-in-progress/session-in-progress.module';
import { SessionsManagementModule } from '../sessions-management/sessions-management.module';
import { SessionsOfCurrentUserModule } from '../sessions-of-current-user/sessions-of-current-user.module';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { LogoutComponent } from './custom-header/logout/logout.component';
import { MainPageComponent } from './main-page.component';

@NgModule({
  imports: [
    SessionsOfCurrentUserModule,
    AppRoutingModule,
    SessionsManagementModule,
    FindSessionsModule,
    SessionInProgressModule,
    NgbModalModule,
    CommonModule,
  ],
  declarations: [MainPageComponent, CustomHeaderComponent, LogoutComponent],
  providers: [],
})
export class MainPageModule {}
