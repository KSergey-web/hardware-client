import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FindSessionsModule } from '../find-sessions/find-sessions.module';
import { ManagingSubgroupsModule } from '../managing-subgroups/managing-subgroups.module';
import { SessionInProgressModule } from '../session-in-progress/session-in-progress.module';
import { SessionsManagementModule } from '../sessions-management/sessions-management.module';
import { SessionsOfCurrentUserModule } from '../sessions-of-current-user/sessions-of-current-user.module';
import { SubgroupModule } from '../subgroup/subgroup.module';
import { SubgroupsCurrentUserModule } from '../subgroups-current-user/subgroups-current-user.module';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { ResponsiveHeaderDirective } from './custom-header/responsive-header.directive';
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
    ManagingSubgroupsModule,
    SubgroupModule,
    SubgroupsCurrentUserModule,
  ],
  declarations: [
    MainPageComponent,
    CustomHeaderComponent,
    ResponsiveHeaderDirective,
  ],
  providers: [],
})
export class MainPageModule {}
