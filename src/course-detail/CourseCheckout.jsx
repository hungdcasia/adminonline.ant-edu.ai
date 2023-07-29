import React, { Component, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import * as allBrandIcon from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { NumberHelpers, UrlHelpers, useForm, useFormField } from "../helpers";
import { courseService, userService } from "../services";
import { PurchaseBadge } from "./PurchaseBadge";
import { CourseComment } from "./CourseComment";
import { CourseWillLearn } from "./CourseWillLearn";
import { Preview } from "./Preview";
import { CourseRequire } from "./CourseRequire";
import Moment from 'react-moment';
import moment from 'moment';
import { history } from "../helpers";
import { NoData, Modal } from "../shared";
import { TextInput } from "../shared/forms";
import { alertActions, modalActions } from "../actions";
import { connect, useSelector } from "react-redux";
import * as allShareButton from "react-share";
// import ic_bank_transfer from "../assets/images/ic_bank_transfer.png";
import ReCAPTCHA from 'react-google-recaptcha';
import { store } from "../helpers";
let ic_bank_transfer = "/assets/images/ic_bank_transfer.png"
const PaymentMethod = {
    BANK: 'bank',
    MOMO: 'momo'
}

const CourseCheckout = props => {

    const authentication = useSelector(state => state.authentication);
    const { loggedIn, needConfirmEmail, userInfomation } = authentication;

    let courseId = props.match.params.id;
    let [course, setCourse] = useState();
    let [contactName] = useFormField({
        value: userInfomation?.displayName ?? '',
        rules: [
            { rule: 'required', message: 'Vui lòng nhập thông tin' }
        ]
    });

    let [contactEmail] = useFormField({
        value: userInfomation?.email ?? '',
        rules: [
            { rule: 'required|email', message: 'Vui lòng nhập email' }
        ]
    });

    let [contactPhone] = useFormField({
        value: userInfomation?.phoneNumber ?? ''
    });

    let [captchaToken, setCaptchaToken] = useState();
    let [isConfirm, setIsConfirm] = useState(false);
    let [paymentMethod, setPaymentMethod] = useState(PaymentMethod.BANK);
    let [order, setOrder] = useState();

    let [formFields] = useForm([contactName, contactEmail, contactPhone]);

    useEffect(() => {
        if (!loggedIn || needConfirmEmail) {
            history.push("/");
            return;
        }
        courseService.getCourseDetail(courseId)
            .then(res => {
                if (res.isSuccess) {
                    if (res.data.userCourse == null) {
                        setCourse(res.data.course);
                        return;
                    }
                }
                history.push('/');
            });

        courseService.getCourseCheckout(courseId)
            .then(res => {
                if (res.isSuccess && res.data != null) {
                    setOrder(res.data)
                    setIsConfirm(true)
                }
            })
    }, []);

    const confirmClicked = () => {
        if (formFields.valid()) {
            courseService.courseCheckout(courseId, contactName.value, contactEmail.value, contactPhone.value, captchaToken)
                .then(res => {
                    if (res.isSuccess) {
                        setIsConfirm(true);
                        setOrder(res.data);
                    }
                });
        }
    };

    if (course == null) {
        return (<div></div>)
    }

    return (
        <section className="App_wrapper">
            <section className="container App_appContainer">
                <section className="row CourseDetail_wrapper">
                    <section className="col-12">
                        <ul className="CourseDetail_breadcrumb">
                            <li>
                                <Link to="/">Trang chủ</Link>
                                <FontAwesomeIcon icon={allIcon.faChevronRight} className="fa-w-10 CourseDetail_icon" />
                            </li>
                            <li><Link to={window.location.pathname}>Thanh toán</Link></li>
                        </ul>
                    </section>
                    <section className="col-md-12 col-lg-2"></section>
                    <section className="col-md-12 col-lg-8 CourseDetail_purchaseBadge">
                        <div className="checkout-info-wrapper" style={{ width: '100%', marginTop: '30px' }}>
                            <div className='jss29'>Xác nhận thanh toán</div>
                            <div className="checkout-info" aria-label="main">
                                <li className="checkout-info-item">
                                    <div className="checkout-info-label-left">Khóa học</div>
                                    <div className="checkout-info-label-right">{course.name}</div>
                                </li>
                                <li className="checkout-info-separator" role="separator"></li>
                                <li className="checkout-info-item">
                                    <div className="checkout-info-label-left">Giá gốc</div>
                                    <div className="checkout-info-label-right">{NumberHelpers.toDefautFormat(order == null ? course.originPrice : order.originPrice)} đ</div>
                                </li>
                                <li className="checkout-info-separator" role="separator"></li>
                                <li className="checkout-info-item">
                                    <div className="checkout-info-label-left">Giảm giá</div>
                                    <div className="checkout-info-label-right">{NumberHelpers.toDefautFormat(order == null ? course.originPrice - course.price : order.originPrice - order.price)} đ</div>
                                </li>
                                <li className="checkout-info-separator" role="separator"></li>
                                {/* <li className="checkout-info-item">
                                        <div className="checkout-info-label-left">Mã giảm giá</div>
                                        <div className="checkout-info-label-right">Không áp dụng</div>
                                    </li>
                                    <li className="checkout-info-separator" role="separator"></li> */}
                                {/* <li className="checkout-info-item">
                                        <div className="checkout-info-label-left">Phương thức thanh toán</div>
                                        <div className="checkout-info-label-right">MOMO Wallet</div>
                                    </li>
                                    <li className="checkout-info-separator" role="separator"></li> */}
                                <li className="checkout-info-item checkout-info-result">
                                    <div>Tổng giá trị</div>
                                    <div>{NumberHelpers.toDefautFormat(order == null ? course.price : order.price)} đ</div>
                                </li>
                            </div>
                        </div>
                        <div className='checkout-separator'></div>
                        <div className="checkout-step w-100 mb-5">
                            <div className='jss29 mb-1'>Các bước thanh toán</div>
                            <span className='mr-2'>1. Điền thông tin liên hệ</span>
                            <span className='mr-2'><FontAwesomeIcon icon={allIcon.faArrowRight} /></span>
                            <span className='mr-2'>2. Chuyển khoản</span>
                            <span className='mr-2'><FontAwesomeIcon icon={allIcon.faArrowRight} /></span>
                            <span className='mr-2'>3. Online Ant kiểm tra, mở tài khoản</span>
                            <span className='mr-2'><FontAwesomeIcon icon={allIcon.faArrowRight} /></span>
                            <span>4. Bắt đầu học</span>
                        </div>
                        <div className="checkout-contact-infomation  w-100">
                            <div className='jss29'>Thông tin liên hệ</div>
                            <div className="jss28">
                                <div className="jss30">
                                    <TextInput field={contactName}
                                        rawProps={{ placeholder: 'Họ và tên', readOnly: isConfirm }}
                                        label='Họ và tên'
                                        required
                                        name='contactName' />
                                    <TextInput field={contactEmail}
                                        rawProps={{ placeholder: 'email', readOnly: isConfirm }}
                                        label='Email'
                                        required
                                        name='contactEmail' />
                                    <TextInput field={contactPhone}
                                        rawProps={{ placeholder: 'Số điện thoại', readOnly: isConfirm }}
                                        label='Số điện thoại'
                                        name='contactPhone' />
                                    <div className="TextInput_container">
                                        {!isConfirm &&
                                            <ReCAPTCHA sitekey={process.env.REACT_APP_CaptchaKey}
                                                onChange={setCaptchaToken} />
                                        }
                                    </div>
                                    {!isConfirm &&
                                        <section className="ChangeUserInfo_submitWrapper" style={{ justifyContent: 'center' }}>
                                            <button className="ranks_primary base_button sizes_l Header_btn tooltip_tooltip" type="button" disabled={!captchaToken}
                                                onClick={confirmClicked}>
                                                <div className="base_inner sizes_inner"><span className="base_text">Xác nhận</span>
                                                </div>
                                            </button>
                                        </section>
                                    }
                                </div>
                            </div>
                        </div>
                        {isConfirm &&
                            <div className="CurriculumOfCourse_curriculumOfCourse" style={{ width: '100%' }}>
                                <div className="jss28">
                                    <div className="jss29">Phương thức thanh toán</div>
                                    <div className="jss30">
                                        <div>
                                            {/* <ul className="MuiList-root jss298 MuiList-padding">
                                                <div className="jss279">
                                                    <li className="MuiListItem-root jss280 MuiListItem-gutters MuiListItem-alignItemsFlexStart">
                                                        <div className="MuiListItemAvatar-root MuiListItemAvatar-alignItemsFlexStart" style={{ marginTop: "10px", minWidth: '50px' }}>
                                                            <div className="MuiAvatar-root MuiAvatar-circle jss300 MuiAvatar-colorDefault" style={{ borderRadius: '0px' }}><img alt="payment" className="jss301" src="https://cdn2.topica.vn/22886f7c-607d-4e28-9443-7fc586c865c6/product/5fe9c4a644d203002598b55a" /></div>
                                                        </div>
                                                        <div className="MuiListItemText-root MuiListItemText-multiline">
                                                            <p className="MuiTypography-root jss281">MOMO Wallet</p>
                                                            <span className="MuiTypography-root jss283 MuiTypography-body2">Thanh toán nhanh trong 5 giây bằng cách dùng ứng dụng Momo quét mã QR</span>
                                                        </div>
                                                    </li>
                                                    <div className="MuiListItemSecondaryAction-root jss284">
                                                        <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <li className="MuiDivider-root jss282 MuiDivider-inset" role="separator"></li>
                                            </ul>
                                            <ul className="MuiList-root jss298 MuiList-padding">
                                                <div className="jss279">
                                                    <li className="MuiListItem-root jss280 MuiListItem-gutters MuiListItem-alignItemsFlexStart">
                                                        <div className="MuiListItemAvatar-root MuiListItemAvatar-alignItemsFlexStart" style={{ marginTop: "10px", minWidth: '50px' }}>
                                                            <div className="MuiAvatar-root MuiAvatar-circle jss300 MuiAvatar-colorDefault" style={{ borderRadius: '0px' }}><img alt="payment" className="jss301" src="https://cdn2.topica.vn/22886f7c-607d-4e28-9443-7fc586c865c6/product/5fe9c4a444d203002598b556" /></div>
                                                        </div>
                                                        <div className="MuiListItemText-root MuiListItemText-multiline">
                                                            <p className="MuiTypography-root jss281">Thanh toán bằng thẻ Visa, Master, JCB,..</p>
                                                            <span className="MuiTypography-root jss283 MuiTypography-body2">Hỗ trợ thẻ debit và credit (Visa, Mastercard, JCB) thông qua cổng thanh toán Onepay</span>
                                                        </div>
                                                    </li>
                                                    <div className="MuiListItemSecondaryAction-root jss284">
                                                        <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <li className="MuiDivider-root jss282 MuiDivider-inset" role="separator"></li>
                                            </ul> */}
                                            <ul className="MuiList-root jss298 MuiList-padding">
                                                <div className="jss279">
                                                    <li className="MuiListItem-root jss280 MuiListItem-gutters MuiListItem-alignItemsFlexStart">
                                                        <div className="MuiListItemAvatar-root MuiListItemAvatar-alignItemsFlexStart" style={{ marginTop: "10px", minWidth: '50px' }}>
                                                            <div className="MuiAvatar-root MuiAvatar-circle jss300 MuiAvatar-colorDefault" style={{ borderRadius: '0px' }}><img alt="payment" className="jss301" src={ic_bank_transfer} /></div>
                                                        </div>
                                                        <div className="MuiListItemText-root MuiListItemText-multiline">
                                                            <p className="MuiTypography-root jss281">Chuyển khoản</p>
                                                            <span className="MuiTypography-root jss283 MuiTypography-body2">Hỗ trợ thẻ ATM tất cả các ngân hàng Việt Nam: Vietcombank, BIDV, Techcombank, VP Bank...</span>
                                                        </div>
                                                    </li>
                                                    <div className="MuiListItemSecondaryAction-root jss284">
                                                        <svg className="MuiSvgIcon-root jss285" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>
                                                    </div>
                                                </div>
                                                <li className="MuiDivider-root jss282 MuiDivider-inset" role="separator"></li>
                                            </ul>
                                        </div>
                                        {/* <div className="jss286">
                                            <button className="MuiButtonBase-root MuiButton-root MuiButton-contained jss287 MuiButton-containedPrimary" tabindex="0" type="button" title="Save" id="proceedBtn">
                                                <span className="MuiButton-label">Tiếp theo</span>
                                                <span className="MuiTouchRipple-root"></span>
                                            </button>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        }

                        {(isConfirm && paymentMethod == PaymentMethod.BANK) &&
                            <div className="checkout-info-wrapper" style={{ width: '100%', marginTop: '30px' }}>
                                <div className='jss29'>Thông tin chuyển khoản</div>
                                {bankTransferInfor.map((bankInfo, index) => (
                                    <React.Fragment key={index}>
                                        <div className="checkout-info" aria-label="main">
                                            <li className="checkout-info-item">
                                                <div className="checkout-info-label-left">Ngân hàng</div>
                                                <div className="checkout-info-label-right checkout-info-label-bold">{bankInfo.bankName}</div>
                                            </li>
                                            <li className="checkout-info-separator" role="separator"></li>
                                            <li className="checkout-info-item">
                                                <div className="checkout-info-label-left">Tên tài khoản</div>
                                                <div className="checkout-info-label-right checkout-info-label-bold">{bankInfo.accountName}</div>
                                            </li>
                                            <li className="checkout-info-separator" role="separator"></li>
                                            <li className="checkout-info-item">
                                                <div className="checkout-info-label-left">Số tài khoản</div>
                                                <div className="checkout-info-label-right checkout-info-label-bold">{bankInfo.accountNumber}</div>
                                            </li>
                                            <li className="checkout-info-separator" role="separator"></li>
                                            <li className="checkout-info-item">
                                                <div className="checkout-info-label-left">Nội dung</div>
                                                <div className="checkout-info-label-right checkout-info-label-bold">THANH TOAN KH00{order?.id}</div>
                                            </li>
                                            <li className="checkout-info-separator" role="separator"></li>
                                        </div>
                                        {index < bankTransferInfor.length - 1 &&
                                            <div className="checkout-info" aria-label="main">
                                                <div className="checkout-info-label-or checkout-info-label-bold" style={{}}>Hoặc</div>
                                            </div>
                                        }
                                    </React.Fragment>
                                ))}

                                <div className="checkout-note mt-2">
                                    <p>Ngay sau khi nhận được tiền, chúng tôi sẽ kích hoạt mở khóa học cho bạn.<br />
                                        <span>Mọi thắc mắc hoặc câu hỏi, mời các bạn liên hệ.
                                            <br />
                                            <span className='ml-1'>- Hotline hỗ trợ của Online Ant: <a href="tel:0964868539"> 0964868539</a></span>
                                            <br />
                                            <span className='ml-1'>- Email: <a href="mailto:info@online-ant.edu.vn"> info@online-ant.edu.vn</a></span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        }
                    </section>
                </section>
            </section>
        </section>
    );
}

const bankTransferInfor = [
    {
        bankName: 'Ngân hàng thương mại và cổ phần Quân đội - CN Trần Duy Hưng',
        accountName: 'CÔNG TY TNHH ĐẦU TƯ VÀ PHÁT TRIỂN ĐÀO TẠO NEWTALK. (NEWTALK, CO)',
        accountNumber: '82611 666 88888'
    },
    {
        bankName: 'NH thương mại cổ phần Á Châu (ACB) – CN Hà Nội',
        accountName: 'CÔNG TY TNHH ĐẦU TƯ VÀ PHÁT TRIỂN ĐÀO TẠO NEWTALK. (NEWTALK, CO)',
        accountNumber: '78913 666 888'
    },
    {
        bankName: 'NH TMCP Đầu tư và phát triển Việt Nam (BIDV) – CN Hà Tây',
        accountName: 'CÔNG TY TNHH ĐẦU TƯ VÀ PHÁT TRIỂN ĐÀO TẠO NEWTALK. (NEWTALK, CO)',
        accountNumber: '45010005137639'
    }
]



function mapStateToProps(state) {
    const { authentication } = state;
    const { loggedIn, needConfirmEmail } = authentication;
    return { loggedIn, needConfirmEmail };
}

const actionCreators = {
};

const connectedPage = connect(mapStateToProps, actionCreators)(CourseCheckout);

export { connectedPage as CourseCheckout }