import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { stateButtonEnum } from 'src/app/enums/state-button.enum';
import { IEquipment } from 'src/app/interfaces/equipment.interface';
import { ISession } from 'src/app/interfaces/session.interface';
import { IOutput } from '../share/output.interface';
import { ISwitchesManagement } from '../share/switches/switches-management.interface';
import { AlteraDe1SoCService } from './altera-de1-so-c.service';

@Component({
  selector: 'app-altera-de1-so-c',
  templateUrl: './altera-de1-so-c.component.html',
  styleUrls: ['./altera-de1-so-c.component.scss']
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
    private alteraDe1SoCService: AlteraDe1SoCService,
    private router: Router,
  ) {
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

  checkEquipmentServer(): void {
    this.alteraDe1SoCService.checkEquipmentServer().pipe(takeUntil(this.onDestroy$)).subscribe(res => { }, (err: HttpErrorResponse) => {
      alert('Простите, сервер оборудования сейчас не доступен')
      this.router.navigate(['']);
    })
  }

  ngOnInit(): void {
    this.checkEquipmentServer();
    this.alteraDe1SoCService.apiUrlAlteraDe1SoC = this.equipment?.server_url ?? '';
    this.alteraDe1SoCService.getStatusSwitches().subscribe(res => this.switchesState$.next(res.switches))
  }

  private getDefaultObserver() {
    return {
      next: this.getDefaultNext(),
      error: this.getDefaultError(),
    };
  }

  private getDefaultNext() {
    return (res: { stdout: string }) => {
      this.logToConsole(res.stdout);
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
        tap({
          next: () => this.switchesToDefault$.next()
        }
        )
      )
      .subscribe(this.getDefaultObserver());
  }

  onUploadFile(file: File): void {
    console.log(`upload ${file.name}`);
    this.alteraDe1SoCService
      .uploadSof(file)
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
          const next = this.getDefaultNext();
          next(res);
        },
        error: this.getDefaultError(),
      });
  }

  onSwitchAction(switchInd: number): void {
    this.alteraDe1SoCService
      .sendSwitchAction(switchInd)
      .pipe(
        takeUntil(this.onDestroy$),
        tap({
          next: (res: any) => this.switchesState$.next(res.switches)
        })
        )
      .subscribe(this.getDefaultObserver());
  }

  onButtonAction(buttonInd: number): void {
    this.alteraDe1SoCService
      .sendButtonAction(buttonInd)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(this.getDefaultObserver());
  }
}
