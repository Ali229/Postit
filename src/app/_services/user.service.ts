import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {User} from '../_models';
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class UserService {

    private users: User[];
    private usersObservable: Observable<User>;

    constructor(private http: HttpClient, private authService: AuthenticationService) {
        // TODO Initialize usersObservable
    }

    getUsersObservable() {
        return this.usersObservable;
    }

    getAll() { // Should only be callable by admins (and perhaps managers)
        return this.http.get<User[]>('http://markzeagler.com/postit-backend/users');
    }

    register(username: string, first_name: string, last_name: string, email: string, password: string) {
        return this.http.put( 'http://markzeagler.com/postit-backend/register', {
            "username": username,
            "password": password,
            "first_name": first_name,
            "last_name": last_name,
            "email": email
        })
    }


}
