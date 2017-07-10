import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import AppliedRoute from './components/AppliedRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import Async from './components/Async';

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Async(() => import('./containers/Home'))} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Async(() => import('./containers/Login'))} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Async(() => import('./containers/Signup'))} props={childProps} />
    <AppliedRoute path="/pay" exact component={Async(() => import('./containers/Pay'))} props={childProps} />
    <AuthenticatedRoute path="/widgets/new" exact component={Async(() => import('./containers/NewWidget'))} props={childProps} />
    <AuthenticatedRoute path="/widgets/:id" exact component={Async(() => import('./containers/Widgets'))} props={childProps} />
    <Route component={Async(() => import('./containers/NotFound'))} />
  </Switch>
);

