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
  quickRatio = 0;

  totalAssets = 0;
  totalLiabilities = 0;
  totalExpenses = 0;
  totalRevenue = 0;
  totalEquity = 0;
  totalNetIncome = 0;
  totalSales = 0;
  totalAssetTurnOver = 0;
  totalInventory = 0;

  public chartDatasets: Array<any> = [];

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
        this.getAssetTurnOver();
        this.getQuickRatio();
      }
      this.ran = true;
      this.chartDatasets = [
        {
          data: [this.currentRatio > 100 ? 100 : this.currentRatio, this.returnOnAssets > 100 ? 100 : this.returnOnAssets, this.totalAssetTurnOver > 100 ? 100 : this.totalAssetTurnOver, this.returnOnEquity > 100 ? 100 : this.returnOnEquity, this.debtRatio > 100 ? 100 : this.debtRatio, this.quickRatio > 100 ? 100 : this.quickRatio],
          label: 'Percentage'
        }
      ];
    });
  }

  ngOnInit() {
    this.appService.setActivePage('home');
    this.authService.updateLoggedInVerification();
    this.animate = true;
    this.returnOnAssets = 20;
  }

  getTotals() {
    for (let account of this.accounts) {
      if (account.account_id.toString().charAt(0) == '1') {
        if (account.account_title == 'Merchandise Inventory') {
          this.totalInventory += account.balance;
        }
        this.totalAssets += account.balance;
      } else if (account.account_id.toString().charAt(0) == '2') {
        this.totalLiabilities += (account.balance * (account.normal_side == 'debit' ? 1 : -1));
      } else if (account.account_id.toString().charAt(0) == '3') {
        console.log(account.account_title);
        this.totalEquity += (account.balance * (account.normal_side == 'debit' ? 1 : -1));
      } else if (account.account_id.toString().charAt(0) == '4') {
        if (account.account_title == 'Sales') {
          this.totalSales += (account.balance * (account.normal_side == 'debit' ? 1 : -1));
        }
        this.totalRevenue += (account.balance * (account.normal_side == 'debit' ? 1 : -1));
      } else if (account.account_id.toString().charAt(0) == '5') {
        this.totalExpenses += (account.balance * (account.normal_side == 'debit' ? 1 : -1));
      }
    }
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

  getAssetTurnOver() {
    this.totalAssetTurnOver = Math.round(this.totalSales / this.totalAssets);
  }

  getQuickRatio() {
    this.quickRatio = Math.round((this.totalAssets - this.totalInventory) / this.totalLiabilities);
  }

  //======================================== Chart ========================================//
  public chartType: string = 'bar';

  // public chartDatasets: Array<any> = [
  //   {data: [this.currentRatio, this.returnOnAssets, this.returnOnEquity, this.debtRatio], label: 'Percentage'}
  // ];

  public chartLabels: Array<any> = ['Current Ratio', 'Return On Assets', 'Asset Turnover', 'Return On Equity', 'Debt Ratio', 'Quick Ratio'];

  public chartColors: Array<any> = [
    {
      backgroundColor: '#404040',
      borderColor: 'rgba(220,220,220,1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(220,220,220,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(220,220,220,1)'
    },
    {
      backgroundColor: 'rgba(151,187,205,0.2)',
      borderColor: 'rgba(151,187,205,1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(151,187,205,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(151,187,205,1)'
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
