import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {first} from 'rxjs/operators';
import {LoginData} from '../_models';
import {Router, ActivatedRoute} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // Don't save passwords

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router) {
  }

  login(username: string, password: string) {
    localStorage.setItem('username', username);
    console.log('Sending request');
    const requestResponse: Observable<any> = this.http.put<any>('http://markzeagler.com/postit-backend/signin', {
      username: username,
      password: password
    });

    requestResponse.pipe(first()).subscribe((response: LoginData) => {
        localStorage.setItem('user_id', response['user_id'].toString());
        localStorage.setItem('auth_token', response['auth_token']);
        localStorage.setItem('passwd_time_remaining', response['passwd_time_remaining'].toString());
        localStorage.setItem('last_login', response['last_login']);
        this.router.navigate(['./home']);
      }
    );

    return requestResponse;
  }

  logout() {
    localStorage.setItem('username', null);
    localStorage.setItem('user_id', null);
    localStorage.setItem('auth_token', null);
    localStorage.setItem('passwd_time_remaining', null);
    localStorage.setItem('last_login', null);
    this.router.navigate(['./login']);
  }

  getAuthToken() {
    return localStorage.getItem('auth_token');
  }

  getUserID() {
    return localStorage.getItem('user_id');
  }

  getUserName() {
    return localStorage.getItem('username');
  }

  getPasswdDaysRemaining() {
    return localStorage.getItem('passwd_time_remaining');
  }

  getLastLogin() {
    return localStorage.getItem('last_login');
  }

  getGETHeaders() {
    return {
      'Cache-Control': 'no-cache',
      'Authorization': "Bearer " + this.getAuthToken()
    }
  }

  getPOSTPUTHeaders() {
    return {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.getAuthToken()
    }
  }

  encryptPassword(password: string) {
    return password; // TODO Actually do something here later. Encode/encrypt it... do something that's lossy
  }

  verifyLoggedIn() {
    console.log('Verifying that user is still logged in');

    const requestResponse: Observable<any> = this.http.get<any>('http://postit.markzeagler.com/postit-backend/verify_logged_in');

    requestResponse.subscribe(response => {
      console.log(response['message']);
    });

    return requestResponse;
  }
}
