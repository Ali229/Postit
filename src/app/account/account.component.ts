import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Account} from "../_models";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  account_id: string;
  private account: Account;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.account_id = this.activatedRoute.snapshot.params.account_id;
  }

}
