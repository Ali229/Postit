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
      this.http.get<Account[]>('https://markzeagler.com/postit-backend/account/all',
        this.authService.getGETHeaders()).subscribe(response => {
        this.accountArraySubject.next(response['accounts']);
      });
    }
  }

  getAccountsSubject() { // Should only be callable by admins (and perhaps managers)
    this.updateAccounts();
    return this.accountArraySubject;
  }

  createAccount(account_id: number, account_title: string, normal_side: string, description: string) {
    let body = {
      'account_title': account_title,
      'normal_side': normal_side,
      'description': description
    };
    return this.http.post('https://markzeagler.com/postit-backend/account/' + account_id, body,
      this.authService.getPOSTPUTHeaders(body));
  }

  updateAccount(account_id) {
    this.http.get<any>('https://markzeagler.com/postit-backend/account/' + account_id.toString(),
      this.authService.getGETHeaders()).subscribe(response => {
      this.account = response['account'][0];
      this.accountSubject.next(response['account'][0]);
    });
  }

  getAccount(account_id: number) {
    this.updateAccount(account_id);
    return this.accountSubject;
  }

  journalize(journal_type: string, date: Date, transactions: Transaction[], description: string) {
    let body = {
      'transactions_list': transactions,
      'date': date.toDateString(),
      'description': description,
      'journal_type': journal_type
    };
    console.log("Creating new journal:");
    console.log(body);
    return this.http.post('https://markzeagler.com/postit-backend/journal/new', body, this.authService.getPOSTPUTHeaders(body));
  }

  getJournalSubject() {
    return this.journalSubject;
  }

  updateJournalEntries() {
    if (this.userType == 'manager' || this.userType == 'user') {
      this.http.get('https://markzeagler.com/postit-backend/journal/all', this.authService.getGETHeaders()).subscribe(
        (journalEntries: JournalEntry[]) => {
          this.journalSubject.next(journalEntries['journal_entries']);
        });
    }
  }

  postJournalEntry(journalEntry: JournalEntry) {
    console.log("Posting journal entry to " + 'https://markzeagler.com/postit-backend/journal/' + journalEntry.journal_entry_id.toString());
    let body = {
      'category': 'status',
      'value': 'posted'
    };
    return this.http.put('https://markzeagler.com/postit-backend/journal/' + journalEntry.journal_entry_id.toString(), body, this.authService.getPOSTPUTHeaders(body));
  }

  rejectJournalEntry(journalEntry: JournalEntry, rejectionReason: string) {
    let rejectBody = {
      'category': 'status',
      'value': 'rejected'
    };
    this.http.put('https://markzeagler.com/postit-backend/journal/' + journalEntry.journal_entry_id.toString(), rejectBody, this.authService.getPOSTPUTHeaders(rejectBody)).subscribe(response => {
      let reasonBody = {
        'category': 'description',
        'value': journalEntry.description + '\n\nREJECTION REASON:' + rejectionReason
      };
      this.http.put('https://markzeagler.com/postit-backend/journal/' + journalEntry.journal_entry_id.toString(), reasonBody, this.authService.getPOSTPUTHeaders(reasonBody)).subscribe( response => {

      }, error => {
        console.log(error)
      })
    }, error => {
      console.log(error)
    })
  }
}
