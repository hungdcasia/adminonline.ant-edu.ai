import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import closeButton from "../assets/images/close-black.svg";
import { useState } from "react";
import { modalActions, userActions } from "../actions";
import { Avatar } from "../shared";
import { Link } from "react-router-dom";
import { history } from "../helpers";

const MoreMenuMobile = props => {
    let { authentication } = props;
    let [isShow, setIsShow] = useState(false)

    const logoutClick = () => {
        setIsShow(false);
        modalActions.show({
            title: 'Bạn muốn đăng xuất tài khoản?',
            onOk: () => {
                userActions.logout();
            }
        });
    }

    return (
        <div className="NavBar_iconWrapper NavBar_hiddenDesktop noselect">
            {/* <span onClick={() => setIsShow(true)}> */}
            <FontAwesomeIcon onClick={() => setIsShow(true)} className="fa-w-14 NavBar_icon lms-menu-label" icon={allIcon.faBars} />
            {/* </span> */}
            {isShow &&
                <div id="more-menu-mobile-id" className="MoreMenuMobileTablet_container">
                    <div className="MoreMenuMobileTablet_content">
                        <header>
                            <div className="MoreMenuMobileTablet_userWrapper">
                                <Avatar url={authentication.userInfomation?.avatar} className="MoreMenuMobileTablet_photo" />
                                <div className="MoreMenuMobileTablet_nameWrapper">
                                    <p className="MoreMenuMobileTablet_name">{authentication.userInfomation?.displayName}</p>
                                </div>
                            </div>
                            <span className="MoreMenuMobileTablet_closeBtn"
                                onClick={() => setIsShow(false)}>
                                <img src={closeButton} alt="Close button" />
                            </span>
                        </header>
                        <ul>
                            {!authentication.loggedIn &&
                                <>
                                    <li onClick={() => { history.login(); setIsShow(false); }}>
                                        <span className="MoreMenuMobileTablet_iconWrapper">
                                            <FontAwesomeIcon icon={allIcon.faSignInAlt} className='fa-w-18 MoreMenuMobileTablet_icon' />
                                        </span>
                                        <span className="MoreMenuMobileTablet_label">Đăng nhập</span>
                                    </li>
                                    <li onClick={() => { history.register(); setIsShow(false); }}>
                                        <span className="MoreMenuMobileTablet_iconWrapper">
                                            <FontAwesomeIcon icon={allIcon.faUserPlus} className='fa-w-18 MoreMenuMobileTablet_icon' />
                                        </span>
                                        <span className="MoreMenuMobileTablet_label">Đăng ký</span>
                                    </li>
                                </>
                            }
                            <li onClick={() => { history.push('/'); setIsShow(false); }}>
                                <span className="MoreMenuMobileTablet_iconWrapper">
                                    <FontAwesomeIcon icon={allIcon.faHome} className='fa-w-18 MoreMenuMobileTablet_icon' />
                                </span>
                                <span className="MoreMenuMobileTablet_label">Trang chủ</span>
                            </li>
                            <li onClick={() => { history.push('/courses'); setIsShow(false); }}>
                                <span className="MoreMenuMobileTablet_iconWrapper">
                                    <FontAwesomeIcon icon={allIcon.faBook} className='fa-w-14 MoreMenuMobileTablet_icon' />
                                </span>
                                <span className="MoreMenuMobileTablet_label">Khóa học</span>
                            </li>
                            <li onClick={() => { history.push('/live-schedules'); setIsShow(false); }}>
                                <span className="MoreMenuMobileTablet_iconWrapper">
                                    <FontAwesomeIcon icon={allIcon.faPlay} className='fa-w-14 MoreMenuMobileTablet_icon' />
                                </span>
                                <span className="MoreMenuMobileTablet_label">Live</span>
                            </li>
                            <li onClick={() => { history.push('/about-us'); setIsShow(false); }}>
                                <span className="MoreMenuMobileTablet_iconWrapper">
                                    <FontAwesomeIcon icon={allIcon.faInfoCircle} className='fa-w-14 MoreMenuMobileTablet_icon' />
                                </span>
                                <span className="MoreMenuMobileTablet_label">Giới thiệu</span>
                            </li>
                            <li onClick={() => { history.push('/about-us'); setIsShow(false); }}>
                                <span className="MoreMenuMobileTablet_iconWrapper">
                                    <FontAwesomeIcon icon={allIcon.faPhoneAlt} className='fa-w-14 MoreMenuMobileTablet_icon' />
                                </span>
                                <span className="MoreMenuMobileTablet_label">Liên hệ</span>
                            </li>
                            {/* <li>
                                <span className="MoreMenuMobileTablet_iconWrapper">
                                    <FontAwesomeIcon icon={allIcon.faAdjust} className='fa-w-16 MoreMenuMobileTablet_icon' />
                                </span>
                                <span className="MoreMenuMobileTablet_label">Giao diện tối</span>
                            </li> */}
                            {authentication.loggedIn &&
                                <>
                                    <li onClick={() => { history.push('/user/info'); setIsShow(false); }}>
                                        <span className="MoreMenuMobileTablet_iconWrapper">
                                            <FontAwesomeIcon icon={allIcon.faUser} className='fa-w-16 MoreMenuMobileTablet_icon' />
                                        </span>
                                        <span className="MoreMenuMobileTablet_label">Thông tin cá nhân</span>
                                    </li>
                                    <li onClick={() => { history.push('/user/courses'); setIsShow(false); }}>
                                        <span className="MoreMenuMobileTablet_iconWrapper">
                                            <FontAwesomeIcon icon={allIcon.faBookOpen} className='fa-w-16 MoreMenuMobileTablet_icon' />
                                        </span>
                                        <span className="MoreMenuMobileTablet_label">Khóa học của tôi</span>
                                    </li>
                                    <li onClick={() => { history.push('/user/settings'); setIsShow(false); }}>
                                        <span className="MoreMenuMobileTablet_iconWrapper">
                                            <FontAwesomeIcon icon={allIcon.faCog} className='fa-w-16 MoreMenuMobileTablet_icon' />
                                        </span>
                                        <span className="MoreMenuMobileTablet_label">Cài đặt chung</span>
                                    </li>
                                    <li onClick={logoutClick}>
                                        <span className="MoreMenuMobileTablet_iconWrapper">
                                            <FontAwesomeIcon icon={allIcon.faSignOutAlt} className='fa-w-1 MoreMenuMobileTablet_icon' />
                                        </span>
                                        <span className="MoreMenuMobileTablet_label">Đăng xuất</span>
                                    </li>
                                </>
                            }
                        </ul>
                    </div>
                </div>
            }
        </div>
    )
}

function mapStateToProps(state) {
    return { authentication: state.authentication };
}

const connectedPage = connect(mapStateToProps, {})(MoreMenuMobile);
export { connectedPage as MoreMenuMobile };