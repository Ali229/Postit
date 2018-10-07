import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../_models';
import {AuthenticationService, UserService} from '../_services';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalDirective} from "angular-bootstrap-md";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  // User Table data
  users: User[] = [];
  sortValue: string;
  sortReverse: boolean = false;
  filterValue: string;

  // Edit User data
  @ViewChild('editUserModal') public editUserModal: ModalDirective;
  editUserForm: FormGroup;
  editingUser: User;
  error: string = "";
  userTypes: string[];

  constructor(private authService: AuthenticationService, public userService: UserService, private formBuilder: FormBuilder) {
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
    this.updateForm();
    this.updateUserTypes();
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

  updateForm() {
    this.editUserForm = this.formBuilder.group({
      username: [(this.editingUser == null ? "" : this.editingUser.username)],
      first_name: [(this.editingUser == null ? "" : this.editingUser.first_name)],
      last_name: [(this.editingUser == null ? "" : this.editingUser.last_name)],
      email: [(this.editingUser == null ? "" : this.editingUser.email)],
      user_type: [(this.editingUser == null ? "" : this.editingUser.user_type)]
    });
  }

  form() {
    return this.editUserForm.controls;
  }

  updateUserList() {
    this.userService.updateUserArray();
  }

  submitEdits() {
    if (this.form().username.value != this.editingUser.user_type) {
      this.userService.editUser(this.editingUser.user_id, "username", this.form().username.value).subscribe(response => {
        console.log("The username was successfully updated");
        this.updateUserList();
      }, error => {
        console.log("There was an error while updating the username");
      })
    }
    if (this.form().first_name.value != this.editingUser.first_name) {
      this.userService.editUser(this.editingUser.user_id, "first_name", this.form().first_name.value).subscribe(response => {
        console.log("The first_name was successfully updated");
        this.updateUserList();
      }, error => {
        console.log("There was an error while updating the first_name");
      })
    }
    if (this.form().last_name.value != this.editingUser.last_name) {
      this.userService.editUser(this.editingUser.user_id, "last_name", this.form().last_name.value).subscribe(response => {
        console.log("The last_name was successfully updated");
        this.updateUserList();
      }, error => {
        console.log("There was an error while updating the last_name");
      })
    }
    if (this.form().email.value != this.editingUser.email) {
      this.userService.editUser(this.editingUser.user_id, "email", this.form().email.value).subscribe(response => {
        console.log("The email was successfully updated");
        this.updateUserList();
      }, error => {
        console.log("There was an error while updating the email");
      })
    }
    if (this.form().user_type.value != this.editingUser.username) {
      this.userService.editUser(this.editingUser.user_id, "username", this.form().user_type.value).subscribe(response => {
        console.log("The user_type was successfully updated");
        this.updateUserList();
      }, error => {
        console.log("There was an error while updating the user_type");
      })
    }

    this.editUserModal.hide();
  }

  editUser(user: User) {
    this.updateUserTypes();
    this.editingUser = user;
    this.updateForm();
    this.editUserModal.show();
  }

  updateUserTypes() {
    this.userService.getUserTypes().subscribe(response => {
      this.userTypes = response['user_types'];
    });
  }
}
