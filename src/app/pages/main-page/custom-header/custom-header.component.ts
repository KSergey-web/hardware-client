import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { roleUserEnum } from '../../../enums/role-user.enum';
import { IUser } from '../../../interfaces/user.interface';
import { AuthService } from '../../../services/auth.service';
import { LogoutComponent } from './logout/logout.component';

@Component({
  selector: 'app-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
})
export class CustomHeaderComponent implements OnInit, OnDestroy {
  currentUser?: IUser;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  isTeacher(): boolean {
    return this.currentUser?.role == roleUserEnum.teacher;
  }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    if (this.authService.isLoggedOut()) {
      this.router.navigate(['']);
      return;
    }
    this.authService.currentUser$.pipe(takeUntil(this.onDestroy$)).subscribe(
      (user) => (this.currentUser = user),
      (err: Error) => {
        alert("Сouldn't get your data");
        console.error(err);
        this.authService.logout();
        this.router.navigate(['signin']);
      }
    );
  }

  openLogout(): void {
    const modalRef = this.modalService.open(LogoutComponent);
  }
}
