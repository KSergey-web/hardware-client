import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { INewSession } from "../interfaces/session.interface";
import { SessionService } from "../services/session.service";


@Component({
  selector: 'app-new-session',
  templateUrl: './new-session.component.html',
  styleUrls: ['./new-session.component.scss'],
})
export class NewSessionComponent implements OnInit {
  ngOnInit( ): void {
  }

  constructor(
    private sessionService: SessionService,
    private activeModal: NgbActiveModal,
  ) {}

  createSession(session: INewSession): void{
    this.sessionService.createSession(session).subscribe(
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
