import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Account} from "../_models";
import {AppService} from "./app.service";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private accountArraySubject: Subject<Account[]>;
  private accountSubject: Subject<Account>;
  private account: Account;
  private loggedIn: boolean = false;

  constructor(private http: HttpClient, private appService: AppService, private authService: AuthenticationService) {
    this.accountArraySubject = new Subject();
    this.accountSubject = new Subject();

    this.appService.getTimer().subscribe(() => {
      this.updateAccounts();
      if (this.account) {
        this.updateAccount(this.account.account_id);
      }
    });

    this.authService.getVerifiedLoggedIn().subscribe(response => {
      this.loggedIn = response;
    })
  }

  updateAccounts() {
    if (this.loggedIn) {
      this.http.get<Account[]>('http://markzeagler.com/postit-backend/account/all',
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
    return this.http.post('http://markzeagler.com/postit-backend/account/' + account_id, body,
      this.authService.getPOSTPUTHeaders(body));
  }

  updateAccount(account_id) {
    this.http.get<any>('http://markzeagler.com/postit-backend/account/' + account_id.toString(),
      this.authService.getGETHeaders()).subscribe(response => {
      this.account = response['account'][0];
      this.accountSubject.next(response['account'][0]);
    });
  }

  getAccount(account_id: number) {
    this.updateAccount(account_id);
    return this.accountSubject;
  }
}
