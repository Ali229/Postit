import {Component, OnInit, ViewChild} from '@angular/core';
import {JournalEntry, Account, Transaction} from "../_models";
import {AccountService, UserService} from "../_services";
import {ModalDirective} from "angular-bootstrap-md";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-journals',
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.scss']
})
export class JournalsComponent implements OnInit {

  journalEntries: JournalEntry[] = [];
  userType: string;
  sortValue: string = 'date';
  sortReverse: boolean = false;
  loading:boolean = false;

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
  statusFilter: string = 'pending';
  descriptionFilter: string;
  dateFilter: string;

  // Reject Modal
  @ViewChild('rejectModal') public rejectModal: ModalDirective;
  rejectForm: FormGroup;
  rejectionError: string;
  rejectingJournalEntry: JournalEntry;

  // File Modal
  @ViewChild('fileModal') public fileModal: ModalDirective;
  displayingJournalFiles: JournalEntry;
  loadingFilesList: boolean = true;
  filesList: string[];
  selectedFiles: File[];

  constructor(private accountService: AccountService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              public router: Router) {
    this.userService.getCurrUser().subscribe(user => {
      this.userType = user.user_type;
    });

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

    this.accountService.getJournalSubject().subscribe((journalEntries: JournalEntry[]) => {
      this.loading = false;
      this.journalEntries = journalEntries;
      this.journalEntries.sort((a, b) => {
        if (!this.sortReverse) {
          return ('' + a[this.sortValue]).localeCompare(b[this.sortValue]);
        } else {
          return ('' + b[this.sortValue]).localeCompare(a[this.sortValue]);
        }
      });
    });

    this.journalizeForm = this.formBuilder.group({
      // date: ['', Validators.required],
      description: [''],
      journal_type: ['', Validators.required],
      debit_account: ['', Validators.required],
      debit_amount: ['', Validators.required],
      credit_account: ['', Validators.required],
      credit_amount: ['', Validators.required]
    });

    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required]
    });

  }

  ngOnInit() {
    this.loading = true;
    this.accountService.updateAccounts();
    this.accountService.updateJournalEntries();
  }

  filterBy() {
    return this.journalEntries;
  }

  sortBy(value: string) {
    if (this.sortValue === value) {
      this.sortReverse = !this.sortReverse;
    } else {
      this.sortReverse = false;
    }
    this.sortValue = value;
    this.accountService.updateJournalEntries();
  }

  showJournalizeModal() {
    this.journalizeModal.show();
  }

  submitJournalization() {
    console.log("Submitting journals entry");
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
    this.accountService.journalize(this.journalizeForm.controls.journal_type.value.toString().toLowerCase(), new Date(), transactionsList,
      this.journalizeForm.controls.description.value).subscribe(response => {
      this.journalizeModal.hide();
    }, error => {
      console.log(error);
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

  openRejectionReasonModal(journalEntry: JournalEntry) {
    this.rejectingJournalEntry = journalEntry;
    this.rejectModal.show();
  }

  submitRejection() {
    this.accountService.rejectJournalEntry(this.rejectingJournalEntry, this.rejectForm.controls.reason.value);
  }

  postJournalEntry(journalEntry: JournalEntry) {
    this.accountService.postJournalEntry(journalEntry).subscribe(response => {
      this.accountService.updateAccounts();
    }, error => {
      console.log(error);
    });
  }

  openFileModal(journalEntry: JournalEntry) {
    this.displayingJournalFiles = journalEntry;
    this.updateFileList();
    this.fileModal.show();
  }

  openAccount(transaction: Transaction) {
    this.router.navigate(['./account/' + transaction.account_id.toString()], {queryParams: {returnUrl: 'journal'}});
  }

  getAccountName(transaction: Transaction) {
    if (transaction.amount > 0) {
      return transaction.account_title;
    } else {
      return "\t" + transaction.account_title;
    }
  }

  getAmount(transaction: Transaction) {
    if (transaction.amount > 0) {
      return '$' + transaction.amount.toFixed(2).toString() + '\t';
    } else {
      return '$' + (transaction.amount * -1).toFixed(2).toString();
    }
  }

  downloadFile(filename: string) {
    this.accountService.getJournalEntryFile(this.displayingJournalFiles, filename);
  }

  fileChange(event) {
    this.selectedFiles = event.target.files;
  }

  uploadFile() {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.accountService.uploadJournalEntryFile(this.displayingJournalFiles, this.selectedFiles[i]).subscribe(response => {
        this.updateFileList();
      }, error => {
        console.log(error);
      });
    }
  }

  updateFileList() {
    this.loadingFilesList = true;
    this.accountService.getJournalEntryFilesList(this.displayingJournalFiles).subscribe( response => {
      this.filesList = response['filenames'];
      this.loadingFilesList = false;
    });
  }
}
