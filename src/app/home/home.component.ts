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
  ran = false;
  currentRatio = 0;
  returnOnAssets = 0;
  returnOnEquity = 0;
  debtRatio = 0;

  totalAssets = 0;
  totalLiabilities = 0;
  totalExpenses = 0;
  totalRevenue = 0;
  totalEquity = 0;
  totalNetIncome = 0;
  totalCash = 0;

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
      if (this.ran == false) {
        this.getTotals();
        this.getCurrentRatio();
        this.getReturnOnAssets();
        this.getReturnOnEquity();
        this.getDebtRatio();
      }
      this.ran = true;
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
        if (account.account_id == 100001) {
          this.totalCash += account.balance;
        }
        this.totalAssets += account.balance;
      } else if (account.account_id.toString().charAt(0) == '2') {
        this.totalLiabilities += account.balance;
      } else if (account.account_id.toString().charAt(0) == '3') {
        console.log(account.account_title);
        this.totalEquity += account.balance;
      } else if (account.account_id.toString().charAt(0) == '4') {
        this.totalRevenue += account.balance;
      } else if (account.account_id.toString().charAt(0) == '5') {
        this.totalExpenses += account.balance;
      }
    }
    console.log(this.totalCash);
    this.totalNetIncome = this.totalRevenue - this.totalExpenses;
  }

  getCurrentRatio() {
    this.currentRatio = Math.round(this.totalAssets / this.totalLiabilities);
  }

  getDebtRatio() {
    this.debtRatio = Math.round(this.totalLiabilities / this.totalAssets);
  }

  getReturnOnAssets() {
    this.returnOnAssets = Math.round(this.totalNetIncome / this.totalAssets);
  }

  getReturnOnEquity() {
    this.returnOnEquity = Math.round(this.totalNetIncome / this.totalEquity);
  }

  //======================================== Chart ========================================//
  public chartType: string = 'bar';

  public chartDatasets: Array<any> = [
    {data: [this.currentRatio, this.returnOnAssets, this.returnOnEquity, this.debtRatio], label: 'Percentage'},
  ];

  public chartLabels: Array<any> = ['Current Ratio', 'Return On Assets', 'Return On Equity', 'Debt Ratio'];

  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(220,220,220,0.2)',
      borderColor: 'rgba(220,220,220,1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(220,220,220,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(220,220,220,1)'
    }
  ];

  public chartOptions: any = {
    responsive: true
  };

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  //======================================== Chart ========================================//
}
