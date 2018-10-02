import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
// var DATA = {
//   name: 'John Doe',
//   imgURL: 'https://loremflickr.com/320/240',
//   followerList: ['Follower-1', 'Follower-2', 'Follower-3']
// }
const MyContext = React.createContext();
class SignIn extends Component {
  constructor(props) {
    super(props);
    this.connect = this.connect.bind(this);
    this.state = {
      redirect: false,
      userName: null,
      password: null,
      auth_token: null
    }
    this.UserNameChange = this.UserNameChange.bind(this);
    this.PasswordChange = this.PasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  setRedirect = () => {
    this.setState({redirect: true})
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/home'/>
    }
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
  static getToken() {
    return this.state.auth_token;
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
      //console.info(resJSON.message);
      this.state.auth_token = resJSON.message.auth_token;
      //console.info('1:', this.props.auth_token);
      //console.info('2:', this.props.auth_token);
      localStorage.setItem('auth', this.state.auth_token);
      localStorage.setItem('currentUser', this.state.userName);

      return this.setRedirect();

      //window.location = "/ledger/home";
    } catch (e) {
      document.getElementById("errorDiv").style.display = 'block';
      document.getElementById("errorDiv").innerHTML = e;
    }
  }
  // componentWillUnmount() {
  //   this.redirect = true;
  // }
  render() {
    document.body.classList.add('gradient');
    return (
      
      <div className="main-border">
      <MyContext.Provider value="hi">
        {this.props.children}
      </MyContext.Provider>
      <form className="form-signin" onSubmit={this.handleSubmit} noValidate="novalidate">
        <img className="i1" src="signin_logo.png" alt="logo"/>
        <h1>LOGIN</h1>
        <input type="email" id="inputUsername" className="form-control" placeholder="Username" onChange={this.UserNameChange}/>
        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" onChange={this.PasswordChange}/>
        <div id="errorDiv"></div>
        {this.renderRedirect()}
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
