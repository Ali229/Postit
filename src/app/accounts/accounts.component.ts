import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService, AccountService, AppService} from '../_services';
import {Account} from '../_models';
import {ActivatedRoute, Router} from "@angular/router";
import {ModalDirective} from "angular-bootstrap-md";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-account',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  sortValue: string = 'account_id';
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
  subcategories: Map<string, string[]> = new Map();
  availableSubcategories: string[] = [];

  constructor(public authService: AuthenticationService,
              private accountService: AccountService,
              private route: ActivatedRoute,
              private router: Router,
              private appService: AppService,
              private formBuilder: FormBuilder) {
    this.accountService.getAccountsSubject().subscribe((response: Account[]) => {
      this.accounts = response;
      this.accounts.sort((a, b) => {
        if (this.sortValue == 'account_id' || this.sortValue == 'balance') {
          return this.appService.numberCompare(a[this.sortValue], b[this.sortValue], this.sortReverse)
        } else {
          return this.appService.stringCompare(a[this.sortValue], b[this.sortValue], this.sortReverse)
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

    this.categories.push('');
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
    this.router.navigate(['./account/' + account.account_id], {queryParams: {returnUrl: 'accounts'}});
  }

  showAddAccount() {
    this.categories = this.accountService.getCategories();
    this.subcategories = this.accountService.getSubcategories();
    this.addAccountModal.show();
  }

  submitAccount() {
    let controls = this.addAccountForm.controls;
    this.accountService.createAccount(controls.account_id.value, controls.account_title.value, controls.normal_side.value,
      controls.description.value, controls.category.value, controls.subcategory.value).subscribe(response => {
      this.addAccountModal.hide();
    }, error => {
      console.log(error);
    });
  }

  clearError() {
    this.addAccountError = "";
  }

  updateCategory() {
    this.availableSubcategories = this.subcategories[this.addAccountForm.controls.category.value];
  }
}
