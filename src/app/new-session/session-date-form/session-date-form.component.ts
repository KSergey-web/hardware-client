import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { IEquipment } from 'src/app/interfaces/equipment.interface';
import { ISession } from 'src/app/interfaces/session.interface';
import { SessionService } from 'src/app/session.service';

@Component({
  selector: 'app-session-date-form',
  templateUrl: './session-date-form.component.html',
  styleUrls: ['./session-date-form.component.scss']
})
export class SessionDateFormComponent implements OnInit {
  sessionDateForm!: FormGroup;
  selectedDate?: Date;
  sessions: ISession[] = [];
  selectedEquipment?: IEquipment;
  isBusy: boolean = false;

  @Input() equipmentChanged$!: Observable<IEquipment>;
  @Output() onSelectedDates = new EventEmitter<{begin: Date; end: Date}>();

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService
  ) {
    this.sessionDateForm = formBuilder.group({
      duration: [5, [Validators.required, Validators.min(5), Validators.max(1440)]],
      time:[{minute:0, hour:0}]
    });
  }

  onSelectDate($date: NgbDateStruct){
    this.getSessionsInDateByEquipment($date);
  }

  private getSessionsInDateByEquipment(newDate?: NgbDateStruct) {
    if (newDate) {
    this.selectedDate = new Date(newDate.year, newDate.month-1, newDate.day);
    }
    else if (!this.selectedDate){
      return;
    }
    this.sessionService.getSessionsInDateByEquipment(this.selectedEquipment!, this.selectedDate).subscribe((sessions: ISession[]) => {
      this.sessions = sessions;
    });
  }

  getToday(): NgbDateStruct {
    const today = new Date(); 
    return { year: today.getFullYear(), month: today.getMonth()+1, day: today.getDate()}
  }

  getMaxDay(): NgbDateStruct{
    const today = new Date(); 
    return { year: today.getFullYear(), month: today.getMonth()+1, day: today.getDate()+7}
  }

  getBeginAndDatesFromForm(): {begin: Date, end: Date} |  null{
    if (!this.selectedDate){
      return null;
    }
    const {hour: h, minute: m} = this.sessionDateForm.controls.time.value;
    const duration: number = this.sessionDateForm.value.duration;
    const begin = new Date(this.selectedDate);
    begin.setHours(h);
    begin.setMinutes(m);
    const end = new Date(+begin + duration*1000*60);
    return {begin, end};
  }

  submit(): void{
    const res = this.getBeginAndDatesFromForm();
    if (!res) return;
    const {begin, end } = res;
    const ind = this.sessions.find(((session: ISession) => {
      if ((session.begin <= begin && session.end >= begin) || (session.begin <= end && session.end >= end)){
        return true;
      }
      return false;
    }))
    if (!ind)
      this.onSelectedDates.emit({begin,end})
    else
     this.isBusy = true;
  }

  ngOnInit(): void {
    this.equipmentChanged$.subscribe(eq => {
      this.selectedEquipment = eq;
      this.getSessionsInDateByEquipment();
    });
    this.sessionDateForm.valueChanges.subscribe(()=>this.isBusy=false); 
  }
}
