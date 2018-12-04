import { Component, OnInit } from '@angular/core';
import {Account} from "../_models";
import {AccountService, AppService, AuthenticationService} from "../_services";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent implements OnInit {

  assetAccounts: Account[] = [];
  liabilityAccounts: Account[] = [];
  equityAccounts: Account[] = [];

  constructor(private authService: AuthenticationService,
              private accountService: AccountService,
              private route: ActivatedRoute,
              private router: Router,
              private appService: AppService) {
    this.accountService.getAccountsSubject().subscribe((response: Account[]) => {

      this.assetAccounts = [];
      this.liabilityAccounts = [];
      this.equityAccounts = [];

      response.forEach(account => {
        if (account.balance != 0) {
          if (account.category == 'Assets') {
            this.assetAccounts.push(account)
          } else if (account.category == 'Liabilities') {
            this.liabilityAccounts.push(account)
          }else if (account.category == 'Owner\'s Equity') {
            this.equityAccounts.push(account)
          }
        }
      });

      this.assetAccounts.sort((a, b) => {
        return a['account_id'] - b['account_id'];
      });

      this.liabilityAccounts.sort((a, b) => {
        return a['account_id'] - b['account_id'];
      });

      this.equityAccounts.sort((a, b) => {
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

  getAssetSum() {
    let sum: number = 0;
    this.assetAccounts.forEach(account => {
      if (account.normal_side == 'debit') {
        sum += account.balance;
      }
    });
    return sum;
  }

  getLiabilitySum() {
    let sum: number = 0;
    this.liabilityAccounts.forEach(account => {
      if (account.normal_side == 'credit') {
        sum += account.balance;
      }
    });
    return sum;
  }

  getEquitySum() {
    let sum: number = 0;
    this.equityAccounts.forEach(account => {
      if (account.normal_side == 'credit') {
        sum += account.balance;
      }
    });
    return sum;
  }

  openAccount(account: Account) {
    this.router.navigate(['./account/' + account.account_id], {queryParams: {returnUrl: 'income-statement'}})
  }

}
