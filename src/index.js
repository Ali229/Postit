import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPass from './components/ForgotPass';

ReactDOM.render((<BrowserRouter>
  <Switch>
    <Route path="/signup" component={SignUp}/>
    <Route path="/forgot" component={ForgotPass}/>
    <Route path="/" component={SignIn}/>
  </Switch>
</BrowserRouter>), document.getElementById('root'));
