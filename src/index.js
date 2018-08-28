import React from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route} from 'react-router-dom';
import HashRouter from "react-router-dom/es/HashRouter"
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

ReactDOM.render(<HashRouter basename={"/ledger"}>
  <Switch>
    <Route exact="exact" path="/" component={SignIn}/>
    <Route path="/signup" component={SignUp}/>
  </Switch>
</HashRouter>, document.getElementById('root'))