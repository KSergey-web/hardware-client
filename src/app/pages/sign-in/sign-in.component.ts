import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModalDialogBoxBuilder } from '../../widgets/common-dialog-boxes/common-modal-dialog-box-builder.class';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  signInForm: FormGroup;
  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.signInForm = formBuilder.group({
      email: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
        ],
      ],
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }

  login() {
    const val = this.signInForm.value;
    this.authService
      .login(val)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.router.navigate(['']);
      }, this.errorResponseHandler.bind(this));
  }

  private errorResponseHandler(err: HttpErrorResponse) {
    switch (err.status) {
      case 400:
        const text =
          'Неверный логин или пароль. Проверьте правильность введенных данных и повторите попытку';
        this.createBadModalAlert({ text });
        break;
      default:
        this.createBadModalAlert({});
        break;
    }
  }

  createBadModalAlert({ header = 'Ошибка', text = 'Что-то пошло не так' }) {
    const bulder = new CommonModalDialogBoxBuilder(this.modalService);
    bulder.addHeader(header).addText(text).setDangerStyle().openAlertModal();
  }
}
