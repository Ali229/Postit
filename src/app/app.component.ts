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
    this.appService.getActivePageSubject().subscribe( active_page => {
      this.checkpage();
    });
  }

  checkpage() {
    this.padding = this.appService.getActivePAge() !== 'login';
  }
}
