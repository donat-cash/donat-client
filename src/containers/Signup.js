import React, { Component } from 'react';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { withRouter } from 'react-router-dom';

import config from '../config.js';
import LoaderButton from '../components/LoaderButton';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      username: '',
      password: '',
      confirmPassword: '',
      confirmationCode: '',
      newUser: null,
    };
  }

  validateForm() {
    return this.state.username.length > 0
      && this.state.password.length > 0
      && this.state.password === this.state.confirmPassword;
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = ({ target }) => {
    this.setState({
      [target.id]: target.value,
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      isLoading: true,
    });

    try {
      const newUser = await this.signup(this.state.username, this.state.password);

      this.setState({
        newUser,
      });
    }
    catch(e) {
      console.error(e);
    }

    this.setState({
      isLoading: false,
    });
  }

  handleConfirmationSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      isLoading: true,
    });

    try {
      await this.confirm(this.state.newUser, this.state.confirmationCode);

      const userToken = await this.authenticate(
        this.state.newUser,
        this.state.username,
        this.state.password
      );

      this.props.updateUserToken(userToken);
      this.props.history.push('/');
    }
    catch(e) {
      console.error(e);

      this.setState({
        isLoading: false,
      });
    }
  }

  signup(username, password) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID,
    });
    const attributeEmail = new CognitoUserAttribute({
      Name: 'email',
      Value: username
    });

    return new Promise((resolve, reject) => {
      userPool.signUp(username, password, [attributeEmail], null, (err, result) => {
        if (err) {
          reject(err);

          return;
        }

        resolve(result.user);
      });
    });
  }

  confirm(user, confirmationCode) {
    return new Promise((resolve, reject) => {
      user.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
          reject(err);

          return;
        }

        resolve(result);
      });
    });
  }

  authenticate(user, username, password) {
    const authenticationData = {
      Username: username,
      Password: password
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) => {
      user.authenticateUser(authenticationDetails, {
        onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
        onFailure: (err) => reject(err),
      });
    });
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <p>Please check your email for the code.</p>

        <label htmlFor="confirmationCode">Confirmation Code</label>

        <input
          id="confirmationCode"
          name="confirmationCode"
          type="tel"
          value={this.state.confirmationCode}
          onChange={this.handleChange}
        />

        <LoaderButton
          type="submit"
          disabled={!this.validateConfirmationForm()}
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="username">Email</label>

        <input
          autoFocus
          id="username"
          name="username"
          type="email"
          value={this.state.username}
          onChange={this.handleChange}
        />

        <label htmlFor="password">Password</label>

        <input
          id="password"
          name="password"
          type="password"
          value={this.state.password}
          onChange={this.handleChange}
        />

        <label htmlFor="confirmPassword">Confirm Password</label>

        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={this.state.confirmPassword}
          onChange={this.handleChange}
        />

        <LoaderButton
          type="submit"
          disabled={!this.validateForm()}
          isLoading={this.state.isLoading}
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    );
  }

  render() {
    return (
      <div>
        {
          this.state.newUser === null
            ? this.renderForm()
            : this.renderConfirmationForm()
        }
      </div>
    );
  }
}

export default withRouter(Signup);

