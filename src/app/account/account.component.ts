import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Account, Transaction} from "../_models";
import {AccountService, AuthenticationService, AppService} from "../_services";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  account_id: number;
  account: Account;
  filterValue: string;
  balanceMap: Map<Transaction, number> = new Map();
  referer: string;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private appService: AppService,
              private accountService: AccountService,
              private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.authService.updateLoggedInVerification(); // This should automatically route if it fails
    this.account_id = parseInt(this.activatedRoute.snapshot.params.account_id);
    this.appService.setActivePage('account/' + this.account_id);
    this.referer = this.activatedRoute.snapshot.queryParamMap.get('returnUrl');
    this.accountService.getAccount(this.account_id).subscribe((response: Account) => {
      this.balanceMap.clear();
      this.account = response;
      let runningBalance = 0;
      if(this.account) {
        for (let i = 0; i < this.account.transactions.length; i++) {
          runningBalance += this.account.transactions[i].amount;
          this.balanceMap.set(this.account.transactions[i], runningBalance);
        }
      }
    });
  }

  sortBy(value: string) {

  }

  back() {
    this.router.navigate(['/' + this.referer]);
  }

}
