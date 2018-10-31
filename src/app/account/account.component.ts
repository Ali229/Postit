import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
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
  transactions: Transaction[];
  filterValue: string;

  constructor(private activatedRoute: ActivatedRoute,
              private appService: AppService,
              private accountService: AccountService,
              private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.authService.updateLoggedInVerification(); // This should automatically route if it fails
    this.account_id = parseInt(this.activatedRoute.snapshot.params.account_id);
    this.appService.setActivePage('account/' + this.account_id);
    this.accountService.getAccount(this.account_id).subscribe((response: Account) => {
      this.account = response;
    });
  }

  sortBy(value: string) {

  }

}
