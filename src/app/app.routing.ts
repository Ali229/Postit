import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { AuthGuard } from './_guards';
import { AccountComponent} from "./account/account.component";

const appRoutes: Routes = [
    // { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    // { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'account', component: AccountComponent },

    // otherwise redirect to home
     { path: '**', redirectTo: 'login' }
];

export const routing = RouterModule.forRoot(appRoutes);