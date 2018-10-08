import {Component, OnInit} from '@angular/core';
import {AuthenticationService, UserService} from '../_services';
import {AppComponent} from '../app.component';
import {AppService} from "../_services/app.service";

// import { first } from 'rxjs/operators';

@Component({
  selector: 'table-sort',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
  public userFirstName: string;

  constructor(private authService: AuthenticationService,
              private app: AppComponent,
              private appService: AppService,
              private userService: UserService) {
    this.authService.getVerifiedLoggedIn().subscribe(loggedIn => {
      this.userService.getCurrUser().subscribe(user => {
        this.userFirstName = user['first_name']
      });
    });
  }

  ngOnInit() {
    this.appService.setActivePage('home');
    this.authService.updateLoggedInVerification();
  }
}
