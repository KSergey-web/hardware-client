import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { IUser } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService) {}

  private onDestroy$ = new Subject<boolean>();

  @Output() onAddUser = new EventEmitter<IUser>();

  isAddUserCollapsed = true;

  fio = new FormControl('', {
    validators: [Validators.maxLength(40), Validators.minLength(2)],
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

  getFioByUser(user: IUser): string {
    return user.first_name + ' ' + user.last_name + ' ' + user.patronymic;
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
      .pipe(debounceTime(500), takeUntil(this.onDestroy$))
      .subscribe((fio) => {
        if (!this.isValidStrFio()) return;
        this.userService
          .getUsersByFIO(fio)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((users) => {
            this.users = users;
            this.checkSelectedUserInArray();
          });
      });
  }

  ngOnInit(): void {
    this.subOnFioChange();
  }

  isValidStrFio() {
    const str = this.fio.value.replace(/\s+/g, ' ').trim();
    return !!str;
  }

  addUser(): void {
    this.onAddUser.emit(this.selectedUser);
    this.isAddUserCollapsed = true;
    this.clearTempate();
  }
}
