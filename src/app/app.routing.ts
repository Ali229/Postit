import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {AccountsComponent} from './accounts/accounts.component';
import {UsersComponent} from './users/users.component';
import {NgModule} from "@angular/core";
import {AccountComponent} from "./account/account.component";
import {JournalsComponent} from "./journals/journals.component";
import {EventLogComponent} from "./event-log/event-log.component";
import {AuthGuard} from "./_guards";
import {AuthenticationService} from "./_services";
import {TrialBalanceComponent} from "./trial-balance/trial-balance.component";

let loggedIn: boolean = false;

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard]},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'account/:account_id', component: AccountComponent, canActivate: [AuthGuard]},
  {path: 'journals', component: JournalsComponent, canActivate: [AuthGuard]},
  {path: 'event-log', component: EventLogComponent, canActivate: [AuthGuard]},
  {path: 'trial-balance', component: TrialBalanceComponent, canActivate: [AuthGuard]},
  // otherwise redirect to home if logged in or login if not
  {path: '**', redirectTo: loggedIn ? '/home' : '/login'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private authService: AuthenticationService) {
    this.authService.getLoggedInSubject().subscribe(isLoggedIn => {
      loggedIn = isLoggedIn;
    });
  }
}


