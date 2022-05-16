import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { equipmentTypeEnum } from '../enums/equipments.enum';
import { stateSessionEnum } from '../enums/state-session.enum';
import { IEquipment } from '../interfaces/equipment.interface';
import { ISession } from '../interfaces/session.interface';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';
import { EquipmentItem } from './equipment-item';
import { EquipmentDirective } from './equipment.directive';
import { SessionInProgressService } from './session-in-progress.service';
import { STK500Component } from './equipments/stk500/stk500.component';

import { AlteraDe1SoCComponent } from './equipments/altera-de1-so-c/altera-de1-so-c.component';
import { Timer } from '../timer/timer.class';
import { Stm32Component } from './equipments/stm32/stm32.component';

@Component({
  selector: 'app-session-in-progress',
  templateUrl: './session-in-progress.component.html',
  styleUrls: ['./session-in-progress.component.scss'],
})
export class SessionInProgressComponent implements OnInit, OnDestroy {
  private _session: ISession | null = null;
  timer?: Timer;

  get session(): ISession | null {
    return this._session;
  }

  private set session(session: ISession | null){
    this._session = session;
    this.sessionInProgressService.sessionId = session?.id;
  }

  stateSession: stateSessionEnum = stateSessionEnum.disconnenected;

  tryConnectToEquipment(){
    this.checkEquipmentServerBySession(this.session!.id);
  }

  checkEquipmentServerBySession(sessionId: number): void{
    this.stateSession = stateSessionEnum.tryingToConnect;
    this.sessionInProgressService.checkEquipmentServerBySession(sessionId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
      this.stateSession = stateSessionEnum.connenected;
      setTimeout(this.addEquipmentToComponent.bind(this));
    }, (err: HttpErrorResponse) => {
      this.stateSession = stateSessionEnum.disconnenected;
      alert('Простите, сервер оборудования сейчас не доступен')
    })
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private sessionService: SessionService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private sessionInProgressService: SessionInProgressService
  ) {}

  @ViewChild(EquipmentDirective, {static: false}) 
  private equipmentHost!: EquipmentDirective;

  private addEquipmentToComponent() {
    const equipment = this.session?.equipment;
    if (!equipment) throw new Error('Equipment was not downloaded');
    const equipmentItem: EquipmentItem = this.selectEquipmentComponent(equipment);
    const viewContainerRef = this.equipmentHost.viewContainerRef;
    viewContainerRef.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(equipmentItem.component);
    const componentRef = viewContainerRef.createComponent<{equipment: IEquipment}>(componentFactory);
    componentRef.instance.equipment = equipmentItem.equipment;
  }

  private selectEquipmentComponent(equipment: IEquipment): EquipmentItem{
    const type = equipment.type; 
    switch (type) {
      case equipmentTypeEnum.stk500: 
      return new EquipmentItem(STK500Component, equipment);
      case equipmentTypeEnum.alteraDe1SoC: 
      return new EquipmentItem(AlteraDe1SoCComponent, equipment);
      case equipmentTypeEnum.stm32: 
      return new EquipmentItem(Stm32Component, equipment);
      default:
        throw new Error("There is no matching type of equipmnets");
    }
  }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  initTimer() {
    try {
      this.timer = Timer.createWithEndDate(this.session!.end);
    } catch (err) {
      alert('Этот сеанс уже закончен');
      this.router.navigate(['my-sessions']);
      return;
    }
    this.timer!.time$.pipe(takeUntil(this.onDestroy$)).subscribe({
      complete: () => {
        if (this.timer?.isFinished) {
          alert('Время сеанса вышло.');
        }
        this.router.navigate(['my-sessions']);
      },
    });
    this.timer!.startTimer();
  }

  private getSession(){
    const sessionid: number = this.activateRoute.snapshot.params['id'];
    this.sessionService
      .getSessionById(sessionid)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((session) => {
        this.session = session;
        this.initTimer();
        this.tryConnectToEquipment();
      });
  }

  ngOnInit(): void {
    this.getSession();
  }

  exitSession(): void {
    this.router.navigate(['my-sessions']);
  }

  isTryingToConnect(): boolean{
    return this.stateSession === stateSessionEnum.tryingToConnect;
  }

  isDisconnected(): boolean{
    return this.stateSession === stateSessionEnum.disconnenected;
  }

  isConnected(): boolean{
    return this.stateSession === stateSessionEnum.connenected;
  }
}
