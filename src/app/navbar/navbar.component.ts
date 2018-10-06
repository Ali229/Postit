import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../_services";
import {HttpClient} from "../../../node_modules/@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public active: string = "Home";
  public username: string;

  constructor(private authService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router) {
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
