import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing';
import {ErrorInterceptor} from './_helpers';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {AuthenticationService, UserService, AccountService, AppService} from './_services';
import {NavbarComponent} from './navbar/navbar.component';
import {AccountsComponent} from './accounts/accounts.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {User, Account, Transaction} from './_models';
import {CommonModule} from '@angular/common';
import {UsersComponent} from './users/users.component';
import {AccountComponent} from './account/account.component';
import {JournalsComponent} from './journals/journals.component';
import {EventLogComponent} from './event-log/event-log.component';
import {MatDatepickerModule, MatFormFieldModule, MatTableModule} from "@angular/material";
import {TrialBalanceComponent} from './trial-balance/trial-balance.component';
import {JournalComponent} from './journal/journal.component'
import {IncomeStatementComponent} from "./income-statement/income-statement.component";

@NgModule({
  imports: [
    FormsModule,
    MDBBootstrapModule.forRoot(),
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatTableModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    AccountsComponent,
    UsersComponent,
    AccountComponent,
    JournalsComponent,
    EventLogComponent,
    TrialBalanceComponent,
    JournalComponent,
    IncomeStatementComponent],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

    AuthenticationService,
    AppService,
    UserService,
    AccountService,
    User,
    Account,
    Transaction
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
