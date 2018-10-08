import {Injectable} from '@angular/core';
import {interval, Subject} from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  timer = interval(5000);
  activePageSubject: Subject<string>;
  private activePageStorageName: string = 'active_page';

  constructor() {
    this.activePageSubject = new Subject();
    let activePage = localStorage.getItem(this.activePageStorageName);
    if (activePage) {
      this.activePageSubject.next(activePage);
    }
  }

  getTimer() {
    return this.timer;
  }

  setActivePage(activePage: string) {
    localStorage.setItem(this.activePageStorageName, activePage);
    this.activePageSubject.next(activePage);
  }

  getActivePAge() {
    return localStorage.getItem(this.activePageStorageName);
  }

  getActivePageSubject() {
    return this.activePageSubject;
  }
}
