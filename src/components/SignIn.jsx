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
      password: document.getElementById('inputPassword').value || null,
    };
    if (!userObject.username || !userObject.password) {
      return console.log('Incorrect username and password');
    }

    this.putData('http://markzeagler.com/ledger-backend/signin', userObject)
      .then((res) => {
        const result = JSON.stringify(res);

        // if result.message blalala

        console.log('Result', result);
      })
      .catch((err) => {
        console.log('Error: ', err);
      })
  }

  putData(url, data) {
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response || !response.status === 200) {
        return Promise.reject('Error: ', response.status);
      }
      return response.json();
    })
    .catch(err => {
      console.log('err here: ', err);
      return Promise.reject(err);
    })
  }

  state = { showError: true }

   toggleError = () => {
     this.setState((prevState, props) => {
       return { showError: !prevState.showError }
     })
   };

  render() {
    document.body.classList.add('gradient');
    return (
      <div className="main-border">
      <form className="form-signin">
      <img className="i1" src="signin_logo.png" alt="logo"/>
      <h1>LOGIN</h1>
      <div showError={this.state.showError}
      <input type="email" id="inputUsername" className="form-control" placeholder="Username" required=""/>
      <input type="password" id="inputPassword" className="form-control" placeholder="Password" required=""/>
      <button className="sb btn btn-lg btn-primary btn-block" type="submit" onClick={this.login}>LOGIN</button>
      <p className="links" align="left" margin-top="10px">&#x25C8;&nbsp;
        <Link to="/forgot">Forgot password?</Link><br/>
        &#x25C8;&nbsp;
        <Link to="/signup">Create account</Link>
      </p>
      <p className="mt-5 mb-3 text-muted" align="left">© 2018</p>
    </form>
    </div>
  )
  }
}

export default SignIn;
