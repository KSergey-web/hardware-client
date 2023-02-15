import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanMatch,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { roleUserEnum } from '../enums/role-user.enum';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CheckTeacherGuard implements CanActivate, CanMatch {
  constructor(private router: Router, private authService: AuthService) {}

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.condition();
  }

  private condition(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map((user): boolean => {
        if (user.role === roleUserEnum.teacher) return true;
        this.router.navigate(['my-sessions']);
        return false;
      })
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.condition();
  }
}
