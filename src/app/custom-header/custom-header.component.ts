import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { IUser } from '../interfaces/user.interface';

@Component({
  selector: 'app-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
})
export class CustomHeaderComponent implements OnInit {
  currentUser?: IUser;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedOut()) {
      this.router.navigate(['']);
      return;
    }
    this.authService.currentUser$.subscribe(
      (user) => (this.currentUser = user),
      (err: Error) => {
        alert("Сouldn't get your data");
        console.error(err);
        this.logout();
        this.router.navigate(['signin']);
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
