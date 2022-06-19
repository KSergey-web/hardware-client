import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharePipesModule } from 'src/app/share-pipes/share-pipes.module';
import { SessionsOfCurrentUserComponent } from './sessions-of-current-user.component';
import { StartedSessionsComponent } from './started-sessions/started-sessions.component';

@NgModule({
  imports: [SharePipesModule, CommonModule],
  declarations: [SessionsOfCurrentUserComponent, StartedSessionsComponent],
  providers: [],
})
export class SessionsOfCurrentUserModule {}
