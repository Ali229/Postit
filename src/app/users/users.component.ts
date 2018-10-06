import { Component, OnInit } from '@angular/core';
import {User} from '../_models';
import {AuthenticationService, UserService, AccountService} from '../_services';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  sortValue: string;
  sortReverse: boolean = false;

  constructor(private authService: AuthenticationService, private userService: UserService) {
    // userService.getUsersObservable().subscribe( () => {
    //
    // })
  }

  ngOnInit() {
    this.authService.verifyLoggedIn(); // This should automatically route if it fails
    this.sortBy('user_id');
    this.updateUserList();
  }

  sortBy(value: string) {
    if (this.sortValue === value) {
      this.sortReverse = !this.sortReverse;
    } else {
      this.sortReverse = false;
    }
    this.sortValue = value;
    this.updateUserList();
    console.log('Sorting by: ' + value + (this.sortReverse ? ' regular' : ' reversed'));
  }

  filterBy(value: string) {

  }

  updateUserList() {
    this.userService.getAll().subscribe(response => {
      this.users = response.users;
      this.users.sort((a, b) => {
        if (!this.sortReverse) {
          return ('' + a[this.sortValue]).localeCompare(b[this.sortValue]);
        } else {
          return ('' + b[this.sortValue]).localeCompare(a[this.sortValue]);
        }
      });
    });
  }

  updateUser(user: User) {
    // TODO Sort items
  }
}
