import React from 'react';
import {Link} from 'react-router-dom';
import NavB from './NavB'
////import SignIn from './SignIn';

class Home extends React.Component {
  render() {
    console.log('Authen: ', localStorage.getItem('auth'));
    console.log('UserName: ', localStorage.getItem('currentUser'));
    //var token = getToken();
    // console.log(this.props.state.userName);
    // console.log(this.props.userName);
    document.body.classList.remove('gradient');
    return (<div>
      <NavB/>
      <h1>HOME</h1>
      <Link to="/journalize">Journalize</Link><br/>
      <Link to="/charts">Charts of Accounts</Link><br/>
    </div>)
  }
}

export default Home;
