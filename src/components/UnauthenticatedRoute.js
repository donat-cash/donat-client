import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const querystring = (name, url = window.location.href) => {
  const clearName = name.replace(/[[]]/g, '\\$&');
  const regex = new RegExp(`[?&]${clearName}(=([^&#]*)|&|#|$)`, 'i');
  const results = regex.exec(url);

  if (!results) {
    return null;
  }

  if (!results[2]) {
    return '';
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export default ({ component: C, props: cProps, ...rest }) => {
  const redirect = querystring('redirect');

  return (
    <Route {...rest} render={props => (
      cProps.userToken === null
        ? <C {...props} {...cProps} />
        : <Redirect to={(redirect === '' || redirect === null)
            ? '/'
            : redirect}
          />
    )}/>
  );
};

