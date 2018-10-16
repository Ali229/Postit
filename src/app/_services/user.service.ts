import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {User} from '../_models';
import {AuthenticationService} from './authentication.service';
import {Subject} from 'rxjs';
import {AppService} from "./app.service";

@Injectable({providedIn: 'root'})
export class UserService {

  userSubject: Subject<User>;
  userArraySubject: Subject<User[]>;
  loggedIn: boolean = false;
  userID: string = "";
  isAdmin: boolean = false;
  currUser: User;

  constructor(private http: HttpClient,
              private authService: AuthenticationService,
              private appService: AppService) {
    this.userSubject = new Subject();
    this.userArraySubject = new Subject();

    this.authService.getVerifiedLoggedIn().subscribe(response => {
      this.loggedIn = response;
    });
    this.authService.getUserID().subscribe(response => {
      this.userID = response;
      this.updateUser();
    });

    const user_id = localStorage.getItem('user_id');
    if (user_id) {
      console.log("Setting user_id manually in message.service... Clean this up!");
      this.userID = user_id;
      this.updateUser();
    }

    this.appService.getTimer().subscribe(() => {
      this.updateUserArray();
      this.updateUser();
    });
  }

  getCurrUser() {
    this.updateUser();
    return this.userSubject;
  }

  updateUser() {
    if (this.loggedIn && this.userID != "") {
      this.http.get<User>(`http://markzeagler.com/postit-backend/user/` + this.userID,
        this.authService.getGETHeaders()).subscribe((response: User) => {
        this.userSubject.next(response);
        this.isAdmin = response['user_type']== 'admin';
      });
    }
  }

  getUserArray() { // Should only be callable by admins (and perhaps managers)
    this.updateUser();
    return this.userArraySubject;
  }

  updateUserArray() {
    if (this.loggedIn && this.isAdmin) {
      this.http.get<User[]>(`http://markzeagler.com/postit-backend/user/all`,
        this.authService.getGETHeaders()).subscribe((response: User[]) => {
        this.userArraySubject.next(response['users']);
      });
    }
  }

  getUserTypes() {
    return this.http.get<User[]>(`http://markzeagler.com/postit-backend/user/info`);
  }

  register(username: string, first_name: string, last_name: string, email: string, password: string) {
    return this.http.post('http://markzeagler.com/postit-backend/register', {
      'username': username,
      'password': password,
      'first_name': first_name,
      'last_name': last_name,
      'email': email
    });
  }

  addUser(username: string, first_name: string, last_name: string, email: string, password: string, user_type: string) {
    let body = {
      'username': username,
      'password': password,
      'first_name': first_name,
      'last_name': last_name,
      'email': email,
      'user_type': user_type
    };
    return this.http.post('http://markzeagler.com/postit-backend/user/new', body,
      this.authService.getPOSTPUTHeaders(body));
  }

  editUser(user_id, category, value) {
    let body = {
      'category': category,
      'value': value
    };
    return this.http.put('http://markzeagler.com/postit-backend/user/' + user_id, body,
      this.authService.getPOSTPUTHeaders(body));
  }

  forgotPassword(username: string) {
    return this.http.post('http://markzeagler.com/postit-backend/forgotpassword', {
      'username': username
    });
  }

  resetPassword(user_id: number, newPassword: string) {
    let body = {
      'category': 'password',
      'value': newPassword
    };
    return this.http.put('http://markzeagler.com/postit-backend/user/' + user_id, body,
      this.authService.getPOSTPUTHeaders(body));
  }
}
