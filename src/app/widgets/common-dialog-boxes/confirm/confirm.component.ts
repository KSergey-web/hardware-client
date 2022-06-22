import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmComponent implements OnInit {
  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  @Input()
  header = '';

  @Input()
  text = '';

  @Input()
  acceptButtonText = 'Ок';

  @Input()
  denyButtonText = 'Отмена';

  @Input()
  style = '';

  onAcceptClick() {
    this.activeModal.close(true);
  }

  onDenyClick() {
    this.activeModal.close(false);
  }

  setProps({
    header = '',
    text = '',
    acceptButtonText = 'Ok',
    denyButtonText = 'Отмена',
    style = '',
  }) {
    this.header = header;
    this.text = text;
    this.acceptButtonText = acceptButtonText;
    this.denyButtonText = denyButtonText;
    this.style = style;
  }
}
