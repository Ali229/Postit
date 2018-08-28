import React from 'react';
import ReactDOM from 'react-dom';

import {Switch, Route} from 'react-router-dom';
import {firebaseApp} from './firebase'
import HashRouter from "react-router-dom/es/HashRouter"
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
firebaseApp.auth().onAuthStateChanged(user => {
  if (user) {
    console.log('User has signed in or up', user);
  } else {
    console.log('user has signed out');
  }
});

ReactDOM.render(<HashRouter basename={"/ledger"}>
  <Switch>
    <Route exact="exact" path="/" component={SignIn}/>
    <Route path="/signup" component={SignUp}/>
  </Switch>
</HashRouter>, document.getElementById('root'))