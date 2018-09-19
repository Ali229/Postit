import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class SignIn extends Component {

  login() {
    const userObject = {
      username: document.getElementById('inputUsername').value || null,
      password: document.getElementById('inputPassword').value || null,
    };
    if (!userObject.username || !userObject.password) {
      return console.log('Incorrect username and password');
    }
    putData('http://markzeagler.com/ledger-backend/signin', userObject)
    .then((res) => {
      const result = {
        msg: JSON.stringify(res),
        code1: res.status,
      };
      console.log('Success: ', result.msg);
      console.log(result.code);
      console.log(result.code1);
      return window.location = '/ledger/home';
    })
    .catch((err) => console.log('Caught Error: ', err))

    function putData(url, data) {
      return fetch(url,  {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then((response) => {
          console.log(response.headers.get('Content-Type'));
          response.json();
      });
    }
  }


  render() {
    document.body.classList.add('gradient');
    return (
      <div className="main-border">
      <form className="form-signin">
      <img className="i1" src="signin_logo.png" alt="logo"/>
      <h1>LOGIN</h1>
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
