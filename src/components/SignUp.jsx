import React, {Component} from 'react';

class SignUp extends Component {
  render() {
    document.body.classList.add("gradient");
    return (
      <div className="main-border">
      <form className="form-signin">
      <img className="i1" src="/logo.png" alt="logo"/>
      <h1>Sign Up</h1>
      <input type="name" id="inputName" className="form-control" placeholder="Name" required=""/>
      <input type="email" id="inputEmail" className="form-control" placeholder="Email" required=""/>
      <input type="password" id="inputPassword" className="form-control" placeholder="Password" required=""/>
      <button className="sb btn btn-lg btn-primary btn-block" type="button" onClick={this.login}>Sign Up</button>
      <p className="mt-5 mb-3 text-muted" align="left">© 2018</p>
    </form>
    </div>
  )
  }
}
export default SignUp;
