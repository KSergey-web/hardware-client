import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from './alert/alert.component';

type SizeType = 'sm' | 'lg' | 'xl';
type StyleType =
  | 'alert-success'
  | 'alert-info'
  | 'alert-danger'
  | 'alert-warning';

export class CommonModalDialogBoxBuilder {
  constructor(private modalService: NgbModal) {}

  private componenProperties: {
    text?: string;
    header?: string;
    acceptButtonText?: string;
    style?: StyleType;
  } = {};
  private ngbModalOption: { size?: SizeType } = {};

  addText(text: string) {
    this.componenProperties.text = text;
    return this;
  }

  addHeader(header: string) {
    this.componenProperties.header = header;
    return this;
  }

  addAcceptButtonText(acceptButtonText: string) {
    this.componenProperties.acceptButtonText = acceptButtonText;
    return this;
  }

  setLargeSize() {
    this.ngbModalOption.size = 'lg';
    return this;
  }

  setSmallSize() {
    this.ngbModalOption.size = 'sm';
    return this;
  }

  setExtraLargeSize() {
    this.ngbModalOption.size = 'xl';
    return this;
  }

  setDangerStyle() {
    this.componenProperties.style = 'alert-danger';
    return this;
  }

  setInfoStyle() {
    this.componenProperties.style = 'alert-info';
    return this;
  }

  setWarningStyle() {
    this.componenProperties.style = 'alert-warning';
    return this;
  }

  setSuccesStyle() {
    this.componenProperties.style = 'alert-success';
    return this;
  }

  openAlertModal(): NgbModalRef {
    const modalRef = this.modalService.open(
      AlertComponent,
      this.ngbModalOption
    );
    (modalRef.componentInstance as AlertComponent).setProps(
      this.componenProperties
    );
    return modalRef;
  }
}
