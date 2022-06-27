import { Directive, DoCheck, ElementRef, Renderer2 } from '@angular/core';
import { roleUserEnum } from 'src/app/enums/role-user.enum';
import { AuthService } from 'src/app/services/auth.service';

@Directive({ selector: '[authenticatedUserView]' })
export class AuthenticatedUserViewDirective implements DoCheck {
  constructor(
    private ref: ElementRef<HTMLElement>,
    private render: Renderer2,
    private authService: AuthService
  ) {}

  ngDoCheck(): void {
    this.hideForbbidenElements();
  }

  hideForbbidenElements() {
    if (this.authService.currentUser?.role !== roleUserEnum.authenticated)
      return;
    const elements = this.ref.nativeElement.querySelectorAll(
      '[data-access-only=teacher]'
    );
    elements.forEach((element) => {
      this.render.addClass(element, 'd-none');
    });
  }
}
