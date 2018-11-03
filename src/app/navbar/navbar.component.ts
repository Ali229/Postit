import {Component, OnInit} from '@angular/core';
import {AuthenticationService, UserService, AppService} from '../_services';
import {ActivatedRoute, Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {AuthGuard} from "../_guards";
import {User} from "../_models";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public active: string = 'Home';
  public availablePages: string[];
  public username: string;
  public loggedIn: boolean = false;

  readonly PAGE_DICTIONARY = {
    'home': 'Home',
    'users': 'Users',
    'accounts': 'COA',
    'event-log': 'Event Log',
    'journals': 'Journals',
    'trial-balance': 'Trial Balance'
  };

  constructor(private authService: AuthenticationService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private app: AppComponent,
              private appService: AppService,
              private authGuard: AuthGuard) {
    this.appService.activePageSubject.subscribe(activePage => {
      this.active = this.PAGE_DICTIONARY[activePage];
    });

    this.authService.getLoggedInSubject().subscribe((value: boolean) => {
      this.loggedIn = value;
      this.userService.updateUser();
    });

    this.authService.getUserNameSubject().subscribe( username => {
      this.username = username;
    });

    this.userService.getCurrUser().subscribe((user: User) => {
      this.availablePages = this.authGuard.getAvailablePages(user);
      this.username = user.username;
    });
  }

  ngOnInit() {
    if (localStorage.getItem('selected')) {
      this.select(localStorage.getItem('selected'));
    }

    if(this.authService.isLoggedIn()) {
      this.userService.updateUser();
    }
  }

  logout() {
    this.authService.logout();
  }

  select(page: string) {
    localStorage.setItem('selected', page);
    this.appService.setActivePage(page);
    this.router.navigate(['./' + page]);
  }
}
