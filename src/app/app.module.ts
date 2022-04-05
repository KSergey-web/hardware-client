import { InjectionToken, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './http-interceptors.ts/auth.interceptor';
import { environment } from 'src/environments/environment';
import { httpInterceptorProviders } from './http-interceptors.ts';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NewSessionComponent } from './new-session/new-session.component';
import { SessionDateFormComponent } from './session-form/session-date-form/session-date-form.component';
import { SessionsOfCurrentUserComponent } from './sessions-of-current-user/sessions-of-current-user.component';
import { SessionFormComponent } from './session-form/session-form.component';
import { EditSessionComponent } from './edit-session/edit-session.component';
import { SessionsManagementComponent } from './sessions-management/sessions-management.component';
import { LogoutComponent } from './custom-header/logout/logout.component';
import { StartedSessionsComponent } from './sessions-of-current-user/started-sessions/started-sessions.component';
import { SessionInProgressComponent } from './session-in-progress/session-in-progress.component';
import { TimerPipe } from './session-in-progress/timer.pipe';
import { FindSessionsComponent } from './find-sessions/find-sessions.component';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { STK500Component } from './session-in-progress/stk500/stk500.component';
import { EquipmentDirective } from './session-in-progress/equipment.directive';
import { SafePipe } from './pipes/safe.pipe';

export const API_URL = new InjectionToken<string>('api url');
export const API_STK500_URL = new InjectionToken<string>('api url stk500');

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
    SessionInProgressComponent,
    TimerPipe,
    FindSessionsComponent,
    WaitingRoomComponent,
    STK500Component,
    EquipmentDirective,
    SafePipe
  ],
  imports: [
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
    {
      provide: API_STK500_URL,
      useValue: environment.labServerAddres,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
