import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AppliedRoute from './components/AppliedRoute';
import Home from './containers/Home';
import Login from './containers/Login';
import Signup from './containers/Signup';
import NewWidget from './containers/NewWidget';
import Widgets from './containers/Widgets';
import NotFound from './containers/NotFound';

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
    <AppliedRoute path="/widgets/new" exact component={NewWidget} props={childProps} />
    <AppliedRoute path="/widgets/:id" exact component={Widgets} props={childProps} />
    <Route component={NotFound} />
  </Switch>
);
