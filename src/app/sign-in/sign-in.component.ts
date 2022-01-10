import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  signInForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.signInForm = formBuilder.group({
      "email": ["", [Validators.required, Validators.email]],
      "password": ["", [Validators.required, Validators.minLength(4), Validators.maxLength(30)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()){
      this.router.navigate((['']));
    }
  }

  login() {
    const val = this.signInForm.value;
    this.authService.login(val)
      .subscribe(
        () => {
          this.router.navigate((['']));
        },
        (err: Error)=> {
          alert(`Incorrect data`);
          console.log(err);
          }
      );
  }
}
