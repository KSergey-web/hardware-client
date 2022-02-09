import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { INewSession, ISession } from '../interfaces/session.interface';
import * as _ from "lodash";
import { SessionService } from '../services/session.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.scss']
})
export class EditSessionComponent implements OnInit, OnDestroy {
  @Input() editedSession!: ISession;
  editedSessionCopy: ISession | null = null;
  constructor(
    private activeModal: NgbActiveModal,
    private sessionService: SessionService
  ) { 
    
  }
  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  ngOnInit(): void {
    this.editedSessionCopy = _.cloneDeep(this.editedSession); 
  }

  saveSession(session: INewSession): void{
    session.id = this.editedSession.id;
  
  this.sessionService.updateSession(session).pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {
        this.activeModal.close();
      },
      (err) => {
        alert('Не удалось сохранить сессию');
        console.error(err);
      }
    );
  }
}
