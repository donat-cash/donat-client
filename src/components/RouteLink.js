import React from 'react';
import {
  Route,
  Link,
} from 'react-router-dom';

export default (props) => (
  <Route path={props.to} exact children={() => (
    <Link {...props} >{props.children}</Link>
  )}/>
);

