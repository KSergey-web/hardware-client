import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonDialogBoxesModule } from './widgets/common-dialog-boxes/common-dialog-boxes.module';
import { CustomHeaderComponent } from './pages/main-page/custom-header/custom-header.component';
import { LogoutComponent } from './pages/main-page/custom-header/logout/logout.component';
import { FindSessionsComponent } from './pages/find-sessions/find-sessions.component';
import { httpInterceptorProviders } from './http-interceptors.ts';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { SessionInProgressModule } from './pages/session-in-progress/session-in-progress.module';
import { EditSessionComponent } from './pages/sessions-management/edit-session/edit-session.component';
import { NewSessionComponent } from './pages/sessions-management/new-session/new-session.component';
import { SessionDateFormComponent } from './pages/sessions-management/session-form/session-date-form/session-date-form.component';
import { SessionFormComponent } from './pages/sessions-management/session-form/session-form.component';
import { SessionsManagementComponent } from './pages/sessions-management/sessions-management.component';
import { SessionsOfCurrentUserComponent } from './pages/sessions-of-current-user/sessions-of-current-user.component';
import { StartedSessionsComponent } from './pages/sessions-of-current-user/started-sessions/started-sessions.component';
import { SharePipesModule } from './share-pipes/share-pipes.module';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { API_URL } from './urls-tokens';
import { WaitingRoomComponent } from './pages/waiting-room/waiting-room.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    CustomHeaderComponent,
    MainPageComponent,
    NewSessionComponent,
    SessionDateFormComponent,
    SessionsOfCurrentUserComponent,
    SessionFormComponent,
    EditSessionComponent,
    SessionsManagementComponent,
    LogoutComponent,
    StartedSessionsComponent,
    FindSessionsComponent,
    WaitingRoomComponent,
  ],
  imports: [
    SharePipesModule,
    SessionInProgressModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    CommonDialogBoxesModule,
  ],
  providers: [
    httpInterceptorProviders,
    {
      provide: API_URL,
      useValue: environment.serverAddres,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
