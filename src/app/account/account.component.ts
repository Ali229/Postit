import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Account} from "../_models";
import {AppService} from "../_services/app.service";
import {AccountService, AuthenticationService} from "../_services";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  account_id: string;
  private account: Account;

  constructor(private activatedRoute: ActivatedRoute,
              private appService: AppService,
              private accountService: AccountService,
              private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.authService.updateLoggedInVerification();
    this.appService.setActivePage('account/' + this.account_id);
  }

}
