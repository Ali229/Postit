import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {AccountsComponent} from './accounts/accounts.component';
import {UsersComponent} from './users/users.component';
import {NgModule} from "@angular/core";
import {AccountComponent} from "./account/account.component";

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'accounts', component: AccountsComponent},
  {path: 'users', component: UsersComponent},
  {path: 'accounts/account/:account_id', component: AccountComponent},

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
