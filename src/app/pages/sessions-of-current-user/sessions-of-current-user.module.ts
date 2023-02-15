import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharePipesModule } from 'src/app/share-pipes/share-pipes.module';
import { SessionsOfCurrentUserComponent } from './sessions-of-current-user.component';
import { StartedSessionsComponent } from './started-sessions/started-sessions.component';

const routes: Routes = [
  {
    path: '',
    component: SessionsOfCurrentUserComponent,
  },
];

@NgModule({
  imports: [SharePipesModule, CommonModule, RouterModule.forChild(routes)],
  declarations: [SessionsOfCurrentUserComponent, StartedSessionsComponent],
  providers: [],
  exports: [SessionsOfCurrentUserComponent],
})
export class SessionsOfCurrentUserModule {}
