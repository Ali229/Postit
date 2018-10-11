import {Component, OnInit} from '@angular/core';
import {AccountService, AuthenticationService, UserService} from '../_services';
import {AppComponent} from '../app.component';
import {AppService} from "../_services/app.service";
import {Account} from "../_models";

// import { first } from 'rxjs/operators';

@Component({
  selector: 'table-sort',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {

  private loggedIn: boolean;
  public userFirstName: string;
  accounts: Account[];

  constructor(private authService: AuthenticationService,
              private app: AppComponent,
              private appService: AppService,
              private userService: UserService,
              private accountService: AccountService) {

    this.authService.getVerifiedLoggedIn().subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });

    this.userService.getCurrUser().subscribe(user => {
      this.userFirstName = user['first_name']
    });

    this.accountService.getAccountsSubject().subscribe( accounts => {
      this.accounts = accounts;
    });
  }

  ngOnInit() {
    this.appService.setActivePage('home');
    this.authService.updateLoggedInVerification();
  }
}
