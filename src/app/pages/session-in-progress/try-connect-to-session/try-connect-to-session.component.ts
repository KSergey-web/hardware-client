import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { SessionInProgressService } from '../session-in-progress.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { stateSessionEnum } from './state-session.enum';

@Component({
  selector: 'app-try-connect-to-session',
  templateUrl: './try-connect-to-session.component.html',
  styleUrls: ['./try-connect-to-session.component.scss'],
})
export class TryConnectToSessionComponent implements OnInit, OnDestroy {
  stateSession: stateSessionEnum = stateSessionEnum.disconnenected;

  @Input()
  sessionId!: number;

  @Output()
  onConnected = new EventEmitter<boolean>();

  constructor(private sessionInProgressService: SessionInProgressService) {}

  ngOnInit(): void {
    this.tryConnectToEquipment();
  }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  tryConnectToEquipment() {
    this.stateSession = stateSessionEnum.tryingToConnect;
    this.sessionInProgressService
      .checkEquipmentServerBySession(this.sessionId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (res) => {
          this.stateSession = stateSessionEnum.connenected;
          this.onConnected.emit(true);
        },
        (err: HttpErrorResponse) => {
          this.stateSession = stateSessionEnum.disconnenected;
          alert('К сожалению, сервер оборудования сейчас не доступен.');
        }
      );
  }

  isTryingToConnect(): boolean {
    return this.stateSession === stateSessionEnum.tryingToConnect;
  }

  isDisconnected(): boolean {
    return this.stateSession === stateSessionEnum.disconnenected;
  }

  isConnected(): boolean {
    return this.stateSession === stateSessionEnum.connenected;
  }
}
