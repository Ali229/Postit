import {Component, OnInit} from '@angular/core';
import {AccountService, AuthenticationService, UserService, AppService} from '../_services';
import {AppComponent} from '../app.component';
import {Account} from '../_models';

@Component({
  selector: 'table-sort',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
  private loggedIn: boolean = false;
  private animate = true;
  public userFirstName: string;
  // accounts: Account[];
  accounts: Account[] = [];

  constructor(private authService: AuthenticationService,
              private app: AppComponent,
              private appService: AppService,
              private userService: UserService,
              private accountService: AccountService) {

    this.authService.getVerifiedLoggedIn().subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });

    this.userService.getCurrUser().subscribe(user => {
      this.userFirstName = user['first_name'];
    });

    this.accountService.getAccountsSubject().subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  ngOnInit() {
    this.appService.setActivePage('home');
    this.authService.updateLoggedInVerification();
    this.animate = true;
  }

}
