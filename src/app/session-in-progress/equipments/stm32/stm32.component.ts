import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IEquipment } from 'src/app/interfaces/equipment.interface';
import { ISession } from 'src/app/interfaces/session.interface';
import { EquipmentSocketService } from '../communication-services/equipment-socket-service';
import { IOutput } from '../interfaces/output.interface';
import { I_STM32_SERVICE } from '../equipment-service-tokens';
import { IStm32Service } from '../interfaces/equipment-service/stm32-service.interface';

@Component({
  selector: 'app-stm32',
  templateUrl: './stm32.component.html',
  styleUrls: ['./stm32.component.scss'],
  providers: [EquipmentSocketService]
})
export class Stm32Component implements OnInit, OnDestroy {

  @Input() equipment: IEquipment | undefined;
  @Input() session: ISession | undefined;

  onLog$: Subject<string> = new Subject<string>();

  canReset$: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(I_STM32_SERVICE)private equipmentCommunication: IStm32Service,
    private router: Router,
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
    this.equipmentCommunication
      .reset()
      .pipe(
        takeUntil(this.onDestroy$),
        )
      .subscribe(this.getDefaultObserver());
  }

  onUploadFile(file: File): void {
    console.log(`upload ${file.name}`);
    this.equipmentCommunication
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
    this.equipmentCommunication
      .clean()
      .pipe(
        takeUntil(this.onDestroy$),
        )
      .subscribe({
        next: () => {
          this.canReset$.next(false);
        },
        error: this.getDefaultError(),
      });
  }

  onButtonAction(buttonInd: number): void {
    this.equipmentCommunication
      .sendButtonAction(buttonInd)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(this.getDefaultObserver());
  }


  subOnOutput() {
    this.equipmentSocketService.output$
    .pipe(takeUntil(this.onDestroy$))
      .subscribe(({stdout}) => {
      if (stdout) {
        this.logToConsole(stdout);
      }
    })
  }


}
