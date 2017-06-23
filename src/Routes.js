import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import AppliedRoute from './components/AppliedRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import Home from './containers/Home';
import Login from './containers/Login';
import Signup from './containers/Signup';
import NewWidget from './containers/NewWidget';
import Widgets from './containers/Widgets';
import NotFound from './containers/NotFound';

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
    <AuthenticatedRoute path="/widgets/new" exact component={NewWidget} props={childProps} />
    <AuthenticatedRoute path="/widgets/:id" exact component={Widgets} props={childProps} />
    <Route component={NotFound} />
  </Switch>
);

