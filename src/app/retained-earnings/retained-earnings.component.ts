import {Component, OnInit} from '@angular/core';
import {Account, Transaction} from "../_models";
import {AccountService, AppService, AuthenticationService} from "../_services";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-retained-earnings',
  templateUrl: './retained-earnings.component.html',
  styleUrls: ['./retained-earnings.component.scss']
})
export class RetainedEarningsComponent implements OnInit {

  oldTransactions: Transaction[] = [];
  newRevenue: Transaction[] = [];
  newDividends: Transaction[] = [];

  constructor(private authService: AuthenticationService,
              private accountService: AccountService,
              private route: ActivatedRoute,
              private router: Router,
              private appService: AppService) {
    this.accountService.getAccountsSubject().subscribe((response: Account[]) => {

      this.oldTransactions = [];
      this.newRevenue = [];
      this.newDividends = [];

      response.forEach(account => {

        if(account.normal_side == 'credit') {
          account.transactions.forEach(transaction => {
            transaction.amount = transaction.amount * -1;
          });
        }

        if (account.category == 'Revenue') {
          if (account.transactions) {
            account.transactions.forEach(transaction => {
              if (this.isNew(transaction)) {
                this.newRevenue.push(transaction);
              } else {
                this.oldTransactions.push(transaction);
              }
            })
          }
        } else if (account.category == 'Expenses') {
          if (account.transactions) {
            account.transactions.forEach(transaction => {
              if (this.isNew(transaction)) {
                this.newDividends.push(transaction);
              } else {
                this.oldTransactions.push(transaction);
              }
            })
          }
        }
      });
    });
  }

  isNew(transaction: Transaction) {
    return transaction.date.substring(7) === new DatePipe('en-US').transform(this.getDate(), 'y');
  }

  ngOnInit() {
    this.appService.setActivePage('retained-earnings');
    this.authService.updateLoggedInVerification(); // This should automatically route if it fails
    this.updateAccountList();
  }

  updateAccountList() {
    this.accountService.updateAccounts();
  }


  getDate() {
    return Date.now();
  }

  oldRetainedEarnings() {
    let sum = 0;
    this.oldTransactions.forEach( transaction => {
      sum += transaction.amount;
    });
    return sum;
  }

  netIncome() {
    let sum = 0;
    this.newRevenue.forEach( transaction => {
      sum += transaction.amount;
    });
    return sum * -1;
  }

  netDividends() {
    let sum = 0;
    this.newDividends.forEach( transaction => {
      sum += transaction.amount;
    });
    return sum;
  }

}
