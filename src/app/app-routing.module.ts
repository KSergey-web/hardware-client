import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckAuthChildGuard } from './guards/check-auth-child.guard';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { CheckTeacherGuard } from './guards/check-teacher.guard';
import { MainPageComponent } from './pages/main-page/main-page.component';

// определение дочерних маршрутов
const mainPageRoutes: Routes = [
  {
    path: 'my-sessions',
    loadChildren: () =>
      import(
        './pages/sessions-of-current-user/sessions-of-current-user.module'
      ).then((m) => m.SessionsOfCurrentUserModule),
  },
  {
    path: 'find-sessions',
    loadChildren: () =>
      import('./pages/find-sessions/find-sessions.module').then(
        (m) => m.FindSessionsModule
      ),
    canMatch: [CheckTeacherGuard],
  },
  {
    path: 'manage-sessions',
    loadChildren: () =>
      import('./pages/sessions-management/sessions-management.module').then(
        (m) => m.SessionsManagementModule
      ),
    canMatch: [CheckTeacherGuard],
  },
  {
    path: 'managing-subgroups',
    loadChildren: () =>
      import('./pages/managing-subgroups/managing-subgroups.module').then(
        (m) => m.ManagingSubgroupsModule
      ),
    canMatch: [CheckTeacherGuard],
  },

  {
    path: 'my-subgroups',
    loadChildren: () =>
      import(
        './pages/subgroups-current-user/subgroups-current-user.module'
      ).then((m) => m.SubgroupsCurrentUserModule),
  },
  {
    path: 'subgroup',
    loadChildren: () =>
      import('./pages/subgroup/subgroup.module').then((m) => m.SubgroupModule),
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
    loadChildren: () =>
      import('./pages/session-in-progress/session-in-progress.module').then(
        (m) => m.SessionInProgressModule
      ),
    canMatch: [CheckAuthGuard],
  },
  {
    path: 'waiting-room/:id',
    loadChildren: () =>
      import('./pages/waiting-room/waiting-room.module').then(
        (m) => m.WaitingRoomModule
      ),
    canMatch: [CheckAuthGuard],
  },
  {
    path: 'signin',
    loadChildren: () =>
      import('./pages/sign-in/sign-in.module').then((m) => m.SignInModule),
  },
  { path: '**', redirectTo: '/main-page/my-sessions' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
