import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IEquipment } from '../interfaces/equipment.interface';
import { ISession } from '../interfaces/session.interface';
import { EquipmentService } from '../services/equipment.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-find-sessions',
  templateUrl: './find-sessions.component.html',
  styleUrls: ['./find-sessions.component.scss']
})
export class FindSessionsComponent implements OnInit, OnDestroy {
  sessions: ISession[] = [];
  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  constructor(
    private sessionService: SessionService,
    private modalService: NgbModal,
    private equipmentService: EquipmentService,
  ){
  }

  getSessions(): void{
    this.sessionService.getNearestSessions()
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(sessions => this.sessions = sessions);
  }

  ngOnInit(): void {
    this.getSessions();
  }
}