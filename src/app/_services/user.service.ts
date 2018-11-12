import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {User} from '../_models';
import {AuthenticationService} from './authentication.service';
import {Subject} from 'rxjs';
import {AppService} from "./app.service";

@Injectable({providedIn: 'root'})
export class UserService implements OnInit {

  userSubject: Subject<User>;
  userArraySubject: Subject<User[]>;
  isAdmin: boolean = false;

  constructor(private http: HttpClient,
              private authService: AuthenticationService,
              private appService: AppService) {
    this.userSubject = new Subject();
    this.userArraySubject = new Subject();

    this.authService.getUserIDSubject().subscribe(response => {
      this.updateUser();
    });

    this.appService.getTimer().subscribe(() => {
      this.updateUserArray();
      this.updateUser();
    });
  }

  ngOnInit() {
  }

  getCurrUser() {
    this.updateUser();
    return this.userSubject;
  }

  updateUser() {
    if (this.authService.isLoggedIn() && this.authService.getUserID() > 0) {
      this.http.get<User>(`https://markzeagler.com/postit-backend/user/` + this.authService.getUserID().toString(), this.authService.getGETJSONHeaders()).subscribe((response: User) => {
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
    if (this.authService.isLoggedIn() && this.isAdmin) {
      this.http.get<User[]>(`https://markzeagler.com/postit-backend/user/all`, this.authService.getGETJSONHeaders()).subscribe((response: User[]) => {
        this.userArraySubject.next(response['users']);
      });
    }
  }

  getUserTypes() {
    return this.http.get<User[]>(`https://markzeagler.com/postit-backend/user/info`, this.authService.getGETJSONHeaders());
  }

  register(username: string, first_name: string, last_name: string, email: string, password: string) {
    return this.http.post('https://markzeagler.com/postit-backend/register', {
      'username': username,
      'password': password,
      'first_name': first_name,
      'last_name': last_name,
      'email': email
    }, this.authService.getPOSTPUTJSONHeaders());
  }

  addUser(username: string, first_name: string, last_name: string, email: string, password: string, user_type: string) {
    return this.http.post('https://markzeagler.com/postit-backend/user/new', {
      'username': username,
      'password': password,
      'first_name': first_name,
      'last_name': last_name,
      'email': email,
      'user_type': user_type
    }, this.authService.getPOSTPUTJSONHeaders());
  }

  editUser(user_id, category, value) {
    return this.http.put('https://markzeagler.com/postit-backend/user/' + user_id, {
      'category': category,
      'value': value
    }, this.authService.getPOSTPUTJSONHeaders());
  }

  forgotPassword(username: string) {
    return this.http.post('https://markzeagler.com/postit-backend/forgotpassword', {
      'username': username
    }, this.authService.getPOSTPUTJSONHeaders());
  }

  resetPassword(user_id: number, newPassword: string) {
    return this.http.put('https://markzeagler.com/postit-backend/user/' + user_id, {
      'category': 'password',
      'value': newPassword
    }, this.authService.getPOSTPUTJSONHeaders());
  }
}
