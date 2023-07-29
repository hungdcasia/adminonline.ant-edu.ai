import React, { Component, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { userActions, alertActions } from '../actions';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { ReactComponent as Show_password_icon } from "../assets/images/show_password.svg";
import { ReactComponent as Hide_password_icon } from "../assets/images/hide_password.svg";
import queryString from 'query-string';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
// import { Redirect } from 'react-router-dom/cjs/react-router-dom';
import {Redirect} from 'react-router-dom'

const Login = ({location, loggedIn, login, loginFacebook, loginGoogle}) => {

   const params = queryString.parse(location.search);
   const returnUrl = params.r;
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [submitted, setSubmitted] = useState(false);
   const [showPassword, setShowPassword] = useState(false);


   const loginGoogleHook = useGoogleLogin ({
      onSuccess: async responseGoogle => {
         loginGoogle(responseGoogle.access_token)
      },
   })

   const loginGoogleClick = () => {
      loginGoogleHook();
   }

   const handleInputChange = (event) => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      switch (name) {
         case 'email':
            setEmail(value)
            break;
         case 'password':
            setPassword(value)
            break;
      
         default:
            break;
      }
   }

   const loginClick = (e) => {
      e.preventDefault();

      setSubmitted(true);
      if (email && password) {
         login(email, password);
      }
   }

   const loginFacebookClick = (event) => {
   }

   const responseFacebook = (response) => {
      if (response.accessToken) {
         loginFacebook(response.accessToken);
      } else {
         console.error(response);
         alertActions.error("Đăng nhập tài khoản Facebook không thành công");
      }
   }

   const failedGoogle = (response) => {
      console.error(response);
      alertActions.error("Đăng nhập tài khoản Google không thành công");
   }



   // const componentWillReceiveProps = (nextProps) {
   //    var { loggedIn } = nextProps;
   //    if (loggedIn) {
   //       let returnUrl = this.state.returnUrl
   //       if (returnUrl == '/')
   //          returnUrl = '/user/courses'
   //       history.replace(returnUrl);
   //    }
   // }


   if (loggedIn) {
      if (returnUrl) {
         return <Redirect replace to={returnUrl} />
      } else {
         return <Redirect replace to={"/"} />
      }
      }
      return (
         <section className="Auth_contentWrapper Auth_registerPage">
            <section className="Auth_content">
               <Link to="/">
                  <header className="Auth_header"><span className="Auth_logo">{window.location.origin}</span></header>
               </Link>
               <section className="Auth_boxContainer">
                  <section className="Auth_boxHelper">
                     <section className="Auth_box">
                        <h1 className="Auth_heading">Thành viên đăng nhập</h1>
                        <p className="Auth_subHeading d-none"><span className="">Online Ant là cộng đồng chia sẻ kiến thức. Đăng nhập để cùng nhau học tập, đóng góp và chia sẻ kiến thức <span>❤️</span></span></p>
                        <ul className="Auth_loginWrapper">
                           <li className=''>
                              <button onClick={loginGoogleClick} className="Auth_btn Auth_btnGoogle"><span>Đăng nhập với Google</span></button>
                           </li>
                           <li className='d-none'>
                              {/* <FacebookLogin
                                 appId={process.env.REACT_APP_FacebookAppId}
                                 autoLoad={false}
                                 fields="name,email,picture"
                                 callback={responseFacebook}
                                 render={renderProps => (
                                    <button className="Auth_btn Auth_btnFacebook" onClick={renderProps.onClick}>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                          <path fill="#3b5998" d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.61v-6.97h-2.34V11.3h2.34v-2c0-2.33 1.42-3.6 3.5-3.6 1 0 1.84.08 2.1.12v2.43h-1.44c-1.13 0-1.35.53-1.35 1.32v1.73h2.69l-.35 2.72h-2.34V21h4.59a1 1 0 0 0 .99-1V4a1 1 0 0 0-1-1z"></path>
                                       </svg>
                                       <span>Đăng nhập với Facebook</span>
                                    </button>
                                 )}
                              /> */}
                           </li>
                           <p className="Auth_snsHelp d-none">Mẹo: Đăng nhập nhanh hơn với Google hoặc Facebook!</p>
                           <li className="Auth_orSeparator d-none"><span>Hoặc</span></li>
                           <li className="Auth_form">
                              <div className="TextInput_container" data-qa="mycv-email">
                                 <label className="Label_label">Tên Đăng nhập</label>
                                 <div className="Input_inputWrap">
                                    <input placeholder="VD: example@online-ant.vn" type="text" name="email" className="Input_input Input_m" value={email} onChange={handleInputChange} />
                                    <button tabIndex="-1" type="button" className="Input_hidden">
                                       <svg className="Input_icon" width="16" height="16" viewBox="0 0 16 16">
                                          <path fill="currentColor" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.243 10.285a.5.5 0 0 1-.708.707L7.999 8.457l-2.536 2.535a.498.498 0 0 1-.708 0 .5.5 0 0 1 0-.707L7.291 7.75 4.755 5.215a.5.5 0 0 1 .707-.707l2.536 2.535 2.536-2.535a.5.5 0 0 1 .707.707L8.705 7.75l2.536 2.535z"></path>
                                       </svg>
                                    </button>
                                 </div>
                              </div>
                              <div className="TextInput_container" data-qa="mycv-password">
                                 <label className="Label_label">Mật khẩu</label>
                                 <div className="Input_inputWrap">
                                    <input placeholder="Nhập mật khẩu" name="password" required="" type={showPassword ? "text" : "password"} className="Input_input Input_m" value={password} onChange={handleInputChange} />
                                    <span className="Input_initIcon Input_iconContainer">
                                       <button className="ranks_text base_button sizes_m tooltip_tooltip base_noPadding" type="button">
                                          <div className="base_inner sizes_inner">
                                             <span className="base_text" onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ?
                                                   <Show_password_icon className="PasswordField_iconButton" /> :
                                                   <Hide_password_icon className="PasswordField_iconButton" />
                                                }
                                             </span>
                                          </div>
                                       </button>
                                    </span>
                                    <button tabIndex="-1" type="button" className="Input_hidden">
                                       <svg className="Input_icon" width="16" height="16" viewBox="0 0 16 16">
                                          <path fill="currentColor" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.243 10.285a.5.5 0 0 1-.708.707L7.999 8.457l-2.536 2.535a.498.498 0 0 1-.708 0 .5.5 0 0 1 0-.707L7.291 7.75 4.755 5.215a.5.5 0 0 1 .707-.707l2.536 2.535 2.536-2.535a.5.5 0 0 1 .707.707L8.705 7.75l2.536 2.535z"></path>
                                       </svg>
                                    </button>
                                 </div>
                              </div>
                              <section className="Auth_globalFormErrors"></section>
                              <button onClick={loginClick}
                                 disabled={!email || !password}
                                 className={`Auth_btn Auth_btnSubmit ${(!email || !password) && "Auth_btnSubmit_disabled"}`}
                                 data-qa="submit">Đăng nhập</button>
                              <section className="Auth_resetWrapper"><Link className="Auth_resetLink" to="/forgot-password">Quên mật khẩu?</Link></section>
                           </li>
                        </ul>
                     </section>
                     <section className="Auth_disclaimer">
                        <p>Bạn chưa có tài khoản?<br /><Link to={"/register?r=" + returnUrl}>Đăng ký trải nghiệm miễn phí ngay!</Link></p>
                     </section>
                  </section>
               </section>
            </section>
         </section>
      )
   
}

function mapState(state) {
   const { loggedIn } = state.authentication;
   return { loggedIn };
}

const actionCreators = {
   login: userActions.login,
   loginGoogle: userActions.loginGoogle,
   loginFacebook: userActions.loginFacebook,
};

const connectedLoginPage = connect(mapState, actionCreators)(Login);
export { connectedLoginPage as Login };