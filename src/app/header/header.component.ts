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

  constructor(private authService: AuthService) { }

  ngOnInit() {
    const response = this.authService.getUser();
    if (response) {
      this.user = response.user;
    } else {
      this.user = {
        userId: null,
        username: null,
      }
    }
  }

  onLogout() {
    this.authService.logout();
  }

}
