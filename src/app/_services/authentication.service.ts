import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";

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
        const requestResponse: Observable<any> = this.http.put<any>('http://markzeagler.com/ledger-backend/signin', {
            username: username,
            password: password
        });

        requestResponse.subscribe((response: LoginData) => {
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
        sessionStorage.removeItem('currentUser')
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
}

export interface LoginData {
    auth_token: string;
    user_id: number;
    passwd_time_remaining: number;
    last_login: string;
}
