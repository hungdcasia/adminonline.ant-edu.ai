import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './scss/style.scss';
import { icons } from './assets/icons'
import { useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';

React.icons = icons

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const AdminApp = props => {

  var authentication = useSelector(state => state.authentication)
  if (!authentication.loggedIn) {
    return (
      <Login />
    )
  }

  let roles = authentication.userInfomation?.roles ?? []
  if (roles == 0) {
    return (
      <Page404 />
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route exact path="/admin/login" name="Login Page" render={props => <Login {...props} />} />
        <Route exact path="/admin/register" name="Register Page" render={props => <Register {...props} />} />
        <Route exact path="/admin/404" name="Page 404" render={props => <Page404 {...props} />} />
        <Route exact path="/admin/500" name="Page 500" render={props => <Page500 {...props} />} />
        <Route path="/admin" name="Home" render={props => <TheLayout {...props} />} />
      </Switch>
    </QueryClientProvider>
  );
}

export default AdminApp