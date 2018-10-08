import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Account} from "../_models";
import {AppService} from "../_services/app.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  account_id: string;
  private account: Account;

  constructor(private activatedRoute: ActivatedRoute, private appService: AppService) {
  }

  ngOnInit() {
    this.account_id = this.activatedRoute.snapshot.params.account_id;
    this.appService.setActivePage('account/' + this.account_id);
  }

}
