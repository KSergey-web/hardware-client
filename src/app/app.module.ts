import { InjectionToken, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule }   from '@angular/common/http';
import { AuthInterceptor } from './http-interceptors.ts/auth.interceptor';
import { environment } from 'src/environments/environment';
import { httpInterceptorProviders } from './http-interceptors.ts';

export const API_URL = new InjectionToken<string>('api url');

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule, 
    NgbModule,
    HttpClientModule
  ],
  providers: [
    httpInterceptorProviders,
    {
      provide: API_URL,
      useValue: environment.serverAddres
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
