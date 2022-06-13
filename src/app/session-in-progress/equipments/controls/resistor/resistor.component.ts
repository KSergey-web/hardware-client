import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IResistorManagement } from './resistor-management.interface';

@Component({
  selector: 'app-resistor',
  templateUrl: './resistor.component.html',
  styleUrls: ['./resistor.component.scss'],
})
export class ResistorComponent implements OnInit, OnDestroy {
  constructor() {}

  ngOnInit(): void {
    this.preValueResistor = this.resistorManagment.minValue;
    this.subOnResistorState$();
    this.subscrubeOnRangeChanges();
  }

  preValueResistor: number = 0;

  @Output() onResistorAction = new EventEmitter<number>();
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

  private subOnResistorState$() {
    this.resistorManagment.resistorState$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((resistor: number) => {
        this.resistorControl.setValue(resistor, { emitEvent: false });
      });
  }

  sendResistorAction(resistor: number): void {
    this.onResistorAction.emit(resistor);
  }
}
