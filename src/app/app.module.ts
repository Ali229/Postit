import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing';
import {BasicAuthInterceptor, ErrorInterceptor} from './_helpers';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {AuthenticationService, UserService, AccountService} from './_services';
import {NavbarComponent} from './navbar/navbar.component';
import {AccountsComponent} from './account/accounts.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {LoginData, User, Account} from './_models';
import {CommonModule} from '@angular/common';
import {UsersComponent} from './users/users.component';

@NgModule({
  imports: [
    FormsModule,
    MDBBootstrapModule.forRoot(),
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    AccountsComponent,
    UsersComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

    AuthenticationService,
    UserService,
    AccountService,
    User,
    Account
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
