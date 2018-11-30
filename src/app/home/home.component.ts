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
  returnOnAssets = 0;
  returnOnEquity = 0;

  totalAssets = 0;
  totalLiabilities = 0;
  totalExpenses = 0;
  totalRevenue = 0;
  totalEquity = 0;
  totalNetIncome = 0;

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
      this.getTotals();
      this.getCurrentRatio();
      this.getReturnOnAssets();
      this.getReturnOnEquity();
    });
  }

  ngOnInit() {
    this.appService.setActivePage('home');
    this.authService.updateLoggedInVerification();
    this.animate = true;
  }

  getTotals() {
    for (let account of this.accounts) {
      if (account.account_id.toString().charAt(0) == '1') {
        this.totalAssets += account.balance;
      } else if (account.account_id.toString().charAt(0) == '2') {
        this.totalLiabilities += account.balance;
      } else if (account.account_id.toString().charAt(0) == '3') {
        this.totalEquity += account.balance;
      } else if (account.account_id.toString().charAt(0) == '4') {
        this.totalRevenue += account.balance;
      } else if (account.account_id.toString().charAt(0) == '5') {
        this.totalExpenses += account.balance;
      }
    }
    this.totalNetIncome = this.totalRevenue - this.totalExpenses;
  }

  getCurrentRatio() {
    this.currentRatio = Math.round(this.totalAssets / this.totalLiabilities);
  }

  getReturnOnAssets() {
    this.returnOnAssets = Math.round(this.totalNetIncome / this.totalAssets);
  }

  getReturnOnEquity() {
    this.returnOnEquity = Math.round(this.totalNetIncome / this.totalEquity);
  }
}
