import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { IUser } from 'src/app/interfaces/user.interface';
import { SubgroupService } from 'src/app/services/subgroup.service';
import { INewSubgroup } from '../interfaces/new-subgroup.interface';
import { CommonModalDialogBoxBuilder } from 'src/app/widgets/common-dialog-boxes/common-modal-dialog-box-builder.class';

@Component({
  selector: 'app-subgroup-form',
  templateUrl: './subgroup-form.component.html',
  styleUrls: ['./subgroup-form.component.scss'],
})
export class SubgroupFormComponent implements OnInit, OnDestroy {
  subgroupForm!: FormGroup;
  users: IUser[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private subgroupService: SubgroupService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    this.initForm();
  }
  ngOnInit(): void {}

  getFioByUser(user: IUser): string {
    return user.first_name + ' ' + user.last_name + ' ' + user.patronymic;
  }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  private initForm(): void {
    this.subgroupForm = this.formBuilder.group({
      name: ['', [Validators.minLength(2), Validators.maxLength(40)]],
    });
  }

  isNewSessionInvalid(): boolean {
    return this.subgroupForm.invalid;
  }

  getDataFromForm(): INewSubgroup {
    return {
      name: this.subgroupForm.controls.name.value,
      users: this.users,
    };
  }

  submit() {
    const subgroup = this.getDataFromForm();
    this.subgroupService.createSubgroup(subgroup).subscribe({
      next: (res) => this.activeModal.close(res),
      error: (err: HttpErrorResponse) => {
        console.log(err);
        const bulder = new CommonModalDialogBoxBuilder(this.modalService);
        bulder
          .addHeader('Ошибка')
          .addText(
            `Не удалось создать подгруппу. Статус ${err.status}. ${err.message}`
          )
          .setDangerStyle()
          .openAlertModal();
      },
    });
  }

  onAddUser(newUser: IUser) {
    const ind = this.users.findIndex((user) => user.id === newUser.id);
    if (ind !== -1) return;
    this.users.push(newUser);
    this.users = this.users.sort();
  }

  deleteUser(user: IUser) {
    const ind = this.users.indexOf(user);
    this.users.splice(ind, 1);
  }
}
