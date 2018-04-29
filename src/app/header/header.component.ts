import { User } from './../shared/user.model';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User;
  isAuthenticated: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUserObservable()
      .subscribe(user => {
        this.user = user;
      });
    this.authService.emitUser(null);
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  onLogout() {
    this.authService.logout();
    this.user = null;
    this.isAuthenticated = this.authService.isAuthenticated();
  }

}
