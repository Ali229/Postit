import {Component, OnInit} from '@angular/core';
import {AuthenticationService, UserService} from '../_services';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

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

  constructor(private authService: AuthenticationService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {
    this.availablePages = this.userPages;

    this.userService.getCurrUser().subscribe(response => {
      let user_type = response['user_type'];
      console.log("User Type: " + user_type);
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
    this.username = this.authService.getUserName();
    this.active = localStorage.getItem('active_page');
  }

  logout() {
    this.authService.logout();
  }

  select(page: string) {
    localStorage.setItem('active_page', page);
    this.router.navigate(['./' + page.toLowerCase()]);
  }
}
