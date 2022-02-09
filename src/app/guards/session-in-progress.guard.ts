import { Injectable } from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {combineLatest, Observable, of} from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { roleUserEnum } from "../enums/role-user.enum";
import { AuthService } from "../services/auth.service";
import { SessionService } from "../services/session.service";

@Injectable({
    providedIn: 'root'
  })
export class SessionInProgressGuard implements CanActivate{
    constructor(private sessionService: SessionService, private router: Router,private authService: AuthService){
    }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean{
        const id: string = route.params.id;
        if (this.authService.isLoggedOut()) this.router.navigate(['my-sessions']);
        return combineLatest([this.authService.currentUser$, this.sessionService.getSessionById(+id)]).pipe(
            take(1),
            map(([user, session]): boolean => {
            if (user.role === roleUserEnum.teacher)
                return true;
            if (session.user?.id === user.id)
                return true;
            this.router.navigate(['/main-page/my-sessions']);
            return false;
        }),
        catchError((err: Error): Observable<boolean> => {
            console.error(err);
            this.router.navigate(['/main-page/my-sessions']);
            return of(false);
        }));
    }
}