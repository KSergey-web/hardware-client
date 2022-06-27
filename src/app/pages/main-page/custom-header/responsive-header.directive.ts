import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({ selector: '[responsive]' })
export class ResponsiveHeaderDirective implements AfterViewInit, OnDestroy {
  constructor(
    private ref: ElementRef<HTMLElement>,
    private render: Renderer2
  ) {}
  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngAfterViewInit(): void {
    this.subOnClickToggler();
  }

  subOnClickToggler(): void {
    const toggler = this.ref.nativeElement.querySelector('#navbar-toggler');
    if (!toggler) return;
    fromEvent(toggler, 'click')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.toggleHeader();
      });
  }

  toggleHeader(): void {
    const toggler = this.ref.nativeElement.querySelector('#navbar-toggler');
    if (!toggler) return;
    let ariaExpanded =
      toggler.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
    this.render.setAttribute(toggler, 'aria-expanded', ariaExpanded);
    const menu = this.ref.nativeElement.querySelector('#navbarMenu');
    menu?.classList.toggle('show');
  }
}
