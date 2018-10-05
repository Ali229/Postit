import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "./authentication.service";
import {Account} from "../_models";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private accounts: Account[] = [];

  constructor(private http: HttpClient, private authService: AuthenticationService) {
    // TODO Initialize usersObservable
  }

  getAll() { // Should only be callable by admins (and perhaps managers)
    const requestResponse: Observable<any> = this.http.get<Account[]>('http://markzeagler.com/postit-backend/account/all');

    requestResponse.subscribe(response => {
      this.accounts = response.accounts;
    });

    return requestResponse;
  }

  create(account_id: number, account_title: string, normal_side: string, description: string) {
    return this.http.post('http://markzeagler.com/postit-backend/account/' + account_id, {
      'account_title': account_title,
      'normal_side': normal_side,
      'description': description
    });
  }
}
