import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IEquipment } from 'src/app/interfaces/equipment.interface';
import { ISession } from 'src/app/interfaces/session.interface';
import { EquipmentSocketService } from '../communication-services/equipment-socket-service';
import { IResistorManagement } from '../controls/resistor/resistor-management.interface';
import { I_STK500_SERVICE } from '../equipment-service-tokens';
import { IStk500Service } from '../interfaces/equipment-service/stk500-service.interface';
import { IOutput } from '../interfaces/output.interface';

@Component({
  selector: 'app-stk500',
  templateUrl: './stk500.component.html',
  styleUrls: ['./stk500.component.scss'],
  providers: [EquipmentSocketService]
})
export class STK500Component implements OnInit, OnDestroy {

  @Input() equipment!: IEquipment;
  @Input() session!: ISession;

  onLog$: Subject<string> = new Subject<string>();

  canReset$: Subject<boolean> = new Subject<boolean>();

  resistorManagment: IResistorManagement = {
    minValue: 32,
    maxValue: 4095,
    resistorState$: new Subject<number>()
  }

  private get resistorState$(): Subject<number>{
    return this.resistorManagment.resistorState$;
  }

  constructor(
    @Inject(I_STK500_SERVICE)private stk500Service: IStk500Service,
    private equipmentSocketService: EquipmentSocketService
  ) {
    this.subOnOutput();
  }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }


  ngOnInit(): void {
    //this.checkEquipmentServer();
    this.stk500Service.getStatusResistor().subscribe(res => this.newStateResistor(res.resistor))
  }

  private getDefaultObserver() {
    return {
      error: this.getDefaultError(),
    };
  }


  private logToConsole(log: string) {
    this.onLog$.next(log);
  }

  private getDefaultError() {
    return (err: Error) => {
      alert(err.message);
      console.error(err);
      this.logToConsole(JSON.stringify(err));
    };
  }

  onReset(): void {
    this.stk500Service
      .reset()
      .pipe(
        takeUntil(this.onDestroy$),
        )
      .subscribe(this.getDefaultObserver());
  }

  onUploadFile(file: File): void {
    console.log(`upload ${file.name}`);
    this.stk500Service
      .uploadFile(file)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (res: IOutput) => {
          this.logToConsole(res.stdout);
          this.canReset$.next(true);
        },
        error: this.getDefaultError(),
      });
  }

  onClean(): void {
    this.stk500Service
      .clean()
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe({
        next: (res) => {
          this.canReset$.next(false);
        },
        error: this.getDefaultError(),
      });
  }

  onResistorAction(resistor: number): void {
    this.stk500Service
      .sendResistorAction(resistor)
      .pipe(
        takeUntil(this.onDestroy$),
        )
      .subscribe();
  }

  onButtonAction(buttonInd: number): void {
    this.stk500Service
      .sendButtonAction(buttonInd)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(this.getDefaultObserver());
  }

  newStateResistor(resistor: number): void{
    this.resistorState$.next(resistor);
  }

  subOnOutput() {
    this.equipmentSocketService.output$
    .pipe(takeUntil(this.onDestroy$))
      .subscribe(({stdout, resistor}) => {
      if (stdout) {
        this.logToConsole(stdout);
      }
      if (resistor){
        this.newStateResistor(resistor);
      }
      console.warn(resistor)
    })
  }
}
