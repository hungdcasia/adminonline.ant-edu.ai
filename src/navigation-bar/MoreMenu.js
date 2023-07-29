import React, { Component } from 'react';
import { Link, Switch, Route } from "react-router-dom";
import { connect, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faBell, faCaretDown, faBars, faAdjust, faCog, faSignOutAlt, faTools, faMoon, faSun, faUser } from '@fortawesome/free-solid-svg-icons';
import { history } from '../helpers';
import { userActions, modalActions } from '../actions';
import { toggleTheme, useTheme } from '../helpers/theme.helpers';
import { themeConst } from '../constants';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react';

const MoreMenu = () => {
    let theme = useSelector(state => state.themeState)
    let [toggleTheme] = useTheme();
    let authentication = useSelector(r => r.authentication)
    const logoutClick = () => {
        modalActions.show({
            title: 'Bạn muốn đăng xuất tài khoản?',
            onOk: () => {
                userActions.logout();
            }
        });
    }

    let isAdmin = authentication.loggedIn && authentication.userInfomation?.roles?.length
    return (
        <div className="NavBar_iconWrapper NavBar_visibleDesktop noselect">
            <CDropdown
                className=""
                direction="down"
            >
                <CDropdownToggle className="c-header-nav-link" caret={false}>
                    <FontAwesomeIcon className="fa-w-14 NavBar_icon lms-menu-icon" icon={faCaretDown} />
                </CDropdownToggle>
                <CDropdownMenu placement="bottom-end">
                    {isAdmin == true &&
                        <CDropdownItem to='/admin' className="text-dark dropdown-item">
                            <FontAwesomeIcon className="fa-w-16 MoreMenu_icon mr-2" icon={faTools} />
                            <span>Admin</span>
                        </CDropdownItem>
                    }
                    <CDropdownItem onClick={() => toggleTheme()} className="text-dark">
                        <FontAwesomeIcon className="fa-w-16 MoreMenu_icon mr-2" icon={theme.name == themeConst.dark ? faSun : faMoon} />
                        <span>{theme.name == themeConst.dark ? 'Giao diện sáng' : 'Giao diện tối'}</span>
                    </CDropdownItem>
                    <Link to='/user/info' className="text-dark dropdown-item">
                        <FontAwesomeIcon className="fa-w-16 MoreMenu_icon mr-2" icon={faUser} />
                        <span>Thông tin cá nhân</span>
                    </Link>
                    <Link to='/user/courses' className="text-dark dropdown-item">
                        <FontAwesomeIcon className="fa-w-16 MoreMenu_icon mr-2" icon={faBookOpen} />
                        <span>Khóa học của tôi</span>
                    </Link>
                    <Link to='/user/settings' className="text-dark dropdown-item">
                        <FontAwesomeIcon className="fa-w-16 MoreMenu_icon mr-2" icon={faCog} />
                        <span>Cài đặt chung</span>
                    </Link>
                    <CDropdownItem onClick={logoutClick} className="text-dark">
                        <FontAwesomeIcon className="fa-w-16 MoreMenu_icon mr-2" icon={faSignOutAlt} />
                        <span>Đăng xuất</span>
                    </CDropdownItem>
                </CDropdownMenu>
            </CDropdown>
        </div>
    )
}

export { MoreMenu };