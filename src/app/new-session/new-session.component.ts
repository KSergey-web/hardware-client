import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbActiveModal,
  NgbDate,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { IEquipment } from '../interfaces/equipment.interface';
import { IGroup } from '../interfaces/group.interface';
import { INewSession, ISession } from '../interfaces/session.interface';
import { IStudent } from '../interfaces/student.interface';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-new-session',
  templateUrl: './new-session.component.html',
  styleUrls: ['./new-session.component.scss'],
})
export class NewSessionComponent implements OnInit {
  sessionForm!: FormGroup;
  radioGroupForm!: FormGroup;
  equipments: IEquipment[] = [];
  groups: IGroup[] = [];
  students: IStudent[] = [];

  selectedEquipment?: IEquipment;
  selectedBegin?: Date;
  selectedEnd?: Date;

  isDateCollapsed: boolean = true;

  equipmentChanged$: Observable<IEquipment>;

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private activeModal: NgbActiveModal,
    private authService: AuthService
  ) {
    this.sessionForm = formBuilder.group({
      equipment: [0],
      group: [-1, [Validators.min(0)]],
      student: [-1, [Validators.min(0)]],
    });
    this.sessionForm.controls.group.valueChanges.subscribe((id: number) => {
      if (id == -1) return;
      this.sessionService
        .getStudentsFromGroup(this.groups[id])
        .subscribe((students) => (this.students = students));
    });
    this.equipmentChanged$ =
      this.sessionForm.controls.equipment.valueChanges.pipe(
        map((i: number) => this.equipments[i])
      );
  }

  getSelectedUserId(): number{
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
    this.sessionService.createSession(this.getDataFromForm()).subscribe(
      (res) => {
        this.activeModal.close();
      },
      (err) => {
        alert('Не удалось создать сессию');
        console.error(err);
      }
    );
  }

  ngOnInit(): void {
    this.radioGroupForm = this.formBuilder.group({
      mode: [],
    });
    this.getGroups();
    this.getEquipments();
  }

  getEquipments(): void {
    this.sessionService
      .getEquipments()
      .subscribe((equipments: IEquipment[]) => {
        this.equipments = equipments;
        this.sessionForm.controls.equipment.setValue(0);
      });
  }

  getGroups(): void {
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
