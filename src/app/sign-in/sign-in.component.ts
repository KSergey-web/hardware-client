import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private authService: AuthService
  ) {
    this.signInForm = formBuilder.group({
      "email": ["", [Validators.required, Validators.email]],
      "password": ["", [Validators.required, Validators.minLength(4), Validators.maxLength(30)]]
    });
  }

  ngOnInit(): void {
  }

  login() {
    const val = this.signInForm.value;
    this.authService.login(val)
      .subscribe(
        () => {
          console.log("User is logged in");
          //this.router.navigateByUrl('/');
        },
        (err: Error)=> {alert(`${err.message}`)}
      );
  }
}
