import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Account} from "../_models";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private accountArraySubject: Subject<Account[]>;
  private accountSubject: Subject<Account>;

  constructor(private http: HttpClient) {
    this.accountArraySubject = new Subject();
    this.accountSubject = new Subject();
  }

  updateAccounts() {
    this.http.get<Account[]>('http://markzeagler.com/postit-backend/account/all').subscribe(response => {
      this.accountArraySubject.next(response['accounts']);
    });
  }

  getAccountsSubject() { // Should only be callable by admins (and perhaps managers)
    this.updateAccounts();
    return this.accountArraySubject;
  }

  createAccount(account_id: number, account_title: string, normal_side: string, description: string) {
    return this.http.post('http://markzeagler.com/postit-backend/account/' + account_id, {
      'account_title': account_title,
      'normal_side': normal_side,
      'description': description
    });
  }

  updateAccount(accout_id) {
    this.http.get<Account>('http://markzeagler.com/postit-backend/account/' + accout_id.toString()).subscribe(response => {
      this.accountSubject.next(response['account']);
    });
  }

  getAccount(account_id: number) {
    this.updateAccount(account_id);
    return this.accountSubject;
  }
}
