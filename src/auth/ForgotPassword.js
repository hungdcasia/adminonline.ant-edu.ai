import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from "react-router-dom";
import { requestResetPassword } from "../services";
import SimpleReactValidator from 'simple-react-validator';
import { newFormField, newValidationDescription } from "../helpers";
import { ReactComponent as IconInputWarning } from "../assets/images/ic_input_warning.svg";

export class ForgotPassword extends Component {

    constructor(props) {
        super(props)
        this.validator = new SimpleReactValidator();
        this.isSubmit = false;
        this.state = this.getInitState();
        this.onEmailChanged = this.onEmailChanged.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.checkValidEmail = this.checkValidEmail.bind(this);
    }

    getInitState() {
        return {
            email: newFormField(''),
            isSuccess: false,
        }
    }

    onEmailChanged(e) {
        this.setState({
            email: newFormField(e.target.value)
        });
    }

    checkValidEmail() {
        if (!this.validator.check(this.state.email.value, 'required|email')) {
            this.setState({
                email: newFormField(this.state.email.value, ['Địa chỉ email không hợp lệ'])
            })
            return false;
        }

        return true;
    }

    onSubmitClick() {
        if (this.isSubmit) return;
        if (!this.checkValidEmail())
            return;
        this.isSubmit = true;
        requestResetPassword(this.state.email.value)
            .then(result => {
                this.setState({
                    isSuccess: result.isSuccess
                });
            })
            .finally(() => {
                this.isSubmit = false;
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
                                <h1 className="Auth_heading">{this.state.isSuccess ? 'Vui lòng kiểm tra email' : 'Khôi phục mật khẩu'}</h1>
                                {this.state.isSuccess &&
                                    <section className="">
                                        <span>Chúng tôi đã gửi yêu cầu khôi phục mật khẩu tới <strong>{this.state.email.value}</strong>. Vui lòng kiểm tra email và làm theo hướng dẫn.</span>
                                    </section>
                                }
                                <ul className="Auth_loginWrapper">
                                    {!this.state.isSuccess &&
                                        <li className="Auth_form">
                                            <div className="TextInput_container" data-qa="mycv-email">
                                                <label className="Label_label">Email của bạn</label>
                                                <div className="Input_inputWrap">
                                                    <input placeholder="VD. example@online-ant.vn"
                                                        type="text"
                                                        name="email"
                                                        className={`Input_input Input_m ${!this.state.email.valid && 'Input_invalid'}`}
                                                        value={this.state.email.value}
                                                        onChange={this.onEmailChanged} />
                                                    {!this.state.email.valid &&
                                                        <span className="Input_errorIcon Input_iconContainer">
                                                            <IconInputWarning className="Input_icon" />
                                                        </span>
                                                    }
                                                </div>
                                                {!this.state.email.valid &&
                                                    <div className="FormField_errorMessage">Địa chỉ email không hợp lệ</div>
                                                }
                                            </div>
                                            <button className="Auth_btn Auth_btnSubmit" data-qa="submit" onClick={this.onSubmitClick}>Khôi phục mật khẩu</button>
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