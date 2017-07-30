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
    <AppliedRoute path="/widget/:id" exact component={Async(() => import('./containers/Widget'))} props={childProps} />
    <AppliedRoute path="/page/:id" exact component={Async(() => import('./containers/Page'))} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Async(() => import('./containers/Login'))} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Async(() => import('./containers/Signup'))} props={childProps} />
    <AuthenticatedRoute path="/widgets/new" exact component={Async(() => import('./containers/NewWidget'))} props={childProps} />
    <AuthenticatedRoute path="/widgets/:id" exact component={Async(() => import('./containers/Widgets'))} props={childProps} />
    <AuthenticatedRoute path="/pages/new" exact component={Async(() => import('./containers/NewPage'))} props={childProps} />
    <AuthenticatedRoute path="/pages/:id" exact component={Async(() => import('./containers/Pages'))} props={childProps} />
    <Route component={Async(() => import('./containers/NotFound'))} />
  </Switch>
);

