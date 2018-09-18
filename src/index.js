import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Route, Switch, Redirect
} from 'react-router-dom'
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPass from './components/ForgotPass';
//
//    <Route path='/*' component={SignIn}/>
ReactDOM.render((<BrowserRouter basename="/ledger">
  <Switch>
    <Route path='/home' component={Home}/>
    <Route path='/signup' component={SignUp}/>
    <Route path='/forgot' component={ForgotPass}/>
    <Route path='/signin' component={SignIn}/>
    <Route path='/' component={SignIn}/>
    <Redirect from='/' to='/signin'/>
  </Switch>
</BrowserRouter>), document.getElementById('root'));
