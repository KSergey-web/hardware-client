import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { stateButtonEnum } from 'src/app/enums/state-button.enum';
import { IEquipment } from 'src/app/interfaces/equipment.interface';
import { ISession } from 'src/app/interfaces/session.interface';
import { I_ALTERA_DE1_So_C_SERVICE } from '../equipment-service-tokens';
import { IAlteraDe1SoCService } from '../interfaces/equipment-service/altera-de1-so-c-service.interface';
import { EquipmentSocketService } from '../communication-services/equipment-socket-service';
import { IOutput } from '../interfaces/output.interface';
import { ISwitchesManagement } from '../controls/switches/switches-management.interface';

@Component({
  selector: 'app-altera-de1-so-c',
  templateUrl: './altera-de1-so-c.component.html',
  styleUrls: ['./altera-de1-so-c.component.scss'],
  providers: [EquipmentSocketService]
})
export class AlteraDe1SoCComponent implements OnInit, OnDestroy {

  @Input() equipment: IEquipment | undefined;
  @Input() session: ISession | undefined;

  onLog$: Subject<string> = new Subject<string>();

  canReset$: Subject<boolean> = new Subject<boolean>();
  switchesManagment: ISwitchesManagement = {
    numberOfSwitches: 8,
    switchesState$: new Subject<string>(),
    switchesToDefault$: new Subject<any>(),
  }
  constructor(
    @Inject(I_ALTERA_DE1_So_C_SERVICE)private alteraDe1SoCService: IAlteraDe1SoCService,
    private equipmentSocketService: EquipmentSocketService
  ) {
    this.subOnOutput();
  }

  private get switchesState$(): Subject<string>{
    return this.switchesManagment.switchesState$;
  }

  private get switchesToDefault$(): Subject<void>{
    return this.switchesManagment.switchesToDefault$;
  }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    //this.checkEquipmentServer();
    this.alteraDe1SoCService.getStatusSwitches().subscribe(res => this.newStateSwitches(res.switches))
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
    this.alteraDe1SoCService
      .reset()
      .pipe(
        takeUntil(this.onDestroy$),
        tap( () => this.switchesToDefault$.next()
        )
      )
      .subscribe(this.getDefaultObserver());
  }

  onUploadFile(file: File): void {
    console.log(`upload ${file.name}`);
    this.alteraDe1SoCService
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
    this.alteraDe1SoCService
      .clean()
      .pipe(
        takeUntil(this.onDestroy$), 
        tap({
          next: () => this.switchesToDefault$.next()
        }))
      .subscribe({
        next: (res) => {
          this.canReset$.next(false);
        },
        error: this.getDefaultError(),
      });
  }

  onSwitchAction(switchInd: number): void {
    this.alteraDe1SoCService
      .sendSwitchAction(switchInd)
      .pipe(
        takeUntil(this.onDestroy$),
        )
      .subscribe();
  }

  onButtonAction(buttonInd: number): void {
    this.alteraDe1SoCService
      .sendButtonAction(buttonInd)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(this.getDefaultObserver());
  }

  newStateSwitches(switches: string): void{
    this.switchesState$.next(switches);
  }

  subOnOutput() {
    this.equipmentSocketService.output$
    .pipe(takeUntil(this.onDestroy$))
      .subscribe(({stdout, switches}) => {
      if (stdout) {
        this.logToConsole(stdout);
      }
      if (switches){
        this.newStateSwitches(switches);
      }
    })
  }


}
