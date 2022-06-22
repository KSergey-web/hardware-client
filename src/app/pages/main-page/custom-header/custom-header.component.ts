import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModalDialogBoxBuilder } from 'src/app/widgets/common-dialog-boxes/common-modal-dialog-box-builder.class';
import { roleUserEnum } from '../../../enums/role-user.enum';
import { IUser } from '../../../interfaces/user.interface';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
})
export class CustomHeaderComponent implements OnInit, OnDestroy {
  currentUser?: IUser;

  constructor(
    private authService: AuthService,
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
    this.authService.currentUser$.pipe(takeUntil(this.onDestroy$)).subscribe(
      (user) => (this.currentUser = user),
      (err: Error) => {
        alert(
          'Не удалось получить данные. Перезагрузите страницу и проверьте подключение к интернету'
        );
      }
    );
  }

  openLogout(): void {
    const bulder = new CommonModalDialogBoxBuilder(this.modalService);
    const modalRef = bulder
      .addHeader('Выход')
      .addText('Вы уверены что хотите выйти?')
      .addAcceptButtonText('Да')
      .setDangerStyle()
      .openConfirmModal();
    modalRef.closed.pipe(takeUntil(this.onDestroy$)).subscribe((res) => {
      if (res) {
        this.authService.logout();
      }
    });
  }
}
