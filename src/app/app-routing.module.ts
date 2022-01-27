import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { SessionsManagementComponent } from './sessions-management/sessions-management.component';
import { SessionsOfCurrentUserComponent } from './sessions-of-current-user/sessions-of-current-user.component';
import { SignInComponent } from './sign-in/sign-in.component';

// определение дочерних маршрутов
const mainPageRoutes: Routes = [
      { path: 'my-sessions', component: SessionsOfCurrentUserComponent},
      { path: 'manage-sessions', component: SessionsManagementComponent},
  ];

const routes: Routes = [
  { path: '', component: MainPageComponent, children: mainPageRoutes },
  { path: 'signin', component: SignInComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
