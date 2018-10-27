import {Component, OnInit, ViewChild} from '@angular/core';
import {JournalEntry, Account, Transaction} from "../_models";
import {AccountService, UserService} from "../_services";
import {ModalDirective} from "angular-bootstrap-md";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {

  journalEntries: JournalEntry[] = [];

  // Journalize Modal
  @ViewChild('journalizeModal') public journalizeModal: ModalDirective;
  journalizeForm: FormGroup;
  journalizeError: string = '';
  accounts: Account[] = [];
  journalTypes: string[] = ['Regular', 'Adjusting'];
  debitLines: Transaction[] = [new Transaction()];
  creditLines: Transaction[] = [new Transaction()];

  // Filters
  journalIdFilter: string;
  postingReferenceFilter: string;
  transactionFilterRaw: string;
  transactionFilterGroups: string[];
  creatorFilter: string;
  typeFilter: string;
  statusFilter: string = 'new';
  descriptionFilter: string;

  constructor(private accountService: AccountService,
              private formBuilder: FormBuilder) {
              public router: Router) {
    this.accountService.getAccountsSubject().subscribe((accounts: Account[]) => {
      // Have to do this so the accounts in the modal aren't reset
      for (let account of accounts) {
        if (!this.accounts.includes(account)) {
          this.accounts.push(account);
        }
      }
      for (let account of this.accounts) {
        if (!accounts.includes(account)) {
        }
        let index = this.accounts.indexOf(account);
        this.accounts.slice(index, 1);
      }
    });
    this.accountService.updateAccounts();


    this.journalizeForm = this.formBuilder.group({
      // date: ['', Validators.required],
      description: [''],
      journal_type: ['', Validators.required],
      debit_account: ['', Validators.required],
      debit_amount: ['', Validators.required],
      credit_account: ['', Validators.required],
      credit_amount: ['', Validators.required]
    });

    this.accountService.getJournalSubject().subscribe((journalEntries: JournalEntry[]) => {
      this.journalEntries = journalEntries;
    });

    this.accountService.updateJournalEntries();
  }

  ngOnInit() {
  }

  filterBy() {
    return this.journalEntries;
  }

  showJournalizeModal() {
    this.journalizeModal.show();
  }

  submitJournalization() {
    console.log("Submitting journal entry");
    let transactionsList: Transaction[] = [];
    for (let transaction of this.debitLines) {
      if (transaction.amount <= 0) {
        console.log("A debit line is 0 or negative")
      }
      transactionsList.push(transaction);
    }
    for (let transaction of this.creditLines) {
      if (transaction.amount <= 0) {
        console.log("A credit line is 0 or negative")
      }
      transaction.amount = transaction.amount * -1;
      transactionsList.push(transaction);
    }
    console.log(transactionsList);
    this.accountService.journalize(this.journalizeForm.controls.journal_type.value, new Date(), transactionsList,
      this.journalizeForm.controls.description.value).subscribe(response => {
      this.journalizeModal.hide();
    }, error => {
      console.log(error)
    });
  }

  addDebitRow() {
    this.debitLines.push(new Transaction())
  }

  removeDebitRow() {
    if (this.debitLines.length > 1) {
      this.debitLines.pop();
    }
  }

  addCreditRow() {
    this.creditLines.push(new Transaction())
  }

  removeCreditRow() {
    if (this.creditLines.length > 1) {
      this.creditLines.pop();
    }
  }

  setTransactionAmount(transaction: Transaction, amount: string) {
    transaction.amount = Number.parseFloat(amount)
  }

  setTransactionAccount(transaction: Transaction, account_id: string) {
    transaction.account_id = Number.parseInt(account_id);
  }
  openAccount(transaction: Transaction) {
    console.log()
    this.router.navigate(['./account/' + transaction.account_id.toString()]);
  }
}
