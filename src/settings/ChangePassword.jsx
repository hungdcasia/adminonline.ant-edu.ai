import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { BackButton } from "./BackButton";
import { Link } from "react-router-dom";
import { newFormField, useFormField, newValidationDescription, history } from "../helpers";
import { ReactComponent as Show_password_icon } from "../assets/images/show_password.svg";
import { ReactComponent as Hide_password_icon } from "../assets/images/hide_password.svg";
import SimpleReactValidator from 'simple-react-validator';
import { PasswordInput } from "../shared/forms";
import { userService } from "../services";
import { userActions, alertActions } from "../actions";
import { useSelector } from "react-redux";

const validator = new SimpleReactValidator();
const ChangePassword = props => {
    window.gtag('event', 'page_view', {
        page_location: window.location
    })
    let authentication = useSelector(r => r.authentication);

    let [password] = useFormField({ value: '' })
    let [newPassword] = useFormField({
        value: '',
        rules: [
            { rule: 'required|min:6', message: 'Sử dụng ít nhất 6 ký tự' }
        ]
    });
    let [retypePassword] = useFormField({
        value: '',
        customRule: () => {
            if (newPassword.value != retypePassword.value) {
                return ['Mật khẩu mới không khớp. Vui lòng kiểm tra lại'];
            }
            return [];
        }
    });

    const onSubmit = () => {
        let invalid = [password.checkValid(), newPassword.checkValid(), retypePassword.checkValid()].some(item => !item);
        if (!invalid) {
            userService.changePassword({
                "currentPassword": password.value,
                "newPassword": newPassword.value
            }).then(res => {
                if (res.isSuccess) {
                    alertActions.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
                    setTimeout(function () {
                        userActions.logout();
                    }.bind(this), 3000)
                }
            });
        }
    };

    return (
        <section className="">
            <section className="">
                {/* <BackButton /> */}
                <section className="">
                    <h1 className="">Đổi mật khẩu</h1>
                </section>
                <section className="">
                    <section className=''>
                        <PasswordInput field={password}
                            label='Mật khẩu hiện tại'
                            name='password' />

                        {/* <section><Link to='/forgot-password' className="ChangePassword_forgotLink">Quên mật khẩu?</Link></section> */}
                        <br />
                        <br />
                        <PasswordInput field={newPassword}
                            label='Mật khẩu mới'
                            name='newPassword' />

                        <PasswordInput field={retypePassword}
                            label='Nhập lại mật khẩu mới'
                            name='retypePassword' />

                        <section className="">
                            <div className="btn btn-default border-0 float-right"
                                onClick={onSubmit}>
                                <div className="base_inner sizes_inner"><span className="base_text">Cập nhật</span></div>
                            </div>
                        </section>
                    </section>
                </section>
            </section>
        </section>
    )
}

export { ChangePassword };