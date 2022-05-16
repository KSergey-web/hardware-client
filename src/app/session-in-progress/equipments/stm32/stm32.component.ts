import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IEquipment } from 'src/app/interfaces/equipment.interface';
import { ISession } from 'src/app/interfaces/session.interface';
import { EquipmentCommunicationService } from '../share/equipment-communication.service';
import { EquipmentSocketService } from '../share/equipment-socket-service';
import { IOutput } from '../share/output.interface';

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
    private equipmentCommunication: EquipmentCommunicationService,
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

  onSwitchAction(switchInd: number): void {
    this.equipmentCommunication
      .sendSwitchAction(switchInd)
      .pipe(
        takeUntil(this.onDestroy$),
        )
      .subscribe();
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
