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
    'journal': 'Journals',
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

    this.authService.getVerifiedLoggedIn().subscribe((value: boolean) => {
      this.loggedIn = value;
      this.userService.updateUser();
      // Kinda messy like this, update later
      this.authService.getUserName().subscribe(data => {
        this.username = data;
      });
    });

    this.userService.getCurrUser().subscribe((user: User) => {
      this.availablePages = this.authGuard.getAvailablePages(user);
    });
  }

  ngOnInit() {
    if (localStorage.getItem('selected')) {
      this.select(localStorage.getItem('selected'));
    }
  }

  logout() {
    this.authService.logout();
  }

  select(page: string) {
    this.appService.setActivePage(page);
    this.router.navigate(['./' + page]);
  }
}
