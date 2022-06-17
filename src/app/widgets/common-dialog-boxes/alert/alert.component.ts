import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  constructor(
    private activeModal: NgbActiveModal,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  @Input()
  header = '';

  @Input()
  text = '';

  @Input()
  acceptButtonText = 'Ок';

  @Input()
  style = '';

  onClick() {
    this.activeModal.close();
  }

  setProps({ header = '', text = '', acceptButtonText = 'Ok', style = '' }) {
    this.header = header;
    this.text = text;
    this.acceptButtonText = acceptButtonText;
    this.style = style;
    this.changeDetector.markForCheck();
  }
}
