import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { API_URL } from './app.module';
import { IUser } from './interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _currentUser: ReplaySubject<IUser> = new ReplaySubject(1);

  get currentUser$(): Observable<IUser> {
      return this._currentUser.asObservable();
  }

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private router: Router,
  ) {
    if (this.isLoggedIn()){
      this.setСurrentUser$();
    }
  }

  login({ email: identifier, password }: any): Observable<any> {
    return this.http.post<{user: IUser, jwt: string}>(`${this.apiUrl}/api/auth/local`, { identifier, password }).pipe(tap(res => {this.setSession(res)}))
  }

  private getCurrentUser(): Observable<IUser>{
    return this.http.get<IUser>(`${this.apiUrl}/api/users/me`);
  }

  private setСurrentUser$(user?: IUser): void{
    if (user){
      this._currentUser.next(user);
      return;
    }
    this.getCurrentUser().subscribe((user: IUser) => {
      this._currentUser.next(user)
    })
  }


  private setSession(authResult: {user: IUser, jwt: string}) {
    this.setСurrentUser$(authResult.user)
    //const expiresAt = moment().add(authResult.expiresIn, 'second');
    localStorage.setItem('id_token', authResult.jwt);
    //localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    console.log('logout')
    localStorage.removeItem("id_token");
    this.router.navigate((['signin']))
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

