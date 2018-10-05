import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import {AppComponent} from './app.component';
import {routing} from './app.routing';
import {BasicAuthInterceptor, ErrorInterceptor} from './_helpers';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {AuthenticationService, UserService} from './_services';
import {NavbarComponent} from './navbar/navbar.component';
import {AccountComponent} from './account/account.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {LoginData, User} from "./_models";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [
    FormsModule,
    MDBBootstrapModule.forRoot(),
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    AccountComponent],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

    AuthenticationService,
    UserService,
    User
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
