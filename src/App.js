import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import config from './config.js';
import Routes from './Routes'
import { invokeApig } from './libs/awsLib';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: null,
    };
  }

  async componentDidMount() {
    const searchParams = this.props.location.search.split('?')[1] || '';
    const getParams = searchParams.split('=').reduce((result, value, key, array) => key % 2 === 0 ? Object.assign({}, result, {
      [value]: array[key + 1],
    }) : result, {});
    const { yandexMoney } = config;

    if (getParams.code !== undefined) {
      this.setState({
        isLoading: true,
      });

      try {
        const response = await fetch(`https://money.yandex.ru/oauth/token?code=${getParams.code}&client_id=${yandexMoney.clientId}&redirect_uri=${yandexMoney.redirectURI}&grant_type=authorization_code`, {
          method: 'post',
          mode: 'no-cors'
        });
        console.log(response)

        this.setState({
          accessToken: response.accessToken,
        });
      }
      catch(e) {
        console.error(e);

        this.setState({
          isLoading: false,
        });
      }
    }
  }

  handleLogout = () => {
    this.setState({
      accessToken: null,
    });
  }

  render() {
    const childProps = {
      accessToken: this.state.accessToken,
    };
    const { yandexMoney } = config;

    return (
      <div>
        {
          this.props.match.path === '/'
            ? this.state.accessToken
              ? <button onClick={this.handleLogout}>Logout</button>
              : <a href={`https://money.yandex.ru/oauth/authorize?client_id=${yandexMoney.clientId}&redirect_uri=${yandexMoney.redirectURI}&response_type=code&scope=account-info operation-history`}>Auth</a>
            : null
        }
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);

