import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from './alert/alert.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { StyleType } from './style-dialog.directive';

type SizeType = 'sm' | 'lg' | 'xl';

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
    this.componenProperties.style = 'danger';
    return this;
  }

  setInfoStyle() {
    this.componenProperties.style = 'info';
    return this;
  }

  setWarningStyle() {
    this.componenProperties.style = 'warning';
    return this;
  }

  setSuccesStyle() {
    this.componenProperties.style = 'success';
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

  openConfirmModal(): NgbModalRef {
    const modalRef = this.modalService.open(
      ConfirmComponent,
      this.ngbModalOption
    );
    (modalRef.componentInstance as AlertComponent).setProps(
      this.componenProperties
    );
    return modalRef;
  }
}
