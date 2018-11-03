import {HostListener, Injectable} from '@angular/core';
import {interval, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  timer = interval(5000);
  timerSubject: Subject<number>;
  activePageSubject: Subject<string>;
  private activePageStorageName: string = 'active_page';
  isActive: boolean = true;

  constructor() {
    this.activePageSubject = new Subject();
    let activePage = localStorage.getItem(this.activePageStorageName);
    if (activePage) {
      this.activePageSubject.next(activePage);
    }
    this.timerSubject = new Subject<number>();
    this.timer.subscribe( value => {
      if(this.isActive) {
        this.timerSubject.next(value);
      }
    });
  }

  setFocus() {
    this.isActive = true;
  }

  setBlur() {
    this.isActive = false;
  }

  getTimer() {
    return this.timerSubject;
  }

  setActivePage(activePage: string) {
    localStorage.setItem(this.activePageStorageName, activePage);
    this.activePageSubject.next(activePage);
  }

  getActivePage() {
    return localStorage.getItem(this.activePageStorageName);
  }

  getActivePageSubject() {
    return this.activePageSubject;
  }
}
