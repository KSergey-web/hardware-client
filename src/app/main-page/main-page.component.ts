import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { IUser } from '../interfaces/user.interface';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedOut()) {
      this.router.navigate(['signin']);
    }
  }

  ngOnInit(): void {}
}
