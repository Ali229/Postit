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
    // userService.getUsersObservable().subscribe( () => {
    //
    // })
  }

  ngOnInit() {
    this.authService.verifyLoggedIn(); // This should automatically route if it fails
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
    console.log('Sorting by: ' + value + (this.sortReverse ? ' regular' : ' reversed'));
  }

  filterBy(value: string) {

  }

  updateAccountList() {
    this.accountService.getAll().subscribe(response => {
      this.accounts = response.accounts;
      this.accounts.sort((a, b) => {
        if (!this.sortReverse) {
          return ('' + a[this.sortValue]).localeCompare(b[this.sortValue]);
        } else {
          return ('' + b[this.sortValue]).localeCompare(a[this.sortValue]);
        }
      });
    });
  }

  updateAccount(account: Account) {
    // TODO Sort items
  }

}
