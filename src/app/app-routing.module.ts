import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckAuthChildGuard } from './guards/check-auth-child.guard';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { CheckTeacherGuard } from './guards/check-teacher.guard';
import { ExitSessionInProgressGuard } from './guards/exit-session-in-progress.guard';
import { SessionInProgressGuard } from './guards/session-in-progress.guard';
import { FindSessionsComponent } from './pages/find-sessions/find-sessions.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { SessionInProgressComponent } from './pages/session-in-progress/session-in-progress.component';
import { SessionsManagementComponent } from './pages/sessions-management/sessions-management.component';
import { SessionsOfCurrentUserComponent } from './pages/sessions-of-current-user/sessions-of-current-user.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { WaitingRoomComponent } from './pages/waiting-room/waiting-room.component';

// определение дочерних маршрутов
const mainPageRoutes: Routes = [
  {
    path: 'my-sessions',
    component: SessionsOfCurrentUserComponent,
  },
  {
    path: 'find-sessions',
    component: FindSessionsComponent,
    canActivate: [CheckTeacherGuard],
  },
  {
    path: 'manage-sessions',
    component: SessionsManagementComponent,
    canActivate: [CheckTeacherGuard],
  },
];

const routes: Routes = [
  {
    path: 'main-page',
    redirectTo: '/main-page/my-sessions',
    pathMatch: 'full',
  },
  {
    path: 'main-page',
    component: MainPageComponent,
    children: mainPageRoutes,
    canActivateChild: [CheckAuthChildGuard],
  },
  {
    path: 'session/:id',
    component: SessionInProgressComponent,
    canActivate: [CheckAuthGuard, SessionInProgressGuard],
    canDeactivate: [ExitSessionInProgressGuard],
  },
  {
    path: 'waiting-room/:id',
    component: WaitingRoomComponent,
    canActivate: [CheckAuthGuard, SessionInProgressGuard],
  },
  { path: 'signin', component: SignInComponent },
  { path: '**', redirectTo: '/main-page/my-sessions' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
