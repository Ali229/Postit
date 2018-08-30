import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPass from './components/ForgotPass';

ReactDOM.render((<BrowserRouter basename={"/ledger"}>
  <Switch>
    <Route exact={true} path="/" component={SignIn}/>
    <Route path="/signup" component={SignUp}/>
    <Route path="/forgot" component={ForgotPass}/>
  </Switch>
</BrowserRouter>), document.getElementById('root'));
