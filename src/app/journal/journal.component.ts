import {Component, OnInit, ViewChild} from '@angular/core';
import {JournalEntry, Account, Transaction} from "../_models";
import {AccountService} from "../_services";
import {ModalDirective} from "angular-bootstrap-md";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {

  activeJournals: JournalEntry[] = [];

  // Journalize Modal
  @ViewChild('journalizeModal') public journalizeModal: ModalDirective;
  journalizeForm: FormGroup;
  journalizeError: string = '';
  accounts: Account[] = [];
  journalTypes: string[] = ['Regular', 'Adjusting'];
  debitLines: Transaction[] = [new Transaction()];
  creditLines: Transaction[] = [new Transaction()];

  constructor(private accountService: AccountService,
              private formBuilder: FormBuilder) {
    this.accountService.getAccountsSubject().subscribe((accounts: Account[]) => {
      this.accounts = accounts;
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
  }

  ngOnInit() {
  }

  filterBy() {
    return this.activeJournals;
  }

  showJournalizeModal() {
    this.journalizeModal.show();
  }

  submitJournalization() {

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
}
