import {Component, OnInit} from '@angular/core';
// import { first } from 'rxjs/operators';
import {User} from '../_models';
import {AuthenticationService, UserService, /*UserService*/} from '../_services';

@Component({
  selector: 'table-sort',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
  users: User[] = [];

  constructor(private authService: AuthenticationService, private userService: UserService) {
    // userService.getUsersObservable().subscribe( () => {
    //
    // })
  }

  ngOnInit() {
    this.authService.verifyLoggedIn(); // This should automatically route if it fails
    this.userService.getAll().subscribe(response => {
      this.users = response.users;
    })
  }

  sortBy(value: string) {
    // TODO Sort items
  }

  updateUser(user: User) {
    // TODO Sort items
  }
}
