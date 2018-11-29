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
  accounts: Account[] = [];
  currentRatio = 0;

  constructor(private authService: AuthenticationService,
              private app: AppComponent,
              private appService: AppService,
              private userService: UserService,
              private accountService: AccountService) {

    this.authService.getLoggedInSubject().subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });

    this.userService.getCurrUser().subscribe(user => {
      this.userFirstName = user['first_name'];
    });

    this.accountService.getAccountsSubject().subscribe(accounts => {
      this.accounts = accounts;
      this.getCurrentRatio();
    });
  }

  ngOnInit() {
    this.appService.setActivePage('home');
    this.authService.updateLoggedInVerification();
    this.animate = true;
  }

  getCurrentRatio() {
    var totalAssets = 0;
    var totalLiabilities = 0;
    for (let account of this.accounts) {
      if (account.account_id.toString().charAt(0) == '1') {
        totalAssets += account.balance;
      } else if (account.account_id.toString().charAt(0) == '2') {
        totalLiabilities += account.balance;
      }
    }
    this.currentRatio = Math.round(totalAssets / totalLiabilities);
  }
}
