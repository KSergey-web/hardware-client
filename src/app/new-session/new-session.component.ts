import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IEquipment } from '../interfaces/equipment.interface';
import { IGroup } from '../interfaces/group.interface';
import { ISession } from '../interfaces/session.interface';
import { IStudent } from '../interfaces/student.interface';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-new-session',
  templateUrl: './new-session.component.html',
  styleUrls: ['./new-session.component.scss'],
})
export class NewSessionComponent implements OnInit {
  sessionForm!: FormGroup;
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
    private sessionService: SessionService
  ) {
    this.sessionForm = formBuilder.group({
      equipment: [],
      group: [-1, [Validators.min(0)]],
      student: [-1, [Validators.min(0)]]
    });
    this.sessionForm.controls.group.valueChanges.subscribe((id: number)=> {
      if (id == -1) return;
      this.sessionService.getStudentsFromGroup(this.groups[id]).subscribe(students => this.students = students)
    })
    this.equipmentChanged$ = this.sessionForm.controls.equipment.valueChanges.pipe( map((i: number) => this.equipments[i]));
  }

  submit() {
    const indEq: number = this.sessionForm.controls.equipment.value;
    const indSt: number = this.sessionForm.controls.student.value;
    const newSession = {
      begin: this.selectedBegin!,
      end: this.selectedEnd!, 
      user: this.students[indSt].id,
      equipment: this.equipments[indEq].id
    }
    this.sessionService.createSession(newSession).subscribe(res => {}, err => console.error(err));
  }

  ngOnInit(): void {
    this.sessionService
      .getEquipments()
      .subscribe((equipments: IEquipment[]) => {
        this.equipments = equipments;
        this.sessionForm.controls.equipment.setValue(0);
      });
    this.sessionService.getGroups().subscribe((groups: IGroup[]) => {
      this.groups = groups;
    });
  }

  onSelectedDates(dates:{begin: Date; end: Date}){
      this.selectedBegin = dates.begin;
      this.selectedEnd = dates.end;
      this.isDateCollapsed = !this.isDateCollapsed;
    }
}
