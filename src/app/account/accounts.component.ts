import {Component, OnInit} from '@angular/core';
import {AuthenticationService, AccountService} from '../_services';
import {Account} from '../_models';

@Component({
  selector: 'app-account',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  accounts: Account[] = [];
  sortValue: string;
  sortReverse = false;

  constructor(private authService: AuthenticationService, private accountService: AccountService) {
    this.accountService.getAccountsSubject().subscribe( (response: Account[]) => {
      this.accounts = response;
      this.accounts.sort((a, b) => {
        if (!this.sortReverse) {
          return ('' + a[this.sortValue]).localeCompare(b[this.sortValue]);
        } else {
          return ('' + b[this.sortValue]).localeCompare(a[this.sortValue]);
        }
      });
    });
  }

  ngOnInit() {
    this.authService.updateLoggedInVerification(); // This should automatically route if it fails
    this.sortBy('account_id');
    this.updateAccountList();
  }

  sortBy(value: string) {
    if (this.sortValue === value) {
      this.sortReverse = !this.sortReverse;
    } else {
      this.sortReverse = false;
    }
    this.sortValue = value;
    this.updateAccountList();
  }

  filterBy(value: string) {

  }

  updateAccountList() {
      this.accountService.updateAccounts();
  }

  editAccount(account: Account) {
    // TODO Sort items
  }

}
