import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink, withRouter } from "react-router-dom";
import queryString from 'query-string';
import SuccessIcon from "../assets/images/success.svg";
import ErrorIcon from "../assets/images/error.svg";
import { userService } from "../services";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export class EmailConfirmation extends Component {
    constructor(props) {
        super(props)
        let params = queryString.parse(this.props.location.search);
        this.state = {
            token: params.u,
            isLoading: true,
            isSuccess: false
        };
        this.confirmEmail = this.confirmEmail.bind(this);
    }

    componentDidMount() {
        this.confirmEmail();
    }

    confirmEmail() {
        if (this.state.token == null || this.state.token == '') {
            this.setState({
                isLoading: false
            });
            return;
        }

        userService.confirmEmail(this.state.token)
            .then(res => {
                this.setState({
                    isSuccess: res.isSuccess
                });
            })
            .finally(() => {
                this.setState({
                    isLoading: false
                });
            });
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
                                <h1 className="Auth_heading">Xác minh tài khoản</h1>
                                {this.state.isLoading ?
                                    <div className='text-center'>
                                        <FontAwesomeIcon className='fa-spin h3' icon={allIcon.faSpinner} />
                                    </div> :
                                    <section className={`${this.state.isSuccess ? '' : 'Auth_error'}`}>
                                        <span className="Auth_statusIcon">
                                            <img style={{ width: '15px' }} className='mr-1' src={this.state.isSuccess ? SuccessIcon : ErrorIcon} />
                                        </span>
                                        {this.state.isSuccess ? 'Xác minh thành công. Bạn chính thức là thành viên của Online Ant ❤️' :
                                            'Liên kết đã hết hạn. Nếu tài khoản của bạn chưa được xác thực, vui lòng đăng nhập và gửi lại email xác minh.'}
                                    </section>
                                }
                                <a href='/'>
                                    <button className="Auth_btn Auth_btnSubmit" data-qa="submit" style={{ marginTop: "24px" }}>Tới trang chủ</button>
                                </a>
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