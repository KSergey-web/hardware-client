import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { IUser } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { CommonModalDialogBoxBuilder } from 'src/app/widgets/common-dialog-boxes/common-modal-dialog-box-builder.class';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private modalService: NgbModal
  ) {}

  private onDestroy$ = new Subject<boolean>();

  isLoading = false;

  @Output() onAddUser = new EventEmitter<IUser>();

  isAddUserCollapsed = true;

  fio = new FormControl('', {
    validators: [Validators.maxLength(40), Validators.minLength(1)],
  });

  selectedUser?: IUser;

  users: IUser[] = [];

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  selectUser(user: IUser) {
    this.selectedUser = user;
  }

  clearTempate() {
    this.users = [];
    this.selectedUser = undefined;
    this.fio.setValue('', { emitEvent: false });
  }

  checkSelectedUserInArray() {
    if (!this.selectedUser) return;
    for (let user of this.users) {
      if (this.selectedUser?.id === user.id) {
        return;
      }
    }
    this.selectedUser = undefined;
  }

  subOnFioChange() {
    this.fio.valueChanges
      .pipe(
        filter(this.isNotEmptyFio.bind(this)),
        debounceTime(500),
        takeUntil(this.onDestroy$)
      )
      .subscribe({
        next: (fio) => {
          this.isLoading = true;
          this.userService
            .getUsersByFIO(fio)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((users) => {
              this.isLoading = false;
              this.users = users;
              this.checkSelectedUserInArray();
            });
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          const bulder = new CommonModalDialogBoxBuilder(this.modalService);
          bulder
            .addHeader('Ошибка')
            .addText(
              `Не удалось получить данные с сервера. Статус ${err.status}. ${err.message}`
            )
            .setDangerStyle()
            .openAlertModal();
        },
      });
  }

  ngOnInit(): void {
    this.subOnFioChange();
  }

  isNotEmptyFio(): boolean {
    const str = this.fio.value.trim();
    return !!str;
  }

  addUser(): void {
    this.onAddUser.emit(this.selectedUser);
    this.isAddUserCollapsed = true;
    this.clearTempate();
  }
}
