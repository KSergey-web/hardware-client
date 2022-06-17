import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanDeactivate,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SessionInProgressComponent } from '../pages/session-in-progress/session-in-progress.component';

@Injectable({
  providedIn: 'root',
})
export class ExitSessionInProgressGuard
  implements CanDeactivate<SessionInProgressComponent>
{
  constructor() {}

  canDeactivate(
    component: SessionInProgressComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!component.timer || component.timer?.isFinished) return true;
    const res = confirm('Вы уверены что хотите покинуть сессию?');
    return res;
  }
}
