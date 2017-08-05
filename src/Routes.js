import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import AppliedRoute from './components/AppliedRoute';
import Async from './components/Async';

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Async(() => import('./containers/Home'))} props={childProps} />
    <AppliedRoute path="/widgets/:id" exact component={Async(() => import('./containers/Widgets'))} props={childProps} />
    <AppliedRoute path="/users/:id" exact component={Async(() => import('./containers/Users'))} props={childProps} />
    <Route component={Async(() => import('./containers/NotFound'))} />
  </Switch>
);

