import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  finalize,
  map,
  shareReplay,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { IEquipment } from 'src/app/interfaces/equipment.interface';
import { IGroup } from 'src/app/interfaces/group.interface';
import { IForm } from 'src/app/interfaces/IForm';
import { ISession } from 'src/app/interfaces/session.interface';
import { IStudent } from 'src/app/interfaces/student.interface';
import { AuthService } from 'src/app/services/auth.service';
import { EquipmentService } from 'src/app/services/equipment.service';
import { LdapGroupStoreService } from '../../subgroup/add-users/ldap-group-store.service';
import { ILdapUser } from '../../subgroup/add-users/ldap-user.interface';
import { INewSession } from '../../subgroup/create-session-by-booking/new-session.interface';

@Component({
  selector: 'app-session-form',
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.scss'],
  providers: [LdapGroupStoreService],
})
export class SessionFormComponent implements OnInit, OnDestroy {
  sessionForm!: FormGroup<
    IForm<{ equipment: number; student: ILdapUser | undefined }>
  >;
  radioGroupForm = this.formBuilder.group({
    mode: ['myself'],
  });
  equipments: IEquipment[] = [];
  groups: IGroup[] = [];
  students: IStudent[] = [];

  selectedEquipment?: IEquipment;
  selectedBegin?: Date | null = null;
  selectedEnd?: Date | null = null;

  isDateCollapsed: boolean = true;

  equipmentChanged$!: Observable<IEquipment>;

  @Output() onCreateSession = new EventEmitter<INewSession>();

  @Output() onCreateSessionForUserFromLdap = new EventEmitter<
    Omit<INewSession, 'user'> & { user: ILdapUser }
  >();

  @Input() editedSession: ISession | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private equipmentService: EquipmentService,
    private ldapGroupStoreService: LdapGroupStoreService
  ) {
    this.initForm();
  }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  private initEquipmentChanged$() {
    this.equipmentChanged$ =
      this.sessionForm.controls.equipment.valueChanges.pipe(
        map((i: number) => this.equipments[i])
      );
  }

  private resetSelectedBeginAndEnd(): void {
    this.selectedBegin = null;
    this.selectedEnd = null;
  }

  private initForm(): void {
    this.sessionForm = new FormGroup<
      IForm<{
        equipment: number;
        student: ILdapUser | undefined;
      }>
    >({
      equipment: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),

      student: new FormControl(undefined, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
    this.initEquipmentChanged$();
  }

  getDataFromFormForStudent(): Omit<INewSession, 'user'> & { user: ILdapUser } {
    const indEq: number = this.sessionForm.controls.equipment.value;
    return {
      begin: this.selectedBegin!,
      end: this.selectedEnd!,
      user: this.sessionForm.controls.student.value!,
      equipment: this.equipments[indEq].id,
    };
  }

  getDataFromFormForMySelf(): INewSession {
    const indEq: number = this.sessionForm.controls.equipment.value;
    return {
      begin: this.selectedBegin!,
      end: this.selectedEnd!,
      user: this.authService.currentUser!.id,
      equipment: this.equipments[indEq].id,
    };
  }

  isLoading = false;

  groupNameControl = new FormControl('', { nonNullable: true });

  foundedStudents$ = this.groupNameControl.valueChanges.pipe(
    filter((name) => !!name.trim()),
    debounceTime(1000),
    switchMap((groupName) => {
      this.isLoading = true;
      return this.ldapGroupStoreService.getUsersByGroup(groupName).pipe(
        catchError((err: HttpErrorResponse) => {
          return of([] as []);
        }),
        finalize(() => {
          this.isLoading = false;
          this.sessionForm.controls.student.reset();
        })
      );
    }),
    shareReplay(1)
  );

  submit() {
    if (this.radioGroupForm.value['mode'] == 'student') {
      this.onCreateSessionForUserFromLdap.emit(
        this.getDataFromFormForStudent()
      );
    } else this.onCreateSession.emit(this.getDataFromFormForMySelf());
  }

  isSubscribedOnEquipmentChanges = false;

  subscribeOnEquipmentChanges() {
    if (!this.isSubscribedOnEquipmentChanges) {
      this.equipmentChanged$
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(this.resetSelectedBeginAndEnd.bind(this));
      this.isSubscribedOnEquipmentChanges = true;
    }
  }

  ngOnInit(): void {
    if (this.editedSession) {
      this.setEditedSessionToFrom();
    } else {
      this.equipmentChanged$.subscribe(
        this.resetSelectedBeginAndEnd.bind(this)
      );
      this.getEquipments();
    }
  }

  private setEquipmentToFormById(equipmentId: number): void {
    this.equipmentService
      .getEquipments()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((equipments) => {
        this.equipments = equipments;
        const indEquip = this.equipments.findIndex(
          (equipment) => equipment.id == equipmentId
        );
        this.sessionForm.controls.equipment.setValue(indEquip);
        this.subscribeOnEquipmentChanges();
      });
  }

  initFormByMyself() {
    this.radioGroupForm.controls.mode.setValue('myself');
  }

  private setEditedSessionToFrom(): void {
    if (!this.editedSession) return;
    this.selectedBegin = this.editedSession.begin;
    this.selectedEnd = this.editedSession.end;
    this.setEquipmentToFormById(this.editedSession.equipment!.id);
    if (this.editedSession.user?.id == this.authService.currentUser?.id) {
      this.initFormByMyself();
    } else {
      this.initFormByStudent();
    }
  }

  private initFormByStudent() {
    this.radioGroupForm.controls.mode.setValue('student');
    this.sessionForm.controls.student.setValue(this.editedSession?.user);
  }

  private getEquipments(): void {
    this.equipmentService
      .getEquipments()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((equipments: IEquipment[]) => {
        this.equipments = equipments;
        this.sessionForm.controls.equipment.setValue(0);
      });
  }

  onSelectedDates(dates: { begin: Date; end: Date }) {
    this.selectedBegin = dates.begin;
    this.selectedEnd = dates.end;
    this.isDateCollapsed = !this.isDateCollapsed;
  }

  isNewSessionInvalid(): boolean {
    if (this.radioGroupForm.value['mode'] == 'student') {
      return this.sessionForm.invalid || !this.selectedBegin;
    } else {
      return !this.selectedBegin;
    }
  }
}
