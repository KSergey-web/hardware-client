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
import { STK500Component } from './stk500/stk500.component';
import { Timer } from './timer.class';
import { ITimer } from './timer.interface';

@Component({
  selector: 'app-session-in-progress',
  templateUrl: './session-in-progress.component.html',
  styleUrls: ['./session-in-progress.component.scss'],
  providers: [SessionInProgressService]
})
export class SessionInProgressComponent implements OnInit, OnDestroy {
  session?: ISession;
  timer?: Timer;

  stateSession: stateSessionEnum = stateSessionEnum.disconnenected;

  tryConnectToEquipment(){
    this.checkEquipmentServer(this.session!.equipment!.server_url!);
  }

  checkEquipmentServer(url: string): void{
    this.stateSession = stateSessionEnum.tryingToConnect;
    this.sessionInProgressService.checkEquipmentServer(url).subscribe(res => {
      this.stateSession = stateSessionEnum.connenected;
      setTimeout(this.addEquipmentToComponent.bind(this));
    }, (err: HttpErrorResponse) => {
      this.stateSession = stateSessionEnum.disconnenected;
      alert('Простите, сервер оборудования сейчас не доступен')
    })
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private authService: AuthService,
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
      break;
      default:
        throw new Error("There is no matching type of equipmnets");
        break;
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
        this.checkEquipmentServer(this.session.equipment!.server_url!)
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
