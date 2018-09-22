import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.connect = this.connect.bind(this);
    this.state = {
      userName: null,
      password: null
    }
    this.UserNameChange = this.UserNameChange.bind(this);
    this.PasswordChange = this.PasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  UserNameChange(event) {
    this.setState({userName: event.target.value});
  }
  PasswordChange(event) {
    this.setState({password: event.target.value});
  }
  handleSubmit(event) {
    this.connect(event);
    event.preventDefault();
  }

  async connect(event) {
    try {
      const userObject = {
        username: this.state.userName,
        password: this.state.password
      };
      if (!userObject.username || !userObject.password) {
        throw Error('The username/password is empty.');
      }
      let response = await fetch(('http://markzeagler.com/ledger-backend/signin'), {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userObject)
      });
      let resJSON = await response.json();
      if (!response.ok) {
        throw Error(resJSON.message);
      }
      console.info(resJSON.message);
      console.info(resJSON.message.auth_token);
      window.location = "/ledger/home";
    } catch (e) {
      document.getElementById("errorDiv").style.display = 'block';
      document.getElementById("errorDiv").innerHTML = e;
    }
  }

  render() {
    document.body.classList.add('gradient');
    return (<div className="main-border">
      <form className="form-signin" onSubmit={this.handleSubmit} novalidate="novalidate">
        <img className="i1" src="signin_logo.png" alt="logo"/>
        <h1>LOGIN</h1>
        <input type="email" id="inputUsername" className="form-control" placeholder="Username" onChange={this.UserNameChange}/>
        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" onChange={this.PasswordChange}/>
        <div id="errorDiv"></div>
        <button className="sb btn btn-lg btn-primary btn-block" type="submit" onClick={this.connect}>LOGIN</button>
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
