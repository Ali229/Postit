import {Injectable, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Account, JournalEntry, Transaction} from "../_models";
import {AppService} from "./app.service";
import {AuthenticationService} from "./authentication.service";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AccountService implements OnInit {
  private readonly accountArraySubject: Subject<Account[]>;
  private readonly accountSubject: Subject<Account>;
  private readonly journalSubject: Subject<JournalEntry[]>;
  private account: Account;
  private loggedIn: boolean = false;
  private userType: string;

  constructor(private http: HttpClient,
              private appService: AppService,
              private authService: AuthenticationService,
              private userService: UserService) {
    this.accountArraySubject = new Subject();
    this.accountSubject = new Subject();
    this.journalSubject = new Subject();

    this.appService.getTimer().subscribe(() => {
      if (this.loggedIn) {
        this.updateAccounts();
        this.updateJournalEntries();
        if (this.account) {
          this.updateAccount(this.account.account_id);
        }
      }
    });

    this.authService.getVerifiedLoggedIn().subscribe(response => {
      this.loggedIn = response;
    });

    this.userService.getCurrUser().subscribe(user => {
      this.userType = user.user_type;
    });
  }

  ngOnInit() {

  }

  updateAccounts() {
    if (this.loggedIn) {
      this.http.get<Account[]>('https://markzeagler.com/postit-backend/account/all', this.authService.getGETJSONHeaders()).subscribe(response => {
        this.accountArraySubject.next(response['accounts']);
      });
    }
  }

  getAccountsSubject() { // Should only be callable by admins (and perhaps managers)
    this.updateAccounts();
    return this.accountArraySubject;
  }

  createAccount(account_id: number, account_title: string, normal_side: string, description: string) {
    return this.http.post('https://markzeagler.com/postit-backend/account/' + account_id, {
      'account_title': account_title,
      'normal_side': normal_side,
      'description': description
    }, this.authService.getPOSTPUTJSONHeaders());
  }

  updateAccount(account_id) {
    this.http.get<any>('https://markzeagler.com/postit-backend/account/' + account_id.toString(), this.authService.getGETJSONHeaders()).subscribe(response => {
      this.account = response['account'][0];
      this.accountSubject.next(response['account'][0]);
    });
  }

  getAccount(account_id: number) {
    this.updateAccount(account_id);
    return this.accountSubject;
  }

  journalize(journal_type: string, date: Date, transactions: Transaction[], description: string) {
    console.log("Creating new journal:");
    return this.http.post('https://markzeagler.com/postit-backend/journal/new', {
      'transactions_list': transactions,
      'date': date.toDateString(),
      'description': description,
      'journal_type': journal_type
    }, this.authService.getPOSTPUTJSONHeaders());
  }

  getJournalSubject() {
    return this.journalSubject;
  }

  updateJournalEntries() {
    if (this.userType == 'manager' || this.userType == 'user') {
      this.http.get('https://markzeagler.com/postit-backend/journal/all', this.authService.getGETJSONHeaders()).subscribe(
        (journalEntries: JournalEntry[]) => {
          this.journalSubject.next(journalEntries['journal_entries']);
        });
    }
  }

  postJournalEntry(journalEntry: JournalEntry) {
    console.log("Posting journal entry to " + 'https://markzeagler.com/postit-backend/journal/' + journalEntry.journal_entry_id.toString());
    return this.http.put('https://markzeagler.com/postit-backend/journal/' + journalEntry.journal_entry_id.toString(), {
      'category': 'status',
      'value': 'posted'
    }, this.authService.getPOSTPUTJSONHeaders());
  }

  rejectJournalEntry(journalEntry: JournalEntry, rejectionReason: string) {
    return this.http.put('https://markzeagler.com/postit-backend/journal/' + journalEntry.journal_entry_id.toString(), {
      'category': 'status',
      'value': 'rejected',
      'description': journalEntry.description + '\n\nREJECTION REASON:' + rejectionReason
    }, this.authService.getPOSTPUTJSONHeaders());
  }

  getJournalEntryFilesList(journalEntry: JournalEntry) {
    return this.http.get('https://markzeagler.com/postit-backend/files/' + journalEntry.journal_entry_id.toString() + '/', this.authService.getGETJSONHeaders());
  }

  getJournalEntryFile(journalEntry: JournalEntry, filename: string) {
    window.open('https://markzeagler.com/postit-backend/files/' + journalEntry.journal_entry_id.toString() + '/' + filename + '/' + this.authService.getAuthToken(), '_blank');
  }

  uploadJournalEntryFile(journalEntry: JournalEntry, file: File) {
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post('https://markzeagler.com/postit-backend/files/' + journalEntry.journal_entry_id + '/', formData, this.authService.getPOSTPUTFileHeaders())
  }
}
