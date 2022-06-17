import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class SessionInProgressGuard implements CanActivate {
  constructor(private sessionService: SessionService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const id: string = route.params.id;
    return this.sessionService.canConnect(+id).pipe(
      take(1),
      map((res) => true),
      catchError((err): Observable<boolean> => {
        this.router.navigate(['my-sessions']);
        console.log(err);
        return of(false);
      })
    );
  }
}
