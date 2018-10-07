import {Component, OnInit} from '@angular/core';
import {User} from '../_models';
import {AuthenticationService, UserService} from '../_services';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  sortValue: string;
  sortReverse: boolean = false;
  filterValue: string;

  constructor(private authService: AuthenticationService, public userService: UserService) {
    this.userService.getUserArray().subscribe(response => {
      this.users = response;
      this.users.sort((a, b) => {
        if (!this.sortReverse) {
          return ('' + a[this.sortValue]).localeCompare(b[this.sortValue]);
        } else {
          return ('' + b[this.sortValue]).localeCompare(a[this.sortValue]);
        }
      });
    });
  }

  ngOnInit() {
    this.authService.updateLoggedInVerification(); // This should automatically route if it fails
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
  }

  filterBy() {
    if (!this.filterValue) {
      return this.users;
    } else {
      console.log("Sort Value: \"" + this.filterValue + "\"");
      let returnList: User[] = [];
      this.users.forEach(user => {
        if (user.user_type.includes(this.filterValue)) {
          returnList.push(user);
        } else if (user.username.includes(this.filterValue)) {
          returnList.push(user);
        } else if (user.first_name.includes(this.filterValue)) {
          returnList.push(user);
        } else if (user.last_name.includes(this.filterValue)) {
          returnList.push(user);
        } else if (user.email.includes(this.filterValue)) {
          returnList.push(user);
        } else if (user.last_login.includes(this.filterValue)) {
          returnList.push(user);
        } else if (user.password_expiration_date.includes(this.filterValue)) {
          returnList.push(user);
        }
      });
      return returnList;
    }
  }

  updateUserList() {
    this.userService.updateUserArray();
  }

  editUser(user: User) {
    // TODO Sort items
  }
}
