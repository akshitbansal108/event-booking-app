import React, { Component } from "react";

import './Auth.css';

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.emailElement = React.createRef();
    this.passwordElement = React.createRef();
  }

  submit = () => {
    const email = this.emailElement.current.value;
    const password = this.passwordElement.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    console.log(email, password);
  }

  render() {
    return (
      <form className="auth-form" onSubmit={this.submit}>
        <div className="form-input">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={this.emailElement} />
        </div>
        <div className="form-input">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordElement} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button">Signup</button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
