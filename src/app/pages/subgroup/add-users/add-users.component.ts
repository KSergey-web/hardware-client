import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  finalize,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { ISubgroup } from 'src/app/interfaces/subgroup.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { SubgroupService } from 'src/app/services/subgroup.service';
import { CommonModalDialogBoxBuilder } from 'src/app/widgets/common-dialog-boxes/common-modal-dialog-box-builder.class';
import { LdapGroupStoreService } from './ldap-group-store.service';
import { ILdapUser } from './ldap-user.interface';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss'],
  providers: [LdapGroupStoreService],
})
export class AddUsersComponent implements OnInit, OnDestroy {
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private ldapGroupStoreService: LdapGroupStoreService,
    private subgroupService: SubgroupService
  ) {}

  private onDestroy$ = new Subject<boolean>();

  isLoading = false;

  set subgroup(subgroup: ISubgroup) {
    this._subgroup = subgroup;
    this._subgroup.users = subgroup.users ?? [];
  }

  private _subgroup!: ISubgroup;

  get subgroup() {
    return this._subgroup;
  }

  @Output() onAddUser = new EventEmitter<IUser>();

  groupName = new FormControl('', {
    validators: [Validators.maxLength(40), Validators.minLength(1)],
  });

  foundUsers: ILdapUser[] = [];

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onDissmis() {
    this.activeModal.dismiss();
  }

  onClickUser(clickedUser: ILdapUser) {
    if (this.isUserAlreadyInSubgroup(clickedUser)) return;
    const ind = this.selectedUsers.findIndex((user) => user == clickedUser);
    if (ind === -1) {
      this.selectedUsers.push(clickedUser);
      return;
    }
    this.selectedUsers.splice(ind, 1);
  }

  clearTempate() {}

  selectedUsers: ILdapUser[] = [];

  subOnGroupNameChange() {
    this.groupName.valueChanges
      .pipe(
        filter(this.isNotEmptyString.bind(this)),
        debounceTime(1000),
        takeUntil(this.onDestroy$),
        switchMap((groupName) => {
          this.isLoading = true;
          this.selectedUsers = [];
          console.log(123);
          return this.ldapGroupStoreService.getUsersByGroup(groupName).pipe(
            takeUntil(this.onDestroy$),
            catchError((err) => {
              console.error(err);
              return of([]);
            }),
            finalize(() => {
              this.isLoading = false;
            })
          );
        })
      )
      .subscribe({
        next: (users) => {
          this.foundUsers = users;
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

  isUserAlreadyInSubgroup(checkUser: ILdapUser): boolean {
    return !!this.subgroup.users!.find(
      (user) => user.username === checkUser.username
    );
  }

  ngOnInit(): void {
    this.subOnGroupNameChange();
  }

  isNotEmptyString(): boolean {
    const str = this.groupName.value.trim();
    return !!str;
  }

  addUsersToSubgoup() {
    this.ldapGroupStoreService
      .addUsersToSubgroup(this._subgroup.id, this.selectedUsers)
      .subscribe(
        (res) => {
          const bulder = new CommonModalDialogBoxBuilder(this.modalService);
          bulder
            .addHeader('Ошибка')
            .addText(`Состав подгруппы обновлен`)
            .setInfoStyle()
            .openAlertModal();
          this.getSubgroup();
        },
        (err) => console.log(err)
      );
  }

  selectAll() {
    this.selectedUsers = this.foundUsers;
  }

  private getSubgroup(): void {
    this.subgroupService
      .getSubgroupById(this.subgroup!.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((subgroup) => (this.subgroup = subgroup));
  }
}
