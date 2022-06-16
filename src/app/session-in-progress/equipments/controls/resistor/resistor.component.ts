import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EquipmentSocketService } from '../../communication-services/equipment-socket-service';
import { EquipmentHandlerService } from '../equipment-handler.service';
import { I_RESISTOR_INTERACTION_SERVICE } from '../../equipment-service-tokens';
import { IResistorInteraction } from '../../interfaces/interactions-with-controls/resistor-interaction.interface';
import { IResistorManagement } from './resistor-management.interface';

@Component({
  selector: 'app-resistor',
  templateUrl: './resistor.component.html',
  styleUrls: ['./resistor.component.scss'],
})
export class ResistorComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(I_RESISTOR_INTERACTION_SERVICE)
    private resistorService: IResistorInteraction,
    private equipmentHandlerService: EquipmentHandlerService,
    private equipmentSocketService: EquipmentSocketService
  ) {}

  ngOnInit(): void {
    this.preValueResistor = this.resistorManagment.minValue;
    this.subscrubeOnRangeChanges();
    this.subOnOutput();
    this.resistorService
      .getStatusResistor()
      .subscribe((res) => this.setValueResistor(res.resistor));
  }

  preValueResistor: number = 0;

  @Input() resistorManagment!: IResistorManagement;

  resistorControl = new FormControl();

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  private subscrubeOnRangeChanges(): void {
    this.resistorControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value: number) => {
        if (this.preValueResistor == value) return;
        this.preValueResistor = value;
        this.sendResistorAction(value);
      });
  }

  setValueResistor(resistor: number) {
    this.resistorControl.setValue(resistor, { emitEvent: false });
  }

  sendResistorAction(resistor: number): void {
    this.resistorService
      .sendResistorAction(resistor)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(this.equipmentHandlerService.getDefaultObserver());
  }

  subOnOutput() {
    this.equipmentSocketService.output$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(({ resistor }) => {
        if (resistor) {
          this.setValueResistor(resistor);
        }
      });
  }
}
