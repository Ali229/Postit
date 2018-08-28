import React, {Component} from 'react';
import {firebaseApp} from '../firebase'

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  signUp() {
    console.log('this.state', this.state);
    const {email, password} = this.state;
    firebaseApp.auth().createUserWithEmailAndPassword(email, password).catch(error => {
      console.log('error', error)
    })
  }

  render() {

    return (<h1>Sign up</h1>)
  }
}

export default SignUp;
