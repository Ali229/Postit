import {Component, OnInit} from '@angular/core';
import {AuthenticationService, UserService} from '../_services';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public active: string = 'Home';
  public availablePages: string[];
  private adminPages: string[] = ['Home', 'Users', 'Accounts'];
  private managerPages: string[] = ['Home', 'Users', 'Accounts'];
  private userPages: string[] = ['Home', 'Accounts'];
  public username: string;
  public loggedIn: boolean = false;
  public loggedInSubscription: Subscription;

  constructor(private authService: AuthenticationService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {
    this.availablePages = this.userPages;
    this.loggedInSubscription = this.authService.getVerifiedLoggedIn().subscribe((value: boolean) => {
      this.loggedIn = value;
      this.userService.updateUser();
    });

    this.userService.getCurrUser().subscribe(response => {
      let user_type = response['user_type'];
      if (user_type == 'admin') {
        this.availablePages = this.adminPages;
      } else if (user_type == 'manager') {
        this.availablePages = this.managerPages;
      } else if (user_type == 'user') {
        this.availablePages = this.userPages;
      }
    })

  }

  ngOnInit() {
    this.authService.getUserName().subscribe(data => {
      this.username = data;
    });
    this.active = localStorage.getItem('active_page');
  }

  logout() {
    this.authService.logout();
    this.loggedIn = false;
  }

  select(page: string) {
    localStorage.setItem('active_page', page);
    this.active = page;
    this.router.navigate(['./' + page.toLowerCase()]);
    this.loggedIn = true;
  }
}
