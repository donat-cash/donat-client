import React, { Component } from 'react';
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser
} from 'amazon-cognito-identity-js';
import { withRouter } from 'react-router-dom';

import config from '../config.js';
import LoaderButton from '../components/LoaderButton';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      username: '',
      password: '',
    };
  }

  validateForm() {
    return this.state.username.length > 0
      && this.state.password.length > 0;
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
      const userToken = await this.login(this.state.username, this.state.password);

      this.props.updateUserToken(userToken);
    }
    catch(e) {
      console.error(e);

      this.setState({
        isLoading: false,
      });
    }
  }

  login(username, password) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID,
    });
    const authenticationData = {
      Username: username,
      Password: password,
    };
    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) => {
      user.authenticateUser(authenticationDetails, {
        onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
        onFailure: (err) => reject(err),
      });
    });
  }

  render() {
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

        <LoaderButton
          type="submit"
          disabled={!this.validateForm()}
          isLoading={this.state.isLoading}
          text="Login"
          loadingText="Logging in…"
        />
      </form>
    );
  }
}

export default withRouter(Login);

