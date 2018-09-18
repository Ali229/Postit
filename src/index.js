import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPass from './components/ForgotPass';

ReactDOM.render((<BrowserRouter basename="/ledger">
  <Switch>
    <Route path='/home' component={Home}/>
    <Route path='/signup' component={SignUp}/>
    <Route path='/forgot' component={ForgotPass}/>
    <Route path='/signin' component={SignIn}/>
    <Route path='/' component={SignIn}/>

  </Switch>
</BrowserRouter>), document.getElementById('root'));
