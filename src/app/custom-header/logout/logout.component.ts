import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(
    private activeModal: NgbActiveModal,
    private authService: AuthService
  ) {}

  logout(): void {
    this.activeModal.close();
    this.authService.logout();
  }

  dissmis(): void {
    this.activeModal.dismiss();
  }

  ngOnInit(): void {}
}
