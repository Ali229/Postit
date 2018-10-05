import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { AccountsComponent} from './account/accounts.component';

const appRoutes: Routes = [
    // { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    // { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'accounts', component: AccountsComponent },

    // otherwise redirect to home
     { path: '**', redirectTo: 'login' }
];

export const routing = RouterModule.forRoot(appRoutes);
