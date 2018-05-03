import { User } from './../shared/user.model';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user = new User("","","","");
  isNavbarCollapsed = true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUserObservable()
      .subscribe(user => {
        this.user = user;
      });
    this.authService.emitUser(null);
  }

  toggleCollapsed() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  onLogout() {
    this.authService.logout();
    this.user = new User("","","","");
  }

}
