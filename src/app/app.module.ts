import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { httpInterceptorProviders } from './http-interceptors.ts';
import { MainPageModule } from './pages/main-page/main-page.module';
import { SignInModule } from './pages/sign-in/sign-in.module';
import { WaitingRoomModule } from './pages/waiting-room/waiting-room.module';
import { API_AUTH_URL, API_URL } from './urls-tokens';
import { CommonDialogBoxesModule } from './widgets/common-dialog-boxes/common-dialog-boxes.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    SignInModule,
    WaitingRoomModule,
    MainPageModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonDialogBoxesModule,
  ],
  providers: [
    httpInterceptorProviders,
    {
      provide: API_URL,
      useValue: environment.serverAddres,
    },
    {
      provide: API_AUTH_URL,
      useValue: environment.authServerAddres,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
