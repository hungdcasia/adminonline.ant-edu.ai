import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from "react-router-dom";
import { checkResetPassword, resetPassword } from "../services";
import SimpleReactValidator from 'simple-react-validator';
import { newFormField, newValidationDescription, history } from "../helpers";
import { ReactComponent as IconInputWarning } from "../assets/images/ic_input_warning.svg";
import queryString from 'query-string';
import { ReactComponent as Show_password_icon } from "../assets/images/show_password.svg";
import { ReactComponent as Hide_password_icon } from "../assets/images/hide_password.svg";

export class ResetPassword extends Component {

    constructor(props) {
        super(props)
        this.validator = new SimpleReactValidator();
        let params = queryString.parse(this.props.location.search);
        this.token = params.u;
        this.isLoading = false;
        this.state = this.getInitState();

        this.onValueChanged = this.onValueChanged.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.checkValidPassword = this.checkValidPassword.bind(this);
        this.checkValidToken = this.checkValidToken.bind(this);

        this.checkValidToken();
    }

    checkValidToken() {
        if(!this.token){
            history.replace('/');
            return;
        }
        history.replace('/reset-password');
        this.isLoading = true;
        checkResetPassword(this.token)
            .then(result => {
                this.setState({
                    isValidToken: result.isSuccess
                });
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    getInitState() {
        return {
            password: newFormField(''),
            isShowPassword: false,
            isSuccess: false,
            isValidToken: true
        }
    }

    onValueChanged(e) {
        this.setState({
            password: newFormField(e.target.value)
        });
    }

    checkValidPassword() {
        var rules = [
            { rule: 'required|min:6', message: 'Sử dụng ít nhất 6 ký tự' }
        ];
        var errors = [];
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];

            if (!this.validator.check(this.state.password.value, rule.rule)) {
                errors.push(rule.message);
            }
        }
        this.setState({
            password: newFormField(this.state.password.value, errors)
        });
        return errors.length == 0;
    }

    onSubmitClick() {
        if (this.isLoading) return;
        if (!this.checkValidPassword())
            return;
        this.isLoading = true;
        resetPassword(this.token, this.state.password.value)
            .then(result => {
                this.setState({
                    isSuccess: result.isSuccess
                });
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    //function which is called the first time the component loads
    componentDidMount() {
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
                                <h1 className="Auth_heading">{'Tạo mật khẩu mới'}</h1>
                                {!this.state.isValidToken &&
                                    <section className="Auth_resetPasswordMessage Auth_error">
                                        <span>Liên kết đã hết hạn hoặc không hợp lệ</span>
                                    </section>
                                }

                                {this.state.isSuccess && this.state.isValidToken &&
                                    <section className="Auth_resetPasswordMessage">
                                        <span>Đặt mật khẩu mới thành công. Bạn có thể đăng nhập ngay bây giờ</span>
                                    </section>
                                }
                                <ul className="Auth_loginWrapper">
                                    {!this.state.isSuccess && this.state.isValidToken &&
                                        <li className="Auth_form">
                                            <div className="TextInput_container" data-qa="mycv-password">
                                                <label className="Label_label">Mật khẩu mới</label>
                                                <div className="Input_inputWrap">
                                                    <input placeholder="Nhập mật khẩu"
                                                        name="password"
                                                        required=""
                                                        type={this.state.isShowPassword ? "text" : `password`}
                                                        className={`Input_input Input_m ${!this.state.password.valid && 'Input_invalid'}`}
                                                        value={this.state.password.value}
                                                        onChange={this.onValueChanged} />
                                                    <span className="Input_initIcon Input_iconContainer">
                                                        <button className="ranks_text base_button sizes_m tooltip_tooltip base_noPadding" type="button">
                                                            <div className="base_inner sizes_inner">
                                                                <span className="base_text" onClick={() => this.setState({ isShowPassword: !this.state.isShowPassword })}>
                                                                    {this.state.isShowPassword ?
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
                                            <button className="Auth_btn Auth_btnSubmit" onClick={this.onSubmitClick}>Tạo mật khẩu</button>
                                        </li>
                                    }
                                    <section className="Auth_signinWrapper"><Link className="Auth_signinLink" to="/login">Đăng nhập</Link></section>
                                </ul>
                            </section>
                            <section className="Auth_troubleSigning">
                                <p>Bạn cần sự hỗ trợ? <a href="mailto:info@online-ant.edu.vn">Gửi email cho chúng tôi</a></p>
                            </section>
                        </section>
                    </section>
                </section>
            </section>
        )
    }
}