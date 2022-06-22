import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';

export type StyleType = '' | 'success' | 'info' | 'danger' | 'warning';

@Directive({
  selector: '[styleDialog]',
})
export class StyleDialogDirective implements AfterViewInit {
  @Input('styleDialog') style = 'string';

  constructor(private ref: ElementRef, private render: Renderer2) {}
  ngAfterViewInit(): void {
    this.setDialogStyle(this.style);
  }

  setDialogStyle(style: string) {
    switch (style) {
      case 'danger':
        this.setDangerStyle();
        break;
      case 'info':
        this.setInfoStyle();
        break;
    }
  }

  setDangerStyle() {
    this.setAlertStyle('danger');
    this.setAcceptButtonStyle('danger');
  }

  setInfoStyle() {
    this.setAlertStyle('info');
    this.setAcceptButtonStyle('info');
  }

  setAlertStyle(style: string) {
    const alert = (
      this.ref.nativeElement as HTMLElement
    ).getElementsByClassName('alert');
    this.render.addClass(alert.item(0), 'alert-' + style);
  }

  setAcceptButtonStyle(style: string) {
    const alert = (
      this.ref.nativeElement as HTMLElement
    ).getElementsByClassName('accept');
    if (alert.length === 0) return;
    this.render.addClass(alert.item(0), 'btn-' + style);
  }
}
