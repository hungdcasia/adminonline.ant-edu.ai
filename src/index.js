import 'core-js/actual';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { store, history } from './helpers';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import { } from "moment/locale/vi";
import { Router, Switch, Route, Link, NavLink, BrowserRouter } from "react-router-dom";
import { AlertComponent, Loading, Modal } from './shared';
import { userService } from "./services";
import { userConstants } from './constants';
// import { AdminApp } from "./admin";
import './admin/scss/style.scss';
import App from './App';
import { QueryParamProvider } from 'use-query-params';
import moment from 'moment';
import { Provider } from 'react-redux';
import AlertTemplate from "./shared/alert-template";
import queryString from 'query-string';
// import { ZaloChatWidget } from './libs/zalo';
window.React = React
let logo = "/assets/images/logo-ant-edu.png";

moment.updateLocale('vi', {
  weekdays: [
    "Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"
  ]
});

window.moment = moment

const logLevels = {
  Trace: 0,
  Debug: 1,
  Information: 2,
  Warning: 3,
  Error: 4,
  Critical: 5,
  None: 6,
}

if (!String.format) {
  String.format = function (format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };
}

String.prototype.format = function (o) {
  return String.format(this, o);
};

Array.prototype.last = function () {
  if (this.length == 0) return null;
  return this[this.length - 1];
}

const AdminApp = React.lazy(() => import('./admin/AdminApp'));

// define a new console
var console = (function (oldCons) {
  return {
    log: function (text, ...optionalParams) {
      if (window.console.logLevel <= logLevels.Debug)
        oldCons.log(text, ...optionalParams);
    },
    info: function (text, ...optionalParams) {
      if (window.console.logLevel <= logLevels.Information)
        oldCons.info(text, ...optionalParams);
    },
    warn: function (text, ...optionalParams) {
      if (window.console.logLevel <= logLevels.Warning)
        oldCons.warn(text, ...optionalParams);
    },
    error: function (text, ...optionalParams) {
      if (window.console.logLevel <= logLevels.Error)
        oldCons.error(text, ...optionalParams);
    }
  };
}(window.console));

//Then redefine the old console
window.console = console;
window.console.logLevel = logLevels.Debug
// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_RIGHT,
  timeout: 5000,
  offset: '5px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const CheckLoginComponent = props => {
  let userToken = JSON.parse(localStorage.getItem('userToken'));
  const params = queryString.parse(window.location.search);
  if(params.token){
    userToken = {token: params.token}
  }
  let [isChecked, setIsChecked] = useState(userToken == null)
  let [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (userToken != null) {
      store.dispatch({ type: userConstants.LOGIN_SUCCESS, userToken });
      userService.checkSSOSupport()
        .then(
          res => {
            //nếu userToken lấy từ params hoặc localStorage thành công thì lưu lại trong storage cho lần sau 
            if(res?.data){
              localStorage.setItem('userToken', JSON.stringify(userToken));
              store.dispatch({ type: userConstants.INFOMATION_SUCCESS, user: res.data });
              window.gtag('config', process.env.REACT_APP_GAID, {
                'user_id': res.data.id
              });
            } else {
              localStorage.removeItem('userToken');
              store.dispatch({ type: userConstants.LOGOUT });
            }
            
          },
          error => {
            if (error.message == 401) {
              localStorage.removeItem('userToken');
              store.dispatch({ type: userConstants.LOGOUT });
            }
          }
        )
        .finally(() => {
          setTimeout(() => {
            setIsChecked(true);
          }, 10)
        });
    }
  }, [])

  setTimeout(() => {
    setDelayed(true);
  }, 1000);

  if (!isChecked || !delayed) {
    return (
      <div className='Dark-background' style={{ display: 'flex', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
        <img src={logo} alt='Logo' style={{ width: '300px', objectFit: "contain", opacity: 1, transition: 'opacity 5s ease-in' }} />
      </div>
    )
  }

  return (
    <>
      <Modal />
      <Loading />
      <Switch>
        <Route path='/admin' component={AdminApp} />
        <Route path='/' component={App} />
      </Switch>
      <AlertComponent />
      {/* <ZaloChatWidget /> */}
    </>
  );
}
ReactDOM.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options} >
      <Router history={history}>
        <React.Suspense fallback={loading}>
          <QueryParamProvider ReactRouterRoute={Route}>
            <CheckLoginComponent />
          </QueryParamProvider>
        </React.Suspense>
      </Router >
    </AlertProvider>
  </Provider>,
  document.getElementById('root')
  // document.getElementsByTagName("body")[0]
);


// ReactDOM.render(
//   <React.StrictMode>
//     <div>asdaasdas</div>
//   </React.StrictMode>
//   , document.getElementById('root')
// )
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// reportWebVitals(console.log);
