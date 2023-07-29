import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from "react-router-dom";
import { userService } from "../services";
import { connect } from 'react-redux';
import { alertActions, userActions } from '../actions';
import SimpleReactValidator from 'simple-react-validator';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { ReactComponent as Show_password_icon } from "../assets/images/show_password.svg";
import { ReactComponent as Hide_password_icon } from "../assets/images/hide_password.svg";
import { ReactComponent as Checkbox_tick } from "../assets/images/ic_checkbox_tick.svg";
import { ReactComponent as IconInputWarning } from "../assets/images/ic_input_warning.svg";
import { history } from '../helpers';
import queryString from 'query-string';

class Register extends Component {

   constructor(props) {
      super(props)
      let params = queryString.parse(this.props.location.search);
      this.validator = new SimpleReactValidator({
      });
      this.state = this.getInitialState();
      if (params.r) {
         this.state.returnUrl = params.r
      }
      this.submitClick = this.submitClick.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleInputLoseFocus = this.handleInputLoseFocus.bind(this);
      this.validateValue = this.validateValue.bind(this);
      this.newFormField = this.newFormField.bind(this);
      this.newValidationDescription = this.newValidationDescription.bind(this);
      this.formValidate = this.formValidate.bind(this);

      this.validationDescriptions = {
         displayName: [
            this.newValidationDescription("required", "Vui lòng nhập tên của bạn")
         ],
         email: [
            this.newValidationDescription("required|email", "Vui lòng nhập email")
         ],
         password: [
            this.newValidationDescription("required", "Vui lòng nhập mật khẩu"),
            this.newValidationDescription("min:6", "Sử dụng ít nhất 6 ký tự"),
            // this.newValidationDescription("regex:^(?=.*[0-9]).", "Có ít nhất 1 ký tự là số"),
            // this.newValidationDescription("regex:^(?=.*[a-z]).", "Có ít nhất 1 ký tự in thường"),
            // this.newValidationDescription("regex:^(?=.*[A-Z]).", "Có ít nhất 1 ký tự in hoa")
         ],
      }

      this.submitted = false;
   }

   componentWillReceiveProps(nextProps) {
      var { loggedIn } = nextProps;
      if (loggedIn) {
         let returnUrl = this.state.returnUrl
         if (returnUrl == '/')
            returnUrl = '/user/courses'
         history.replace(returnUrl);
      }
   }

   getInitialState() {
      return {
         email: this.newFormField(''),
         displayName: this.newFormField(''),
         password: this.newFormField(''),
         subcribeNews: true,
         submitted: false,
         showPassword: false,
         returnUrl: '/'
      };
   }

   handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? !target.checked : target.value;
      const name = target.name;

