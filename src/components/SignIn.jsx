import React, {Component} from 'react';
import {Link} from 'react-router-dom'
class SignIn extends Component {

  update() {
    console.log('running...');
    const userObject = {
      email: document.getElementById("inputEmail").value || null,
      password: document.getElementById("inputPassword").value || null,
      name: "jacob"
    };

    putData('http://markzeagler.com/ledger-backend/signin', userObject)
      .then((res) => console.log("This is after function call", JSON.stringify(res)))
      .catch((err) => console.log("If err", err))

    function putData(url, data) {
      console.log("Makind sure data is passed", data);
      return fetch(url,  {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userObject)
      }).then(response => response.json());
    }
  }

  render() {
    document.body.classList.add("gradient");
    return (<form className="form-signin">
      <img className="i1" src="logo.png" alt="logo"/>
      <h1>LOGIN</h1>
      <input type="email" id="inputEmail" className="form-control" placeholder="Email" required=""/>
      <input type="password" id="inputPassword" className="form-control" placeholder="Password" required=""/>
      <button className="sb btn btn-lg btn-primary btn-block" type="button" onClick={this.update}>LOGIN</button>
      <p className="links" align="left" margin-top="10px">&#x25C8;&nbsp;
        <Link to="/forgot">Forgot password?</Link><br/>
        &#x25C8;&nbsp;
        <Link to="/signup">Create account</Link>
      </p>
      <p className="mt-5 mb-3 text-muted" align="left">© 2018</p>
    </form>)
  }
}

export default SignIn;
