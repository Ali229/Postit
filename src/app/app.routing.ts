import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {AccountsComponent} from './account/accounts.component';
import {UsersComponent} from './users/users.component';

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'accounts', component: AccountsComponent},
  {path: 'users', component: UsersComponent},

  // otherwise redirect to home
  {path: '**', redirectTo: 'login'}
];

export const routing = RouterModule.forRoot(appRoutes);
