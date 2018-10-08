import { Injectable } from '@angular/core';
import {interval} from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  timer = interval(5000);

  constructor() { }

  getTimer() {
    return this.timer;
  }

  setActivePage(activePage: string) {
    localStorage.setItem('active_page', activePage);
  }

  getActivePAge() {
    return localStorage.getItem('active_page');
  }
}
