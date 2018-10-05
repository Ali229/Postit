import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../_models';
import {AuthenticationService, UserService} from '../_services';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    users: User[] = [];
    private user_id: number;

    // constructor(private userService: UserService, private authService: AuthenticationService) {}
    //
    // ngOnInit() {
    //     this.user_id = this.authService.getUserID();
    //     this.userService.getAll().pipe(first()).subscribe(users => {
    //         this.users = users;
    //     });
    // }
    constructor(private authService: AuthenticationService, private userService: UserService) {
        // userService.getUsersObservable().subscribe( () => {
        //
        // })
      console.log('Auth Token: ' + authService.getAuthToken());
      console.log('User ID: ' + authService.getUserID());
    }

    ngOnInit() {
      // this.authService.verifyLoggedIn(); // This should automatically route if it fails
    }
}
