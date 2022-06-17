import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { INewSession } from '../../../interfaces/session.interface';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-new-session',
  templateUrl: './new-session.component.html',
  styleUrls: ['./new-session.component.scss'],
})
export class NewSessionComponent implements OnInit, OnDestroy {
  ngOnInit(): void {}

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  constructor(
    private sessionService: SessionService,
    private activeModal: NgbActiveModal
  ) {}

  createSession(session: INewSession): void {
    this.sessionService
      .createSession(session)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (res) => {
          this.activeModal.close();
        },
        (err) => {
          alert('Не удалось создать сессию');
          console.error(err);
        }
      );
  }
}
