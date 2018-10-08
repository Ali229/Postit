import {Component, OnInit} from '@angular/core';
import {AuthenticationService, AccountService} from '../_services/index';
import {Account, User} from '../_models/index';

@Component({
  selector: 'app-account',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  accounts: Account[] = [];
  sortValue: string;
  sortReverse = false;
  filterValue: string;

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

  filterBy() {
    if (!this.filterValue) {
      return this.accounts;
    } else {
      let returnList: Account[] = [];
      this.accounts.forEach(account => {
        if (account.account_id.toString().includes(this.filterValue)) {
          returnList.push(account);
        } else if (account.account_title.includes(this.filterValue)) {
          returnList.push(account);
        } else if (account.normal_side.includes(this.filterValue)) {
          returnList.push(account);
        } else if (account.description.includes(this.filterValue)) {
          returnList.push(account);
        } else if (account.balance.toString().includes(this.filterValue)) {
          returnList.push(account);
        } else if (account.date_created.includes(this.filterValue)) {
          returnList.push(account);
        } else if (account.created_by.toString().includes(this.filterValue)) {
          returnList.push(account);
        } else if (account.last_edited_date.includes(this.filterValue)) {
          returnList.push(account);
        } else if (account.last_edited_by.toString().includes(this.filterValue)) {
          returnList.push(account);
        } else if (account.is_active.includes(this.filterValue)) {
          returnList.push(account);
        }
      });
      return returnList;
    }
  }

  updateAccountList() {
      this.accountService.updateAccounts();
  }

  editAccount(account: Account) {
    // TODO Sort items
  }

}
