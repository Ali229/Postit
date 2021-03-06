import {Component, OnInit} from '@angular/core';
import {AuthenticationService, AccountService, AppService} from '../_services';
import {Account} from '../_models';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss']
})
export class TrialBalanceComponent implements OnInit {
  accounts: Account[] = [];

  constructor(private authService: AuthenticationService,
              private accountService: AccountService,
              private route: ActivatedRoute,
              private router: Router,
              private appService: AppService) {
    this.accountService.getAccountsSubject().subscribe((response: Account[]) => {
      this.accounts = [];
      response.forEach(account => {
        if(account.balance != 0) {
          this.accounts.push(account)
        }
      });
      this.accounts.sort( (a, b) => {
        return a['account_id'] - b['account_id'];
      })
    });
  }

  ngOnInit() {
    this.appService.setActivePage('trial-balance');
    this.authService.updateLoggedInVerification(); // This should automatically route if it fails
    this.updateAccountList();
  }

  updateAccountList() {
    this.accountService.updateAccounts();
  }

  getDate() {
    return Date.now();
  }

  getCreditSum() {
    let sum: number = 0;
    this.accounts.forEach( account => {
      if(account.normal_side == 'credit') {
        sum += account.balance;
      }
    });
    return sum;
  }

  getDebitSum() {
    let sum: number = 0;
    this.accounts.forEach( account => {
      if(account.normal_side == 'debit') {
        sum += account.balance;
      }
    });
    return sum;
  }

  openAccount(account: Account){
    this.router.navigate(['./account/' + account.account_id], {queryParams: {returnUrl: 'trial-balance'}})
  }
}
