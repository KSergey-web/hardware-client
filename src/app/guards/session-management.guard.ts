import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { roleUserEnum } from '../enums/role-user.enum';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SessionManagementGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authService.currentUser$.pipe(
      map((user): boolean => {
        if (user.role === roleUserEnum.teacher) return true;
        this.router.navigate(['my-sessions']);
        return false;
      })
    );
  }
}
