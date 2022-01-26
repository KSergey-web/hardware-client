import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import { IUser } from '../interfaces/user.interface';
import { NewSessionComponent } from '../new-session/new-session.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {
    if (this.authService.isLoggedOut()) {
      this.router.navigate(['signin']);
    }
  }

  createNewSession() {
    const modalRef = this.modalService.open(NewSessionComponent);
  }

  ngOnInit(): void {}
}
