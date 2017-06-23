import React, { Component } from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';
import { withRouter } from 'react-router-dom';

import config from './config.js';
import Routes from './Routes'
import RouteLink from './components/RouteLink';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userToken: null,
      isLoadingUserToken: true,
    };
  }

  async componentDidMount() {
    const currentUser = this.getCurrentUser();

    if (currentUser === null) {
      this.setState({
        isLoadingUserToken: false,
      });

      return;
    }

    try {
      const userToken = await this.getUserToken(currentUser);

      this.updateUserToken(userToken);
    }
    catch(e) {
      console.error(e);
    }

    this.setState({
      isLoadingUserToken: false,
    });
  }

  updateUserToken = (userToken) => {
    this.setState({
      userToken,
    });
  }

  handleLogout = (event) => {
    const currentUser = this.getCurrentUser();

    if (currentUser !== null) {
      currentUser.signOut();
    }

    if (AWS.config.credentials) {
      AWS.config.credentials.clearCachedId();
    }

    this.updateUserToken(null);
    this.props.history.push('/login');
  }

  getCurrentUser() {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID,
    });

    return userPool.getCurrentUser();
  }

  getUserToken(currentUser) {
    return new Promise((resolve, reject) => {
      currentUser.getSession((err, session) => {
        if (err) {
            reject(err);

            return;
        }

        resolve(session.getIdToken().getJwtToken());
      });
    });
  }

  render() {
    const childProps = {
      userToken: this.state.userToken,
      updateUserToken: this.updateUserToken,
    };

    return !this.state.isLoadingUserToken && (
      <div>
        <RouteLink to="/">Home</RouteLink>
        {
          this.state.userToken
            ? <button onClick={this.handleLogout}>Logout</button>
            : [
              <RouteLink key={1} to="/signup">Signup</RouteLink>,
              <RouteLink key={2} to="/login">Login</RouteLink>,
            ]
        }
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);

