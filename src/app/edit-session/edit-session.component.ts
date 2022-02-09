import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { INewSession, ISession } from '../interfaces/session.interface';
import * as _ from "lodash";
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.scss']
})
export class EditSessionComponent implements OnInit {

  @Input() editedSession!: ISession;
  editedSessionCopy: ISession | null = null;
  constructor(
    private activeModal: NgbActiveModal,
    private sessionService: SessionService
  ) { 
    
  }

  ngOnInit(): void {
    this.editedSessionCopy = _.cloneDeep(this.editedSession); 
  }

  saveSession(session: INewSession): void{
    session.id = this.editedSession.id;
    this.sessionService.updateSession(session).subscribe(
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
