import { Component } from '@angular/core';
import {AuthenticationService} from './_services';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})

export class AppComponent{
  padding: boolean;
  constructor() {
    localStorage.setItem('active_page', 'Login');
  }
  ngOnInit() {
    this.checkpage()
  }
  checkpage() {
    if(localStorage.getItem('active_page') === 'Login') {
      this.padding = false;
    }
    else {
      this.padding = true;
    }
    console.log(localStorage.getItem('active_page'));
  }
}
