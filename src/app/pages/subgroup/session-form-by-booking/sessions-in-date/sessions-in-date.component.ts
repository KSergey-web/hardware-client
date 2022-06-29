import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { IEquipment } from 'src/app/interfaces/equipment.interface';
import { ISession } from 'src/app/interfaces/session.interface';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-sessions-in-date',
  templateUrl: './sessions-in-date.component.html',
  styleUrls: ['./sessions-in-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsInDateComponent implements OnInit, OnChanges {
  @Input() selectedDate?: Date;
  @Input() equipment?: IEquipment;

  sessions: ISession[] = [];
  constructor(
    private cb: ChangeDetectorRef,
    private sessionService: SessionService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const selectedDate = changes['selectedDate'].currentValue;
    if (!selectedDate) return;
    this.getSessionsInDateByEquipment(selectedDate);
  }

  ngOnInit(): void {}

  private getSessionsInDateByEquipment(date: Date) {
    this.sessionService
      .getSessionsInDateByEquipment(this.equipment!, date)
      .pipe(take(1))
      .subscribe(this.gottedSessions.bind(this));
  }

  private gottedSessions(sessions: ISession[]) {
    this.sessions = sessions;
    this.cb.detectChanges();
  }
}
