import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import {AuthenticationService, UserService} from '../_services';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    users: User[] = [];
    private user_id: number;

    constructor(private userService: UserService, private authService: AuthenticationService) {}

    ngOnInit() {
        this.user_id = this.authService.getUserID();
        this.userService.getAll().pipe(first()).subscribe(users => { 
            this.users = users; 
        });
    }
}