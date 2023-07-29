// import config from 'config';
import APICONFIGS from '../api-configs.json';
import CONFIGS from '../configs.json';
import { authHeader, jsonHeader, store, UrlHelpers } from '../helpers';
import { customFetch } from '../helpers/fetch-hepler';
import { HubConnectionBuilder } from "@microsoft/signalr";
import { alertActions, userActions } from "../actions";
import { userConstants } from "../constants";

export const userService = {
   login,
   logout,
   loginGoogle,
   loginFacebook,
   getInfomarion,
   checkSSOSupport,
   updateInfomation,
   signUp,
   confirmEmail,
   resendConfirmEmail,
   requestResetPassword,
   checkResetPassword,
   resetPassword,
   getMyCourses,
   changePassword,
   feedback
};

export function login(username, password) {
   let loginModel = {
      "userName": username,
      "password": password
   };
   let requestOptions = {
      method: 'POST',
      cache: 'no-cache',
      credentials: "include",
      headers: authHeader(jsonHeader()),
      body: JSON.stringify(loginModel)
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Login);
   return customFetch(apiUrl, requestOptions)
      .then(res => res);
}

export function logout(){
   let requestOptions = {
      method: 'POST',
      cache: 'no-cache',
      credentials: "include",
      headers: authHeader(jsonHeader()),
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Logout);
   return customFetch(apiUrl, requestOptions)
      .then(res => res)
}

export function loginGoogle(idToken) {
   let loginModel = {
      "token": idToken
   };
   let requestOptions = {
      method: 'POST',
      cache: 'no-cache',
      credentials: "include",
      headers: authHeader(jsonHeader()),
      body: JSON.stringify(loginModel)
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.LoginGoogle);
   return customFetch(apiUrl, requestOptions)
      .then(res => res);
}

export function loginFacebook(idToken) {
   let loginModel = {
      "token": idToken
   };
   let requestOptions = {
      method: 'POST',
      cache: 'no-cache',
      credentials: "include",
      headers: authHeader(jsonHeader()),
      body: JSON.stringify(loginModel)
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.LoginFacebook);
   return customFetch(apiUrl, requestOptions)
      .then(res => res);
}

export function signUp(username, displayName, password) {
   let model = {
      "email": username,
      "displayName": displayName,
      "password": password
   };
   let requestOptions = {
      method: 'POST',
      cache: 'no-cache',
      credentials: "include",
      headers: authHeader(jsonHeader()),
      body: JSON.stringify(model)
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.SignUp);
   return customFetch(apiUrl, requestOptions)
      .then(res => res);
}

export function getInfomarion() {
   let requestOptions = {
      method: 'GET',
      cache: 'no-cache',
      credentials: "include",
      headers: authHeader()
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetUserInfomation);

   return fetch(apiUrl, requestOptions)
      .then(response => {
         if (!response.ok) {
            if (response.status == 401) {

            } else {
               alertActions.error("Internal server error.");
            }
            throw new Error(response.status);
         }
         return response.json();
      });
}

export function checkSSOSupport(){
   let requestOptions = {
      method: 'POST',
      cache: 'no-cache',
      credentials: "include",
      headers: authHeader()
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.SsoSupport);

   return fetch(apiUrl, requestOptions)
      .then(response => {
         if (!response.ok) {
            if (response.status == 401) {

            } else {
               alertActions.error("Internal server error.");
            }
            throw new Error(response.status);
         }
         return response.json();
      });
}

export function updateInfomation(model) {
   let requestOptions = {
      method: 'PUT',
      cache: 'no-cache',
      credentials: "include",
      headers: authHeader(jsonHeader()),
      body: JSON.stringify(model)
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetUserInfomation);

   return customFetch(apiUrl, requestOptions)
      .then(res => {
         if (res.isSuccess) {
            store.dispatch({ type: userConstants.INFOMATION_SUCCESS, user: res.data })
         }
         return res;
      });
}

export function changePassword(model) {
   let requestOptions = {
      method: 'PUT',
      cache: 'no-cache',
      credentials: "include",
      headers: authHeader(jsonHeader()),
      body: JSON.stringify(model)
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.ChangePassword);

   return customFetch(apiUrl, requestOptions)
      .then(res => {
         return res;
      });
}

export function confirmEmail(token) {
   let requestOptions = {
      method: 'POST',
      cache: 'no-cache',
      headers: authHeader(jsonHeader()),
      body: JSON.stringify({ token: token })
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.EmailConfirmation);
   return customFetch(apiUrl, requestOptions)
      .then(res => res);
}

export function resendConfirmEmail(token) {
   let requestOptions = {
      method: 'POST',
      cache: 'no-cache',
      headers: authHeader()
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.ResendEmailConfirmation);
   return customFetch(apiUrl, requestOptions)
      .then(res => res);
}

export function requestResetPassword(email) {
   var model = { email };
   let requestOptions = {
      method: 'POST',
      cache: 'no-cache',
      headers: authHeader(jsonHeader()),
      body: JSON.stringify(model)
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.RequestResetPassword);
   return customFetch(apiUrl, requestOptions)
      .then(res => res);
}

export function checkResetPassword(token) {
   var model = { token };
   let requestOptions = {
      method: 'POST',
      cache: 'no-cache',
      credentials: "include",
      headers: authHeader(jsonHeader()),
      body: JSON.stringify(model)
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.CheckResetPassword);
   return customFetch(apiUrl, requestOptions)
      .then(res => res);
}

export function resetPassword(token, newPassword) {
   var model = { token, newPassword };
   let requestOptions = {
      method: 'POST',
      cache: 'no-cache',
      credentials: "include",
      headers: authHeader(jsonHeader()),
      body: JSON.stringify(model)
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.ResetPassword);
   return customFetch(apiUrl, requestOptions)
      .then(res => res);
}

export function getMyCourses() {
   let requestOptions = {
      method: 'GET',
      cache: 'no-cache',
      credentials: "include",
      headers: authHeader()
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetMyCourses);
   return customFetch(apiUrl, requestOptions)
      .then(res => res);
}

export function feedback(model) {
   let requestOptions = {
      method: 'POST',
      cache: 'no-cache',
      credentials: "include",
      body: JSON.stringify(model),
      headers: authHeader(jsonHeader())
   };
   let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Feedback);
   return customFetch(apiUrl, requestOptions)
      .then(res => res);
}