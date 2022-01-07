import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { API_URL } from './app.module';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {
  }

  login({ email: identifier, password }: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/auth/local`, { identifier, password }).pipe(tap(res => this.setSession(res)),shareReplay())
  }

  private setSession(authResult: any) {
    //const expiresAt = moment().add(authResult.expiresIn, 'second');
    localStorage.setItem('id_token', authResult.jwt);
    //localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem("id_token");
    //localStorage.removeItem("expires_at");
  }

  public isLoggedIn(): boolean {
    return !!this.getExpiration();
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  getExpiration() {
      return localStorage.getItem("id_token");
  }

  // getExpiration() {
  //   const expiration = localStorage.getItem("expires_at");
  //   const expiresAt = JSON.parse(expiration);
  //   return moment(expiresAt);
  // }
}

