import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { LogoutComponent } from './custom-header/logout/logout.component';
import { EditSessionComponent } from './edit-session/edit-session.component';
import { FindSessionsComponent } from './find-sessions/find-sessions.component';
import { httpInterceptorProviders } from './http-interceptors.ts';
import { MainPageComponent } from './main-page/main-page.component';
import { NewSessionComponent } from './new-session/new-session.component';
import { SessionDateFormComponent } from './session-form/session-date-form/session-date-form.component';
import { SessionFormComponent } from './session-form/session-form.component';
import { SessionInProgressModule } from './session-in-progress/session-in-progress.module';
import { SessionsManagementComponent } from './sessions-management/sessions-management.component';
import { SessionsOfCurrentUserComponent } from './sessions-of-current-user/sessions-of-current-user.component';
import { StartedSessionsComponent } from './sessions-of-current-user/started-sessions/started-sessions.component';
import { SharePipesModule } from './share/share-pipes.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { API_URL } from './urls-tokens';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';

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
