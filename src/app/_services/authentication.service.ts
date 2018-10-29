import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {first} from 'rxjs/operators';
import {LoginData} from '../_models';
import {Router, ActivatedRoute} from '@angular/router';
import {AppService} from "./app.service";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit {

  private readonly loggedInSubject: Subject<boolean>;
  private readonly usernameSubject: Subject<string>;
  private readonly userIdSubject: Subject<string>;
  private readonly authTokenSubject: Subject<string>;
  private readonly passwdTimeRemainingSubject: Subject<string>;
  private readonly lastLoginSubject: Subject<string>;
  private loggedIn: boolean = false;
  private userType: string = "";

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              private appService: AppService) {
    // Try to load locally stored data
    let user_id = localStorage.getItem('user_id');
    this.loggedIn = !!user_id;
    let username = localStorage.getItem('username');
    let authToken = localStorage.getItem('auth_token');
    let passwdTimeRemaining = localStorage.getItem('passwd_time_remaining');
    let lastLogin = localStorage.getItem('last_login');
    this.userType = localStorage.getItem('user_type');

    // Create subjects
    this.loggedInSubject = new Subject();
    this.usernameSubject = new Subject();
    this.userIdSubject = new Subject();
    this.authTokenSubject = new Subject();
    this.passwdTimeRemainingSubject = new Subject();
    this.lastLoginSubject = new Subject();

    // Pass data to subjects as appropriate
    if (user_id) {
      this.userIdSubject.next(user_id);
    }
    this.loggedInSubject.next(this.loggedIn);
    if (username) {
      this.usernameSubject.next(username);
    }
    if (authToken) {
      this.authTokenSubject.next(authToken);
    }
    if (passwdTimeRemaining) {
      this.passwdTimeRemainingSubject.next(passwdTimeRemaining);
    }
    if (lastLogin) {
      this.lastLoginSubject.next(lastLogin);
    }

    // Subscribe to the data refresh timer
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

    const requestResponse: Observable<any> = this.http.put<any>('https://markzeagler.com/postit-backend/signin', {
      username: username,
      password: this.encryptPassword(password)
    });

    const loginResponseSubject = new Subject();

    requestResponse.pipe(first()).subscribe((response: LoginData) => {
        // Set internally stored data
        this.loggedIn = true;
        this.userType = response['user_type'];

        // Set local storage data
        localStorage.setItem('user_id', response['user_id'].toString());
        localStorage.setItem('auth_token', response['auth_token']);
        localStorage.setItem('passwd_time_remaining', response['passwd_time_remaining'].toString());
        localStorage.setItem('last_login', response['last_login']);
        localStorage.setItem('user_type', response['user_type']);

        // Pass information to subjects
        this.usernameSubject.next(username);
        this.userIdSubject.next(response['user_id'].toString());
        this.authTokenSubject.next(response['auth_token']);
        this.passwdTimeRemainingSubject.next(['passwd_time_remaining'].toString());
        this.lastLoginSubject.next(response['last_login']);
        this.loggedInSubject.next(true);

        // Pass information to the login subject
        loginResponseSubject.next([true, ""]);
      }, error => {
        this.loggedInSubject.next(false);
        loginResponseSubject.next([false, error.error.message]);
      }
    );

    return loginResponseSubject;
  }

  logout() {
    // Clear local storage
    localStorage.setItem('username', null);
    localStorage.setItem('user_id', null);
    localStorage.setItem('auth_token', null);
    localStorage.setItem('passwd_time_remaining', null);
    localStorage.setItem('last_login', null);
    localStorage.setItem('user_type', null);

    // Pass information to subjects
    this.loggedInSubject.next(false);
    this.usernameSubject.next("");
    this.userIdSubject.next("");
    this.authTokenSubject.next("");
    this.passwdTimeRemainingSubject.next("");
    this.lastLoginSubject.next("");

    // Navigate to the login screen
    this.router.navigate(['./login']);
  }

  getAuthToken() {
    return localStorage.getItem('auth_token');
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

  getGETJSONHeaders() {
    return {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
        'Access-Control-Allow-Origin': '*',
        'Accept': '*/*'
      })
    };
  }

  getGETBlobHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
        'Access-Control-Allow-Origin': '*',
        'responseType': 'blob',
        'Accept': '*/*'
      })
    };
  }

  getPOSTPUTJSONHeaders() {
    return {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
        'Access-Control-Allow-Origin': '*'
      })
    };
  }

  getPOSTPUTFileHeaders() {
    return {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        // 'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
        'Access-Control-Allow-Origin': '*'
      })
    };
  }

  encryptPassword(password: string) {
    return password; // TODO Actually do something here later. Encode/encrypt it... do something that's lossy
  }

  updateLoggedInVerification() {
    this.http.get<any>('https://postit.markzeagler.com/postit-backend/verify_logged_in', this.getGETJSONHeaders()).subscribe(response => {
      this.loggedIn = response;
      this.loggedInSubject.next(response);
    });
  }

  getVerifiedLoggedIn() {
    return this.loggedInSubject;
  }

  getLoggedIn() {
    return this.loggedIn;
  }

  getUserType() {
    return this.userType;
  }
}
