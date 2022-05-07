import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import {
  map,
  tap,
  mergeMap,
  switchMap,
  catchError,
  takeUntil,
} from 'rxjs/operators';
import { API_URL } from '../app.module';
import { roleUserEnum } from '../enums/role-user.enum';
import { IUser } from '../interfaces/user.interface';
import { StudentService } from './student.service';
import { TeacherService } from './teacher.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _currentUser$: ReplaySubject<IUser> = new ReplaySubject(1);
  private _currentUser?: IUser;
  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.clearMemory();
  }

  private clearMemory(){
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
    this._currentUser$.complete();
    this._currentUser$ = new ReplaySubject(1);
    this._currentUser = undefined;
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
    private router: Router,
    private studentService: StudentService,
    private teacherService: TeacherService
  ) {
    if (this.isLoggedIn()) {
      this.setСurrentUser$();
    }
    this.currentUser$.subscribe((user) => {
      this._currentUser = user;
    });
  }


  get authToken(){
    return localStorage.getItem('id_token');
  }

  get authBearerToken(){
    return 'Bearer ' + this.authToken;
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

  private unpuckRoleAndAssingToUser(user: IUser): IUser {
    user.role = (user.role as any).type;
    return user;
  }

  private getCurrentUser(): Observable<IUser> {
    return this.http
      .get<IUser>(`${this.apiUrl}/api/users/me`)
      .pipe(map(this.unpuckRoleAndAssingToUser.bind(this)));
  }

  private setСurrentUser$(): void {
    this.getCurrentUser()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (user: IUser) => {
          this._currentUser$.next(user);
        },
        error: (err: Error) => {
          console.error(err);
          alert(err.message);
          this.logout();
        },
      });
  }

  private setSession(authResult: { jwt: string }) {
    localStorage.setItem('id_token', authResult.jwt);
    this.setСurrentUser$();
    //const expiresAt = moment().add(authResult.expiresIn, 'second');
    //localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    console.log('logout');
    localStorage.removeItem('id_token');
    this.router.navigate(['signin']);
    this.clearMemory();
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
