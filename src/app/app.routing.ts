import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {AccountsComponent} from './accounts/accounts.component';
import {UsersComponent} from './users/users.component';
import {NgModule} from "@angular/core";
import {AccountComponent} from "./account/account.component";
import {AuthGuard} from "./_guards";

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard]},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'account/:account_id', component: AccountComponent, canActivate: [AuthGuard]},

  // otherwise redirect to home
  {path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
