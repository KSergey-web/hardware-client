import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { map, tap, mergeMap, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { API_URL } from './app.module';
import { roleUserEnum } from './enums/role-user.enum';
import { IUser } from './interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _currentUser$: ReplaySubject<IUser> = new ReplaySubject(1);
  private _currentUser?: IUser;
  private onDestroy$ = new Subject<boolean>();
  
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
    this._currentUser$.complete();
  }

  get currentUser$(): Observable<IUser> {
    return this._currentUser$.asObservable();
  }

  get currentUser(): IUser | undefined {
    return this._currentUser;
  }

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private router: Router
  ) {
    if (this.isLoggedIn()) {
      this.setСurrentUser$();
    }
    this.currentUser$.subscribe((user) => {
      this._currentUser = user;
    });
  }

  login({ email: identifier, password }: any): Observable<any> {
    return this.http
      .post<{ user: IUser; jwt: string }>(`${this.apiUrl}/api/auth/local`, {
        identifier,
        password,
      })
      .pipe(
        tap((res) => {
          this.setSession(res);
        })
      );
  }

  private assignStatus(user: IUser): Observable<IUser> {
    return this.http
      .get<any>(`${this.apiUrl}/api/students?filters[user][id][$eq]=${user.id}`)
      .pipe(
        mergeMap((res: { data: any[] }) => {
          if (res.data.length > 0) {
            user.role = roleUserEnum.student;
            return of(user);
          } else {
            return this.http
              .get<any>(
                `${this.apiUrl}/api/teachers?filters[user][id][$eq]=${user.id}`
              )
              .pipe(
                takeUntil(this.onDestroy$)
              ,
                tap((res) => {
                  if (res.data.length == 0) {
                    throw new Error('Not found role');
                  }
                }),
                map(() => {
                  user.role = roleUserEnum.teacher;
                  return user;
                }),
                catchError((err: Error) => {
                  alert(err.message);
                  this.logout();
                  return of(user);
                })
              );
          }
        })
      );
  }

  private getCurrentUser(): Observable<IUser> {
    return this.http
      .get<IUser>(`${this.apiUrl}/api/users/me`)
      .pipe(switchMap(this.assignStatus.bind(this)));
  }

  private setСurrentUser$(user?: IUser): void {
    if (user) {
      this.assignStatus(user).pipe(takeUntil(this.onDestroy$)
      ).subscribe((user) =>
        this._currentUser$.next(user)
      );
      return;
    }
    this.getCurrentUser().pipe(takeUntil(this.onDestroy$)).subscribe((user: IUser) => {
      this._currentUser$.next(user);
    });
  }

  private setSession(authResult: { user: IUser; jwt: string }) {
    localStorage.setItem('id_token', authResult.jwt);
    this.setСurrentUser$(authResult.user);
    //const expiresAt = moment().add(authResult.expiresIn, 'second');
    //localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    console.log('logout');
    localStorage.removeItem('id_token');
    this.router.navigate(['signin']);
    //localStorage.removeItem("expires_at");
  }

  public isLoggedIn(): boolean {
    return !!this.getExpiration();
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  getExpiration() {
    return localStorage.getItem('id_token');
  }

  // getExpiration() {
  //   const expiration = localStorage.getItem("expires_at");
  //   const expiresAt = JSON.parse(expiration);
  //   return moment(expiresAt);
  // }
}
