import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { IEquipment } from '../interfaces/equipment.interface';
import { IGroup } from '../interfaces/group.interface';
import { INewSession, ISession } from '../interfaces/session.interface';
import { IStudent } from '../interfaces/student.interface';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-session-form',
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.scss']
})
export class SessionFormComponent implements OnInit {

  sessionForm!: FormGroup;
  radioGroupForm!: FormGroup;
  equipments: IEquipment[] = [];
  groups: IGroup[] = [];
  students: IStudent[] = [];

  selectedEquipment?: IEquipment;
  selectedBegin?: Date;
  selectedEnd?: Date;

  isDateCollapsed: boolean = true;

  equipmentChanged$!: Observable<IEquipment>;

  @Output() onCreateSession = new EventEmitter<INewSession>();

  @Input() editedSession: ISession | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private authService: AuthService
  ) {
    this.initForm();
  }

  private initEquipmentChanged$() {
    this.equipmentChanged$ =
      this.sessionForm.controls.equipment.valueChanges.pipe(
        map((i: number) => this.equipments[i])
      );
  }

  private createSubOnChangeGroup(): void {
    this.sessionForm.controls.group.valueChanges.subscribe((id: number) => {
      if (id == -1) return;
      this.sessionService
        .getStudentsFromGroup(this.groups[id])
        .subscribe((students) => (this.students = students));
    });
  }

  private initForm(): void {
    this.sessionForm = this.formBuilder.group({
      equipment: [0],
      group: [-1, [Validators.min(0)]],
      student: [-1, [Validators.min(0)]],
    });
    this.radioGroupForm = this.formBuilder.group({
      mode: [],
    });
    this.createSubOnChangeGroup();
    this.initEquipmentChanged$()
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

  ngOnInit(): void {
    if (this.editedSession)
      this.setEditedSessionToFrom();
    else{
      this.getGroups();
    this.getEquipments();
    }
  }

  private setGroupToFormById(groupId: number): void {
    this.sessionService
      .getGroups()
      .subscribe(groups => {
        this.groups = groups;
        const indGroup = this.groups.findIndex(group => group.id == groupId);
        this.sessionForm.controls.group.setValue(indGroup);
      })
  }

  private setStudentFromGroupToFormById(studentId: number, group: IGroup): void {
    this.sessionService
      .getStudentsFromGroup(group!)
      .subscribe((students) => {
        this.students = students;
        const indStudent = this.students.findIndex(student => student.id == studentId);
        this.sessionForm.controls.student.setValue(indStudent);
      }
      );
  }

  private setEquipmentToFormById(equipmentId: number): void {
    this.sessionService
      .getEquipments()
      .subscribe((equipments) => {
        this.equipments = equipments;
        const indEquip = this.equipments.findIndex(equipment => equipment.id == equipmentId);
        this.sessionForm.controls.equipment.setValue(indEquip);
      }
      );
  }

  private setEditedSessionToFrom(): void {
    if (!this.editedSession) return;
    this.selectedBegin = this.editedSession.begin;
    this.selectedEnd = this.editedSession.end;
    this.setEquipmentToFormById(this.editedSession.equipment!.id);
    if (this.editedSession.user?.id == this.authService.currentUser?.id) {
      this.radioGroupForm.controls.mode.setValue('myself');
      return;
    }
    else{
      this.radioGroupForm.controls.mode.setValue('student');
    }
    this.sessionService.getInfoAboutStudentByUserId(this.editedSession.user!.id).subscribe(student => {
      if (!student) {
        console.error('Student not found');
        return
      }
      this.setGroupToFormById(student.group!.id);
      this.setStudentFromGroupToFormById(student.id, student.group!);
    })
  }

  private getEquipments(): void {
    this.sessionService
      .getEquipments()
      .subscribe((equipments: IEquipment[]) => {
        this.equipments = equipments;
        this.sessionForm.controls.equipment.setValue(0);
      });
  }

  private getGroups(): void {
    this.sessionService.getGroups().subscribe((groups: IGroup[]) => {
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
