import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IEquipment } from 'src/app/interfaces/equipment.interface';
import { IGroup } from 'src/app/interfaces/group.interface';
import { ISession } from 'src/app/interfaces/session.interface';
import { IStudent } from 'src/app/interfaces/student.interface';
import { AuthService } from 'src/app/services/auth.service';
import { EquipmentService } from 'src/app/services/equipment.service';
import { GroupService } from 'src/app/services/group.service';
import { SessionService } from 'src/app/services/session.service';
import { StudentService } from 'src/app/services/student.service';
import { INewSession } from '../../subgroup/create-session-by-booking/new-session.interface';

@Component({
  selector: 'app-session-form',
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.scss'],
})
export class SessionFormComponent implements OnInit, OnDestroy {
  sessionForm!: FormGroup;
  radioGroupForm!: FormGroup;
  equipments: IEquipment[] = [];
  groups: IGroup[] = [];
  students: IStudent[] = [];

  selectedEquipment?: IEquipment;
  selectedBegin?: Date | null = null;
  selectedEnd?: Date | null = null;

  isDateCollapsed: boolean = true;

  equipmentChanged$!: Observable<IEquipment>;

  @Output() onCreateSession = new EventEmitter<INewSession>();

  @Input() editedSession: ISession | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private authService: AuthService,
    private studentService: StudentService,
    private groupService: GroupService,
    private equipmentService: EquipmentService
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

  private createSubOnChangeGroup(): void {
    this.sessionForm.controls.group.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((id: number) => {
        if (id == -1) return;
        this.groupService
          .getStudentsFromGroup(this.groups[id])
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((students) => (this.students = students));
      });
  }

  private resetSelectedBeginAndEnd(): void {
    this.selectedBegin = null;
    this.selectedEnd = null;
  }

  private initForm(): void {
    this.sessionForm = this.formBuilder.group({
      equipment: [0],
      group: [-1, [Validators.min(0)]],
      student: [-1, [Validators.min(0)]],
    });
    this.radioGroupForm = this.formBuilder.group({
      mode: ['myself'],
    });
    this.createSubOnChangeGroup();
    this.initEquipmentChanged$();
  }

  getSelectedUserId(): number {
    let userId: number;
    if (this.radioGroupForm.value['mode'] == 'student') {
      const ind: number = this.sessionForm.controls.student.value;
      userId = this.students[ind].id;
    } else {
      userId = this.authService.currentUser!.id;
    }
    return userId;
  }

  getDataFromForm(): INewSession {
    const indEq: number = this.sessionForm.controls.equipment.value;
    return {
      begin: this.selectedBegin!,
      end: this.selectedEnd!,
      user: this.getSelectedUserId(),
      equipment: this.equipments[indEq].id,
    };
  }

  submit() {
    this.onCreateSession.emit(this.getDataFromForm());
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
      this.getGroups();
      this.getEquipments();
    }
  }

  private setGroupToFormById(groupId: number): void {
    this.groupService
      .getGroups()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((groups) => {
        this.groups = groups;
        const indGroup = this.groups.findIndex((group) => group.id == groupId);
        this.sessionForm.controls.group.setValue(indGroup);
      });
  }

  private setStudentFromGroupToFormById(
    studentId: number,
    group: IGroup
  ): void {
    this.groupService
      .getStudentsFromGroup(group!)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((students) => {
        this.students = students;
        const indStudent = this.students.findIndex(
          (student) => student.id == studentId
        );
        this.sessionForm.controls.student.setValue(indStudent);
      });
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
        console.warn('7');
        console.warn(this.isSubscribedOnEquipmentChanges);
        this.subscribeOnEquipmentChanges();
      });
  }

  initFormByMyself() {
    this.radioGroupForm.controls.mode.setValue('myself');
    this.getGroups();
    return;
  }

  initFormByStudent() {
    this.radioGroupForm.controls.mode.setValue('student');
    this.studentService
      .getInfoAboutStudentByUserId(this.editedSession!.user!.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((student) => {
        if (!student) {
          console.error('Student not found');
          return;
        }
        this.setGroupToFormById(student.group!.id);
        this.setStudentFromGroupToFormById(student.id, student.group!);
      });
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

  private getEquipments(): void {
    this.equipmentService
      .getEquipments()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((equipments: IEquipment[]) => {
        this.equipments = equipments;
        this.sessionForm.controls.equipment.setValue(0);
      });
  }

  private getGroups(): void {
    this.groupService
      .getGroups()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((groups: IGroup[]) => {
        this.groups = groups;
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
