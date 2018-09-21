import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class SignIn extends Component {

  constructor() {
    super();
    this.login = this.login.bind(this);
  }

  login() {
    const userObject = {
      username: document.getElementById('inputUsername').value || null,
      password: document.getElementById('inputPassword').value || null
    };
    this.connect('http://markzeagler.com/ledger-backend/signin', userObject);
  }

  async connect(url, userObject) {
    try {
      let response = await fetch((url), {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userObject)
      });
      if (!response.ok) {
        console.log('00', response);
        console.log('0', JSON.stringify(response));
        throw Error('Login error!');
      }
      let resJSON = await response.json();
      console.log('1', resJSON.headers);
      console.log('2', resJSON.status);
      console.log('3', resJSON.statusText);
      console.log('4', resJSON.body);
      console.log('5', resJSON.message);
      console.log('6', JSON.stringify(resJSON.message));
      console.info('7', JSON.stringify(resJSON));
      console.info('7', JSON.stringify(resJSON.message.auth_token));
      window.location = "/ledger/home";
    } catch (e) {
      console.error(e);
      document.getElementById("errorDiv").style.display = 'block';
      document.getElementById("errorDiv").innerHTML = "Invalid login details!";
    }
  }

  render() {
    document.body.classList.add('gradient');
    return (<div className="main-border">
      <form className="form-signin">
        <img className="i1" src="signin_logo.png" alt="logo"/>
        <h1>LOGIN</h1>
        <input type="email" id="inputUsername" className="form-control" placeholder="Username" required=""/>
        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required=""/>
        <div id="errorDiv"></div>
        <button className="sb btn btn-lg btn-primary btn-block" type="button" onClick={this.login}>LOGIN</button>
        <p className="links" align="left" margin-top="10px">&#x25C8;&nbsp;
          <Link to="/forgot">Forgot password?</Link><br/>
          &#x25C8;&nbsp;
          <Link to="/signup">Create account</Link>
        </p>
        <p className="mt-5 mb-3 text-muted" align="left">© 2018</p>
      </form>
    </div>)
  }
}

export default SignIn;
