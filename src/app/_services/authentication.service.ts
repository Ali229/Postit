import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {first} from "rxjs/operators";
import {LoginData} from "../_models";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private auth_token: string;
    private user_id: number;
    private passwd_time_remaining: number;
    private last_login: string;
    private username: string;

    // Don't save passwords

    constructor(private http: HttpClient) {
    }

    login(username: string, password: string) {
        this.username = username;
        console.log("Sending request");
        const requestResponse: Observable<any> = this.http.put<any>('http://markzeagler.com/postit-backend/signin', {
            username: username,
            password: password
        });

        requestResponse.pipe(first()).subscribe((response: LoginData) => {
                if (response['status_code'] == 200) {
                    this.user_id = response['user_id'];
                    this.auth_token = response['auth_token'];
                    this.passwd_time_remaining = response['passwd_time_remaining'];
                    this.last_login = response['last_login'];
                }
            }
        );

        return requestResponse;
    }

    logout() {
        this.last_login = null;
        this.passwd_time_remaining = null;
        this.auth_token = null;
        this.user_id = null;
    }

    getAuthToken() {
        return this.auth_token;
    }

    getUserID() {
        return this.user_id;
    }

    getUserName() {
        return this.username;
    }

    getPasswdDaysRemaining() {
        return this.passwd_time_remaining;
    }

    getLastLogin() {
        return this.last_login;
    }

    getHeaders() {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.auth_token
        })
    }

    encryptPassword(password: string) {
        return password; // TODO Actually do something here later. Encode/encrypt it... do something that's lossy
    }
}
