import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Account, Transaction} from "../_models";
import {AccountService, AuthenticationService, AppService} from "../_services";
import {Chart} from 'chart.js';

@Component({
  selector: 'app-income-statement',
  templateUrl: './income-statement.component.html',
  styleUrls: ['./income-statement.component.scss']
})
export class IncomeStatementComponent implements OnInit {

  revenueAccounts: Account[] = [];
  expenseAccounts: Account[] = [];

  constructor(private authService: AuthenticationService,
              private accountService: AccountService,
              private route: ActivatedRoute,
              private router: Router,
              private appService: AppService) {
    this.accountService.getAccountsSubject().subscribe((response: Account[]) => {

      this.revenueAccounts = [];
      this.expenseAccounts = [];

      response.forEach(account => {
        if (account.balance != 0) {
          if (account.category == 'Revenue') {
            this.revenueAccounts.push(account)
          } else if (account.category == 'Expenses') {
            this.expenseAccounts.push(account)
          }
        }
      });

      this.revenueAccounts.sort((a, b) => {
        return a['account_id'] - b['account_id'];
      });

      this.expenseAccounts.sort((a, b) => {
        return a['account_id'] - b['account_id'];
      });

      // debugger;
    });
  }

  ngOnInit() {
    this.appService.setActivePage('income-statement');
    this.authService.updateLoggedInVerification(); // This should automatically route if it fails
    this.updateAccountList();
  }

  updateAccountList() {
    // this.accountService.updateAccounts();
  }

  getDate() {
    return Date.now();
  }

  getRevenueSum() {
    let sum: number = 0;
    this.revenueAccounts.forEach(account => {
      if (account.normal_side == 'credit') {
        sum += account.balance;
      }
    });
    return sum;
  }

  getExpenseSum() {
    let sum: number = 0;
    this.expenseAccounts.forEach(account => {
      if (account.normal_side == 'debit') {
        sum += account.balance;
      }
    });
    return sum;
  }

  openAccount(account: Account) {
    this.router.navigate(['./account/' + account.account_id], {queryParams: {returnUrl: 'income-statement'}})
  }
}
