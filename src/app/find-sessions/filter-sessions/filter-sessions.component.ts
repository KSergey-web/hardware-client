import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { IEquipment } from 'src/app/interfaces/equipment.interface';
import { ISession } from 'src/app/interfaces/session.interface';

@Component({
  selector: 'app-filter-sessions',
  templateUrl: './filter-sessions.component.html',
  styleUrls: ['./filter-sessions.component.scss']
})
export class FilterSessionsComponent implements OnInit, OnDestroy {
  findSessionForm!: FormGroup;
  sessions: ISession[] = [];
  equipments: IEquipment[] = [];
  constructor(    private formBuilder: FormBuilder,
    ) {
      this.findSessionForm = this.formBuilder.group({
        equipment: [-1, [Validators.min(0)]],
      }); }
  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
  }

  findSessions(): void{
    const equipment: IEquipment = this.getSelectedEquipment();
    this.sessionService.getNearestSessionsByEquipment(equipment)
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(sessions => this.sessions = sessions);
  }

  private getEquipments(): void{
    this.equipmentService.getEquipments()
    .pipe(takeUntil(this.onDestroy$))
    .subscribe((equipments) => this.equipments = equipments)
  }

  getSelectedEquipment(): IEquipment {
    const ind = this.findSessionForm.controls.equipment.value;
    return this.equipments[ind];
  }



}
