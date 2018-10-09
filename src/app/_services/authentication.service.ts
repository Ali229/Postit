import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {first} from 'rxjs/operators';
import {LoginData} from '../_models';
import {Router, ActivatedRoute} from '@angular/router';
import {AppService} from "./app.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit {

  // Don't save passwords
  private loggedInSubject: Subject<boolean>;
  private usernameSubject: Subject<string>;
  private userIdSubject: Subject<string>;
  private authTokenSubject: Subject<string>;
  private passwdTimeRemainingSubject: Subject<string>;
  private lastLoginSubject: Subject<string>;

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              private appService: AppService) {
    this.loggedInSubject = new Subject();
    this.usernameSubject = new Subject();
    this.userIdSubject = new Subject();
    this.authTokenSubject = new Subject();
    this.passwdTimeRemainingSubject = new Subject();
    this.lastLoginSubject = new Subject();
    let user_id = localStorage.getItem('user_id');
    if (user_id) {
      this.userIdSubject.next(user_id);
    }

    this.appService.getTimer().subscribe(() => {
      this.updateLoggedInVerification();
    });
  }

  ngOnInit() {
    this.updateLoggedInVerification();
  }

  login(username: string, password: string) {
    localStorage.setItem('username', username);
    this.usernameSubject.next(username);

    const requestResponse: Observable<any> = this.http.put<any>('http://markzeagler.com/postit-backend/signin', {
      username: username,
      password: this.encryptPassword(password)
    });

    const loginResponseSubject = new Subject();

    requestResponse.pipe(first()).subscribe((response: LoginData) => {
        localStorage.setItem('user_id', response['user_id'].toString());
        localStorage.setItem('auth_token', response['auth_token']);
        localStorage.setItem('passwd_time_remaining', response['passwd_time_remaining'].toString());
        localStorage.setItem('last_login', response['last_login']);
        this.usernameSubject.next(username);
        this.userIdSubject.next(response['user_id'].toString());
        this.authTokenSubject.next(response['auth_token']);
        this.passwdTimeRemainingSubject.next(['passwd_time_remaining'].toString());
        this.lastLoginSubject.next(response['last_login']);
        this.loggedInSubject.next(true);
        loginResponseSubject.next([true, ""]);
      }, error => {
        this.loggedInSubject.next(false);
        loginResponseSubject.next([false, error.error.message]);
      }
    );

    return loginResponseSubject;
  }

  logout() {
    localStorage.setItem('username', null);
    localStorage.setItem('user_id', null);
    localStorage.setItem('auth_token', null);
    localStorage.setItem('passwd_time_remaining', null);
    localStorage.setItem('last_login', null);
    this.loggedInSubject.next(false);
    this.usernameSubject.next("");
    this.userIdSubject.next("");
    this.authTokenSubject.next("");
    this.passwdTimeRemainingSubject.next("");
    this.lastLoginSubject.next("");
    this.router.navigate(['./login']);
  }

  getAuthToken() {
    this.authTokenSubject.next(localStorage.getItem('auth_token'));
    return this.authTokenSubject;
  }

  getUserID() {
    this.userIdSubject.next(localStorage.getItem('user_id'));
    return this.userIdSubject;
  }

  getUserName() {
    this.usernameSubject.next(localStorage.getItem('username'));
    return this.usernameSubject;
  }

  getPasswdDaysRemaining() {
    this.passwdTimeRemainingSubject.next(localStorage.getItem('passwd_time_remaining'));
    return this.passwdTimeRemainingSubject;
  }

  getLastLogin() {
    this.lastLoginSubject.next(localStorage.getItem('last_login'));
    return this.lastLoginSubject;
  }

  getGETHeaders() {
    return {
      'Cache-Control': 'no-cache',
      'Authorization': "Bearer " + localStorage.getItem('auth_token')
    }
  }

  getPOSTPUTHeaders() {
    return {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem('auth_token')
    }
  }

  encryptPassword(password: string) {
    return password; // TODO Actually do something here later. Encode/encrypt it... do something that's lossy
  }

  updateLoggedInVerification() {
    this.http.get<any>('http://postit.markzeagler.com/postit-backend/verify_logged_in').subscribe(response => {
      this.loggedInSubject.next(response);
    });
  }

  getVerifiedLoggedIn() {
    return this.loggedInSubject;
  }
}
