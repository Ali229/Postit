import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services';
import {AppComponent} from '../app.component';
import {AppService} from "../_services/app.service";

// import { first } from 'rxjs/operators';

@Component({
  selector: 'table-sort',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
  public username: string;

  constructor(private authService: AuthenticationService,
              private app: AppComponent,
              private appService: AppService) {
  }

  ngOnInit() {
    this.appService.setActivePage('home');
    this.authService.updateLoggedInVerification();
    this.authService.getUserName().subscribe(data => {
      this.username = data;
    });
  }
}