      this.setState({
         [name]: this.newFormField(value, this.validateValue(name, value))
      });
   }

   handleInputLoseFocus(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState({
         [name]: this.newFormField(value, this.validateValue(name, value))
      });
   }

   validateValue(fieldName, value) {
      var errors = [];
      var validationDescriptions = this.validationDescriptions[fieldName];
      if (!validationDescriptions)
         return errors;

      for (let i = 0; i < validationDescriptions.length; i++) {
         const item = validationDescriptions[i];
         if (!this.validator.check(value, item.validations))
            errors.push(item.message);
      }

      return errors;
   }

   formValidate() {
      var result = true;
      for (const key in this.validationDescriptions) {
         if (Object.hasOwnProperty.call(this.validationDescriptions, key)) {
            const validationDescriptions = this.validationDescriptions[key];
            let value = this.state[key].value;
            this.setState({
               [key]: this.newFormField(value, this.validateValue(key, value))
            });

            if (!this.state[key].valid)
               result = false;
         }
      }

      return result;
   }

   submitClick(e) {
      e.preventDefault();
      if (this.submitted) return;

      if (!this.formValidate()) {
         return;
      }
      const { email, password, displayName, subcribeNews } = this.state;
      this.submitted = true;
      userService.signUp(email.value, displayName.value, password.value)
         .then(
            res => {
               if (res.isSuccess)
                  this.props.login(email.value, password.value);
            },
            error => {

            }
         )
         .finally(() => {
            this.submitted = false;
         });
   }

   newFormField(defaultValue, errors = []) {
      return {
         value: defaultValue,
         valid: errors == null || errors.length == 0,
         errors: errors
      }
   }

   newValidationDescription(validations, message) {
      return {
         validations, message
      };
   }

   loginFacebookClick = (event) => {
   }

   responseFacebook = (response) => {
      if (response.accessToken) {
         this.props.loginFacebook(response.accessToken);
      } else {
         alertActions.error("Đăng nhập tài khoản Facebook không thành công");
         console.error(response);
      }
   }

   responseGoogle = (response) => {
      this.props.loginGoogle(response.tokenId);
   }

   failedGoogle = (response) => {
      alertActions.error("Đăng nhập tài khoản Google không thành công");
      console.error(response);
   }

   render() {

      return (
         <section className="Auth_contentWrapper Auth_registerPage">
            <section className="Auth_content">
               <Link to="/">
                  <header className="Auth_header"><span className="Auth_logo">{window.location.origin}</span></header>
               </Link>
               <section className="Auth_boxContainer">
                  <section className="Auth_boxHelper">
                     <section className="Auth_box">
                        <h1 className="Auth_heading">Đăng ký thành viên</h1>
                        <p className="Auth_subHeading"><span className="">Online Ant là cộng đồng chia sẻ kiến thức. Đăng nhập để cùng nhau học tập, đóng góp và chia sẻ kiến thức <span>❤️</span></span></p>
                        <ul className="Auth_loginWrapper">
                           {/* <li>
                              <GoogleLogin
                                 clientId={process.env.REACT_APP_GoogleClientId}
                                 render={renderProps => (
                                    <button className="Auth_btn Auth_btnGoogle" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                       <span>Đăng ký với Google</span>
                                    </button>
                                 )}
                                 buttonText="Login"
                                 onSuccess={this.responseGoogle}
                                 onFailure={this.failedGoogle}
                                 cookiePolicy={'single_host_origin'}
                              />
                           </li> */}
                           {/* <li>
                              <FacebookLogin
                                 appId={process.env.REACT_APP_FacebookAppId}
                                 autoLoad={false}
                                 fields="name,email,picture"
                                 callback={this.responseFacebook}
                                 render={renderProps => (
                                    <button className="Auth_btn Auth_btnFacebook" onClick={renderProps.onClick}>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                          <path fill="#3b5998" d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.61v-6.97h-2.34V11.3h2.34v-2c0-2.33 1.42-3.6 3.5-3.6 1 0 1.84.08 2.1.12v2.43h-1.44c-1.13 0-1.35.53-1.35 1.32v1.73h2.69l-.35 2.72h-2.34V21h4.59a1 1 0 0 0 .99-1V4a1 1 0 0 0-1-1z"></path>
                                       </svg>
                                       <span>Đăng ký với Facebook</span>
                                    </button>
                                 )}
                              />
                           </li> */}
                           {/* <p className="Auth_snsHelp">Mẹo: Đăng ký nhanh hơn với Google hoặc Facebook!</p> */}
                           {/* <li className="Auth_orSeparator"><span>Hoặc</span></li> */}
                           <li className="Auth_form">
                              <form autoComplete='off'>
                                 <div className="TextInput_container" data-qa="mycv-fullName">
                                    <label className="Label_label">Họ và tên</label>
                                    <div className="Input_inputWrap">
                                       <input placeholder="VD: Nguyễn Văn A"
                                          type="text"
                                          name="displayName"
                                          maxLength="50"
                                          className={`Input_input Input_m ${!this.state.displayName.valid && 'Input_invalid'}`}
                                          value={this.state.displayName.value}
                                          onChange={this.handleInputChange}
                                          onBlur={this.handleInputLoseFocus} />
                                       {!this.state.displayName.valid &&
                                          <span className="Input_errorIcon Input_iconContainer">
                                             <IconInputWarning className="Input_icon" />
                                          </span>
                                       }
                                    </div>
                                    {!this.state.displayName.valid &&
                                       <div className="FormField_errorMessage">{this.state.displayName.errors[0]}</div>
                                    }
                                 </div>
                                 <div className="TextInput_container" data-qa="mycv-email">
                                    <label className="Label_label">Email</label>
                                    <div className="Input_inputWrap">
                                       <input placeholder="VD: example@online-ant.vn"
                                          type="text"
                                          name="email"
                                          autoComplete='off'
                                          className={`Input_input Input_m ${!this.state.email.valid && 'Input_invalid'}`}
                                          value={this.state.email.value}
                                          onChange={this.handleInputChange}
                                          onBlur={this.handleInputLoseFocus} />
                                       {!this.state.email.valid &&
                                          <span className="Input_errorIcon Input_iconContainer">
                                             <IconInputWarning className="Input_icon" />
                                          </span>
                                       }
                                    </div>
                                    {!this.state.email.valid &&
                                       <div className="FormField_errorMessage">{this.state.email.errors[0]}</div>
                                    }
                                 </div>
                                 <div className="TextInput_container">
                                    <label className="Label_label">Mật khẩu</label>
                                    <div className="Input_inputWrap">
                                       <input placeholder="Nhập mật khẩu"
                                          name="password"
                                          required=""
                                          autoComplete="new-password"
                                          type={this.state.showPassword ? "text" : `password`}
                                          className={`Input_input Input_m ${!this.state.password.valid && 'Input_invalid'}`}
                                          value={this.state.password.value}
                                          onChange={this.handleInputChange}
                                          onBlur={this.handleInputLoseFocus} />
                                       <span className="Input_initIcon Input_iconContainer">
                                          <button className="ranks_text base_button sizes_m tooltip_tooltip base_noPadding" type="button">
                                             <div className="base_inner sizes_inner">
                                                <span className="base_text" onClick={() => this.setState({ showPassword: !this.state.showPassword })}>
                                                   {this.state.showPassword ?
                                                      <Show_password_icon className='PasswordField_iconButton' /> :
                                                      <Hide_password_icon className='PasswordField_iconButton' />
                                                   }
                                                </span>
                                             </div>
                                          </button>
                                       </span>
                                    </div>
                                    {!this.state.password.valid &&
                                       <div className="FormField_errorMessage">{this.state.password.errors[0]}</div>
                                    }
                                 </div>
                                 {/* {!this.state.password.valid &&
                                 <ul className="Auth_passwordRules">
                                    <li className=""><span>Sử dụng ít nhất 8 ký tự</span></li>
                                    <li className=""><span>Bao gồm ít nhất một chữ cái</span></li>
                                    <li className=""><span>Sử dụng ít nhất một số hoặc ký tự đặc biệt</span></li>
                                 </ul>
                              } */}
                                 <label className="Checkbox_checkboxLabel Auth_isReceiveEmail">
                                    <input type="checkbox"
                                       className="Checkbox_input"
                                       checked={this.state.subcribeNews}
                                       onChange={() => this.setState({ subcribeNews: !this.state.subcribeNews })} />
                                    <div className="Checkbox_box">
                                       <Checkbox_tick className="Checkbox_tick" />
                                    </div>
                                    <span className="Checkbox_text">Nhận thông báo về các tin tức &amp; sự kiện mới nhất của chúng tôi. (Có thể hủy đăng ký bất cứ lúc nào.)</span>
                                 </label>
                                 <button className="Auth_btn Auth_btnSubmit" data-qa="submit" onClick={this.submitClick}>Đăng ký</button>
                                 <section className="Auth_agreeTermsWrapper">
                                    <p className="Auth_agreeTermsText">Bằng cách đăng ký, bạn đồng ý với các <Link to="/dieu-khoan-su-dung">điều khoản sử dụng</Link> của chúng tôi</p>
                                 </section>
                              </form>
                           </li>
                        </ul>
                     </section>
                     <section className="Auth_disclaimer">
                        <p>Bạn đã có tài khoản?<Link to={"/login?r=" + this.state.returnUrl}> Đăng nhập</Link></p>
                     </section>
                  </section>
               </section>
            </section>
         </section>
      )
   }
}

function mapState(state) {
   const { loggedIn } = state.authentication;
   return { loggedIn };
}

const actionCreators = {
   login: userActions.login,
   loginGoogle: userActions.loginGoogle,
   loginFacebook: userActions.loginFacebook
};

const connectedPage = connect(mapState, actionCreators)(Register);
export { connectedPage as Register };