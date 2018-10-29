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
  userType: string;

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
    this.accountService.updateAccounts();

    this.accountService.getJournalSubject().subscribe((journalEntries: JournalEntry[]) => {
      this.journalEntries = journalEntries;
    });
    this.accountService.updateJournalEntries();

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

  openRejectionReasonModal(journalEntry: JournalEntry) {
    this.rejectingJournalEntry = journalEntry;
    this.rejectModal.show();
  }

  submitRejection() {
    this.accountService.rejectJournalEntry(this.rejectingJournalEntry, this.rejectForm.controls.reason.value);
  }

  postJournalEntry(journalEntry: JournalEntry) {
    this.accountService.postJournalEntry(journalEntry).subscribe( response => {
      this.accountService.updateAccounts();
    }, error => {
      console.log(error);
    });
  }

  openFileModal(journalEntry: JournalEntry) {
    this.loadingFilesList = true;
    this.displayingJournalFiles = journalEntry;
    this.accountService.getJournalEntryFilesList(journalEntry).subscribe( response => {
      this.filesList = response['filenames'];
      this.loadingFilesList = false;
    });
    this.fileModal.show();
  }

  openAccount(transaction: Transaction) {
    this.router.navigate(['./account/' + transaction.account_id.toString()]);
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
      return "$" + transaction.amount.toString();
    } else {
      return "\t$" + (transaction.amount * -1).toString();
    }
  }

  downloadFile(filename: string) {
    this.accountService.getJournalEntryFile(this.displayingJournalFiles, filename).subscribe( response => {
      // https://stackoverflow.com/questions/52154874/angular-6-downloading-file-from-rest-api
      // It is necessary to create a new blob object with mime-type explicitly set
      // otherwise only Chrome works like it should
      var newBlob = new Blob([response], { type: "*/*" });

      // IE doesn't allow using a blob object directly as link href
      // instead it is necessary to use msSaveOrOpenBlob
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }

      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const data = window.URL.createObjectURL(newBlob);

      var link = document.createElement('a');
      link.href = data;
      link.download = "Je kar.pdf";
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
      }, 100);
    })
  }
}
