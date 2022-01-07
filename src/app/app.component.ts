import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hardware-client';
  private _isloggedIn: boolean;
  
  constructor(private authService: AuthService){
    this._isloggedIn = authService.isLoggedIn()
  }

  get isLoggedIn(){
    return this._isloggedIn;
  }
  
}
