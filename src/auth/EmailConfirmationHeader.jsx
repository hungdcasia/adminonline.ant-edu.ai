import { connect } from 'react-redux';
import { userService } from '../services';
import React, { Component, useEffect, useState } from 'react';

// const WAIT_TO_RESEND = 11;
const WAIT_TO_RESEND = 180;
let remaining = WAIT_TO_RESEND;

const EmailConfirmationHeader = props => {
    let { needConfirmEmail, userInfomation } = props;
    let [canResendEmail, setCanResend] = useState(false);
    let [second, setSecond] = useState();

    const countDown = () => {
        if (!props.needConfirmEmail || remaining == 0)
            return;

        remaining = remaining - 1;
        setSecond(remaining);
        if (remaining == 0) {
            setCanResend(true);
        }
    }

    useEffect(() => {
        document.body.classList.add('needConfirmEmail');
        let timer = setInterval(countDown, 1000);
        return () => {
            document.body.classList.remove('needConfirmEmail');
            clearInterval(timer);
        }
    }, []);

    const resendEmail = () => {
        userService.resendConfirmEmail()
            .then(res => {

            })
            .finally(() => {
                remaining = WAIT_TO_RESEND;
                setCanResend(false);
            });
    }

    return (
        <aside className="HeaderMessage_wrapper HeaderMessage_error">
            <svg className="HeaderMessage_icon" width="20" height="20" viewBox="0 0 16 16">
                <path fill="currentColor" d="M7.5 11.001h1v1h-1v-1zm0-7h1V10h-1V4.001zM5.089 1L1 5.089v5.823L5.089 15h5.823L15 10.912V5.089L10.912 1H5.089z"></path>
            </svg>
            <p className="text-dark mb-0">
                Vui lòng kiểm tra email {userInfomation.email} và xác thực tài khoản (lưu ý: kiểm tra cả trong thư mục quảng cáo, thư rác.).
                    {canResendEmail ?
                    <span className="HeaderMessage_resend" onClick={resendEmail}> Gửi lại mail xác nhận</span> :
                    <span> {second}s</span>
                }
            </p>
        </aside>
    )
}

function mapStateToProps(state) {
    const { needConfirmEmail, userInfomation } = state.authentication;
    return { needConfirmEmail, userInfomation };
}

const actionCreators = {
};

const connectedPage = connect(mapStateToProps, actionCreators)(EmailConfirmationHeader);
export { connectedPage as EmailConfirmationHeader };