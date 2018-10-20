import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService, AccountService, UserService} from '../_services';
import {Account} from '../_models';
import {ActivatedRoute, Router} from "@angular/router";
import {AppService} from "../_services/app.service";
import {ModalDirective} from "angular-bootstrap-md";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-account',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  sortValue: string;
  sortReverse = false;
  accountIdFilter: string;
  accountTitleFilter: string;
  balanceFilter: string;
  normalSideFilter: string;
  descriptionFilter: string;
  dateCreatedFilter: string;
  createdByFilter: string;
  lastEditedFilter: string;
  lastEditedByFilter: string;
  isActiveFilter: string;

  // Add Account
  @ViewChild('addAccountModal') public addAccountModal: ModalDirective;
  addAccountForm: FormGroup;
  addAccountError: string = '';
  normalSides: string[] = ['credit', 'debit'];
  categories: string[] = [];
  subcategories: string[] = [];

  constructor(private authService: AuthenticationService,
              private accountService: AccountService,
              private route: ActivatedRoute,
              private router: Router,
              private appService: AppService,
              private formBuilder: FormBuilder) {
    this.accountService.getAccountsSubject().subscribe((response: Account[]) => {
      this.accounts = response;
      this.accounts.sort((a, b) => {
        if (!this.sortReverse) {
          return ('' + a[this.sortValue]).localeCompare(b[this.sortValue]);
        } else {
          return ('' + b[this.sortValue]).localeCompare(a[this.sortValue]);
        }
      });
    });
    this.addAccountForm = this.formBuilder.group({
      account_id: ['', Validators.required],
      account_title: ['', Validators.required],
      description: [''],
      normal_side: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.appService.setActivePage('accounts');
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
    let returnList: Account[] = [];
    this.accounts.forEach(account => {
      if ((!this.accountIdFilter || account.account_id.toString().includes(this.accountIdFilter)) &&
        (!this.accountTitleFilter || account.account_title.toLowerCase().includes(this.accountTitleFilter.toLowerCase())) &&
        (!this.balanceFilter || account.balance.toString().includes(this.balanceFilter)) &&
        (!this.normalSideFilter || account.normal_side.includes(this.normalSideFilter)) &&
        (!this.descriptionFilter || account.description.includes(this.descriptionFilter)) &&
        (!this.dateCreatedFilter || account.date_created.includes(this.dateCreatedFilter)) &&
        (!this.createdByFilter || account.created_by.toString().includes(this.createdByFilter)) &&
        (!this.lastEditedFilter || account.last_edited_date.includes(this.lastEditedFilter)) &&
        (!this.lastEditedByFilter || account.last_edited_by.includes(this.lastEditedByFilter)) &&
        (!this.isActiveFilter || account.is_active.includes(this.isActiveFilter))) {
        returnList.push(account);
      }
    });
    return returnList;
  }

  updateAccountList() {
    this.accountService.updateAccounts();
  }

  editAccount(account: Account) {
    this.router.navigate(['./account/' + account.account_id]);
  }

  showAddAccount() {
    this.addAccountModal.show();
  }

  submitAccount() {

  }

  clearError() {
    this.addAccountError = "";
  }
}
