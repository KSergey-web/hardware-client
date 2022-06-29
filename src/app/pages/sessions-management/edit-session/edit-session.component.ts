import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISession } from 'src/app/interfaces/session.interface';
import { SessionService } from 'src/app/services/session.service';
import { INewSession } from '../../subgroup/create-session-by-booking/new-session.interface';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.scss'],
})
export class EditSessionComponent implements OnInit, OnDestroy {
  @Input() editedSession!: ISession;
  editedSessionCopy: ISession | null = null;
  constructor(
    private activeModal: NgbActiveModal,
    private sessionService: SessionService
  ) {}
  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  ngOnInit(): void {
    this.editedSessionCopy = _.cloneDeep(this.editedSession);
  }

  saveSession(session: INewSession): void {
    this.sessionService
      .updateSession(session, this.editedSession.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
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
