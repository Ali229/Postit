import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
class App extends Component {
  render() {
    return (<div>
      <Switch>
        <Route exact="exact" path="/" component={SignIn}/>
        <Route path="/signup" component={SignUp}/></Switch>
    </div>)
  }
}

export default App;
