import React, { Component, useEffect, useState } from 'react';
import { Link, Switch, Route } from "react-router-dom";
import { connect, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faBell, faCaretDown, faBars, faAdjust, faCog, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { history } from '../helpers';
import { userActions } from '../actions';
import { MoreMenu, MyCourses, MoreMenuMobile } from './';
import { Avatar } from "../shared";
let logo = "/assets/images/logo-ant-edu.png";
const NavigationBar = () => {
    return (
        <Switch>
            <Route path='/register'>
            </Route>
            <Route path='/login'>
            </Route>
            <Route path='/reset-password'>
            </Route>
            <Route path='/forgot-password'>
            </Route>
            <Route path='/learning'>
            </Route>
            <Route path='/email-confirmation' />
            <Route path='/assessment' />
            <AppNavBar />
        </Switch>
    )
}

const AppNavBar = props => {
    let authentication = useSelector(r => r.authentication)
    const [isTop, setIsTop] = useState(true);

    useEffect(() => {
        window.onscroll = () => {
            setIsTop(window.pageYOffset == 0)
        };
    }, []);
    let isAdmin = authentication.loggedIn && authentication.userInfomation?.roles?.length
    return (
        <header id="lms-menu-animate-tricky" className={`lms-menu ${isTop ? 'lms-menu-ontop' : ''} lms-menu-animate`}>
            <div id="" className='lsm-menu-wrapper'>
                <nav id="" className='lsm-menu-nav'>
                    <Link to="/" id="">
                        <img src={logo}
                            alt="Trang chủ"
                            className='lms-menu-logo' style={{objectFit: "contain"}}/>
                    </Link>
                    <ul className='lsm-menu-left lms-nav-visibleDesktop' >
                        {/* <li>
                            <Link to="/" id="">Trang chủ</Link>
                        </li> */}
                        {authentication.loggedIn &&
                            <li>
                                <Link to="/user/courses" id="">Khóa học của tôi</Link>
                            </li>
                        }
                        {/* <li>
                            <Link to="/about-us">Giới thiệu</Link>
                        </li>
                        <li>
                            <Link to="/contact" id="">Liên hệ</Link>
                        </li>
                        <li>
                            <Link to="/live-schedules" id="">Live</Link>
                        </li>
                        <li>
                            <Link to="/books" id="">Sách</Link>
                        </li> */}
                    </ul>
                    <UserNav />
                </nav>
            </div>
        </header>
    )
}

const UserNav = (props) => {
    const authentication = useSelector(r => r.authentication)
    const { userInfomation, loggedIn } = authentication;
    return (
        <div className="NavBar_userWrapper">
            {loggedIn && <>
                <Avatar url={userInfomation?.avatar} className="NavBar_photo lms-menu-avatar NavBar_visibleDesktop" />
                <div className="NavBar_nameWrapper NavBar_visibleDesktop">
                    <p className="NavBar_name lms-menu-label">{userInfomation?.displayName}</p>
                </div>
                <div className="NavBar_separate NavBar_visibleDesktop"></div>
            </>}
            <div className="NavBar_notifyWrapper">
                {!loggedIn &&
                    <Link to="/login"
                        onClick={(e) => { e.preventDefault(); history.login(); }}
                        className='lms-nav-visibleDesktop lms-menu-label'><FontAwesomeIcon icon={faUser} /> Đăng nhập
                    </Link>
                }
                {loggedIn &&
                    <>
                        <MyCourses />
                        <MoreMenu />
                    </>
                }
                <MoreMenuMobile />
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
    };
}

const actionCreators = {
    logout: userActions.logout
};

const connectedPage = connect(mapStateToProps, actionCreators)(NavigationBar);
export { connectedPage as NavigationBar };