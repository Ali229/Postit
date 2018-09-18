import React, {Component} from 'react';

class ForgotPass extends Component {
  forgot() {
    window.location = "/";
  }
  render() {
    document.body.classList.add("gradient");
    return (<div className="main-border">
      <form className="form-signin">
        <h2>FORGOT PASSWORD</h2>
        <input type="name" id="inputName" className="form-control" placeholder="Name" required=""/>
        <button className="sb btn btn-lg btn-primary btn-block" type="button" onClick={this.forgot}>SEND PASSWORD</button>
        <p className="mt-5 mb-3 text-muted" align="left">© 2018</p>
      </form>
    </div>)
  }
}
export default ForgotPass;
