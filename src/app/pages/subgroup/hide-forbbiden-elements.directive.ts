import { Directive, DoCheck, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Directive({ selector: '[hideForbbidenElements]' })
export class HideForbbidenElementsDirective implements DoCheck {
  constructor(
    private ref: ElementRef<HTMLElement>,
    private render: Renderer2,
    private authService: AuthService
  ) {}

  ngDoCheck(): void {
    this.hideForbbidenElements(this.authService.currentUser!.role!);
  }

  hideForbbidenElements(currentRole: string) {
    const elements =
      this.ref.nativeElement.querySelectorAll('[data-access-only]');
    elements.forEach((element) => {
      const accessRole = element.getAttribute('data-access-only');
      if (accessRole !== currentRole) {
        this.render.addClass(element, 'd-none');
      }
    });
  }
}
