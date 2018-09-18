import React, {Component} from 'react';

class SignUp extends Component {
  constuctor() {
    this.routeChange = this.routeChange.bind(this);
     }
  signup() {
    const userObject = {
      name: document.getElementById("inputEmail").value || null,
      username: document.getElementById("inputEmail").value || null,
      password: document.getElementById("inputPassword").value || null,
    };
    putData('http://markzeagler.com/ledger-backend/register', userObject)
      .then((res) => {
        const result = {
          message: res.message,
          status: res.status_code
        };
        console.log("result is ", result);
        if (!result.status || result.status !== 200) {
          console.log('server threw an error');
        }
      return window.location = "/ledger/signin";
      })
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
    return (
      <div className="main-border">
      <form className="form-signin">
      <img className="i1" src="signup.png" alt="logo"/>
      <h1>SIGN UP</h1>
      <input type="name" id="inputName" className="form-control" placeholder="Name" required=""/>
      <input type="email" id="inputEmail" className="form-control" placeholder="Email" required=""/>
      <input type="password" id="inputPassword" className="form-control" placeholder="Password" required=""/>
      <button className="sb btn btn-lg btn-primary btn-block" type="submit" onClick={this.signup}>REGISTER</button>
      <p className="mt-5 mb-3 text-muted" align="left">© 2018</p>
    </form>
    </div>
  )
  }
}

export default SignUp;
