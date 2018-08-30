import React, {Component} from 'react';

class SignUp extends Component {
  render() {
    return (<form className="form-signin">
      <img className="i1" src="logo.png" alt="logo"/>
      <h1>LOGIN</h1>
      <input type="email" id="inputEmail" className="form-control" placeholder="Email" required="" autoFocus=""/>
      <input type="password" id="inputPassword" className="form-control" placeholder="Password" required=""/>
      <button className="sb btn btn-lg btn-primary btn-block" type="submit" onClick={this.handleClick}>SIGN UP</button>
    </form>)
  }
}
export default SignUp;
