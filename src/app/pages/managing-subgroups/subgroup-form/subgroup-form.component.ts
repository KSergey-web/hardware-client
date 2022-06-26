import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { IUser } from 'src/app/interfaces/user.interface';
import { INewSubgroup } from '../interfaces/new-subgroup.interface';
import { ISubgroupFormProperties } from './subgroup-form-properties.inteface';

@Component({
  selector: 'app-subgroup-form',
  templateUrl: './subgroup-form.component.html',
  styleUrls: ['./subgroup-form.component.scss'],
})
export class SubgroupFormComponent implements OnInit, OnDestroy {
  subgroupForm!: FormGroup;
  users: IUser[] = [];
  acceptButtonText = 'Ок';
  creator?: IUser;

  @Input() initValuesForForm!: ISubgroupFormProperties;
  @Output() onSubmit = new EventEmitter<INewSubgroup>();

  constructor(private formBuilder: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.setInitValuesToForm();
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

  setInitValuesToForm() {
    this.subgroupForm.controls.name.setValue(this.initValuesForForm!.name);
    this.users = this.initValuesForForm.users ?? [];
    this.acceptButtonText = this.initValuesForForm.acceptButtonText ?? '';
    this.creator = this.initValuesForForm.creator;
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

  submit() {
    const subgroup = this.getDataFromForm();
    this.onSubmit.emit(subgroup);
  }
}
