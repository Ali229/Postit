import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './_services';
import {AppService} from './_services/app.service';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {
  padding:boolean;
  constructor(private appService: AppService) {
    this.appService.setActivePage('home');
  }

  checkpage() {
    if (this.appService.getActivePAge() === 'login') {
      this.padding = false;
    }
    else {
      this.padding = true;
    }
  }
}
