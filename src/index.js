import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {Switch} from 'react-router-dom';
import {firebaseApp} from './firebase'
import HashRouter from "react-router-dom/es/HashRouter"
firebaseApp.auth().onAuthStateChanged(user => {
  if (user) {
    console.log('User has signed in or up', user);
  } else {
    console.log('user has signed out');
  }
});

ReactDOM.render(<HashRouter basename={"/ledger"}>
  <Switch>
    <App/>
  </Switch>
</HashRouter>, document.getElementById('root'))