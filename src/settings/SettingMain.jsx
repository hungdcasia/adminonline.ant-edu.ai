import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Avatar } from "../shared";
import { history } from "../helpers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import { Router, Switch, Route, Link, NavLink, useRouteMatch } from "react-router-dom";
import { SettingHome, SettingAccount, ChangePassword, General } from "./index";
import { userService } from "../services";
import { alertActions } from "../actions";
import { useRef } from "react";
import { uploadService } from "../admin/services";
import { MyCoursesPage } from "./MyCourses";
import { useSelector } from "react-redux";
import { MyCertificatesPage } from "./MyCertificates";
import { PostDaily } from "../blog/PostDaily";
import { PostInterest } from "../blog/PostInterest";

const SettingMain = React.memo(function SettingMain(props) {
    window.gtag('event', 'page_view', {
        page_location: window.location
    })

    let authentication = useSelector(r => r.authentication);
    let { userInfomation } = authentication;
    let inputFile = useRef();
    useEffect(() => {
        if (!authentication.loggedIn) {
            history.replace('/');
        }
    }, [authentication]);


    const changeUserAvatar = (avatarUrl) => {
        let model = {
            displayName: userInfomation.displayName,
            gender: userInfomation.gender,
            dob: userInfomation.dob,
            phoneNumber: userInfomation.phone,
            avatar: avatarUrl
        };

        userService.updateInfomation(model)
            .then(res => {
                if (res.isSuccess) {
                    alertActions.success("Cập nhật thành công");
                }
            })
            .finally(() => {

            });
    };

    const onChangeImage = () => {
        inputFile.current.click();
    }

    const onSelectedFile = (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (event.target.files && event.target.files.length > 0) {
            var file = event.target.files[0];
            uploadService.uploadImage(file)
                .then(res => {
                    if (res.isSuccess) {
                        let avatar = uploadService.getImageUrl(res.data);
                        changeUserAvatar(avatar);
                    }
                }).finally(() => {
                    event.target.value = '';
                });
        }
    }

    return (
        <div>
            <div className="Setting_wrapper">
                <section className="container">
                    <section className="row Setting_container">
                        <section className="col-md-4 col-lg-4">
                            <section className="SideBar_wrapper mt-3">
                                <section className="SideBar_userInfo">
                                    <div className='SideBar_avatar'>
                                        <Avatar url={userInfomation?.avatar} className='SideBar_image' alt='User Avatar' />
                                        <div className='edit-avatar'>
                                            <input type='file' id='file' ref={inputFile}
                                                onChange={onSelectedFile}
                                                accept="image/png, image/jpeg, image/svg, image/jpg"
                                                style={{ display: 'none' }} />
                                            <FontAwesomeIcon icon={allIcon.faEdit}
                                                transform={{ size: 14 }}
                                                onClick={onChangeImage} />
                                        </div>
                                    </div>
                                    <h3>{userInfomation?.displayName}</h3>
                                </section>
                            </section>
                            <div className='mt-5 d-none d-md-block'>
                                <div className='py-2'>
                                    <MenuItem to='/user/courses' className='my-1 w-100'>
                                        <span className=''><FontAwesomeIcon icon={allIcon.faBookOpen} className='w-40px text-left' /> Khóa học của tôi</span>
                                    </MenuItem>
                                </div>
                                <div className='py-2 d-none'>
                                    <MenuItem to='/user/history' className='my-1 w-100'>
                                        <span className=''><FontAwesomeIcon icon={allIcon.faHistory} className='w-40px text-left' /> Lịch sử bài học</span>
                                    </MenuItem>
                                </div>
                                <div className='py-2 d-none'>
                                    <MenuItem to='/user/live' className='my-1 w-100'>
                                        <span className=''><FontAwesomeIcon icon={allIcon.faLifeRing} className='w-40px text-left' /> Hội thảo trực tuyến</span>
                                    </MenuItem>
                                </div>
                                <div className='py-2 d-none'>
                                    <MenuItem to='/user/new-feature' className='my-1 w-100'>
                                        <span className=''><FontAwesomeIcon icon={allIcon.faLifeRing} className='w-40px text-left' /> Tính năng mới</span>
                                    </MenuItem>
                                </div>
                                <div className='py-2'>
                                    <MenuItem to='/user/info' className='my-1 w-100'>
                                        <span className=''><FontAwesomeIcon icon={allIcon.faUser} className='w-40px text-left' /> Thông tin cá nhân</span>
                                    </MenuItem>
                                </div>

                                <div className='py-2'>
                                    <MenuItem to='/user/change-password' className='my-1 w-100'>
                                        <span><FontAwesomeIcon icon={allIcon.faKey} className='w-40px text-left' /> Đổi mật khẩu</span>
                                    </MenuItem>
                                </div>
                                <div className='py-2 d-none'>
                                    <MenuItem to='/user/certificates' className='my-1 w-100'>
                                        <span className=''><FontAwesomeIcon icon={allIcon.faGraduationCap} className='w-40px text-left' /> Chứng chỉ của tôi</span>
                                    </MenuItem>
                                </div>
                            
                                <div className='py-2'>
                                    <MenuItem to='/user/settings' className='my-1 w-100'>
                                        <span className=''><FontAwesomeIcon icon={allIcon.faCog} className='w-40px text-left' /> Cài đặt chung</span>
                                    </MenuItem>
                                </div>
                                <div className='py-2 d-none'>
                                    <MenuItem to='/help' className='my-1 w-100'>
                                        <span className=''><FontAwesomeIcon icon={allIcon.faAmbulance} className='w-40px text-left' /> Help</span>
                                    </MenuItem>
                                </div>
                            </div>
                            {/* <div className="mt-3">
                                <PostDaily />
                            </div> */}
                        </section>
                        <section className="col-sm-12 col-md-8 col-lg-8">
                            <div className="d-none">
                                <PostInterest />
                            </div>
                            <Switch>
                                <Route path='/user/certificates' exact component={MyCertificatesPage} />
                                <Route path='/user/courses' exact component={MyCoursesPage} />
                                <Route path='/user/info' exact component={SettingAccount} />
                                <Route path='/user/change-password' exact component={ChangePassword} />
                                <Route path='/user/settings' exact component={General} />
                            </Switch>
                        </section>
                    </section>
                </section>
            </div>
        </div >
    )
})

const MenuItem = React.memo(function MenuItem({ to, className, children }) {
    let match = useRouteMatch(to);
    return (
        <Link className={className + ` menu-item ${match != null && 'active'}`} to={to}>
            {children}
        </Link>
    )
})

export { SettingMain };