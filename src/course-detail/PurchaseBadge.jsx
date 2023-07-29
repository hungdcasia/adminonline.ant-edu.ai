import React, { Component, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { history, NumberHelpers, UrlHelpers } from "../helpers/index";
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import * as allBrandIcon from '@fortawesome/free-brands-svg-icons';
import Moment from 'react-moment';
import moment from 'moment';
import { LessonVideoPlayer } from "../learning";
import { connect } from 'react-redux';
import { Modal } from "../shared";
import ReactPlayer from 'react-player/lazy';
// import ic_course_length from "../assets/images/ic_course_length.png";
// import ic_lessons_count from "../assets/images/ic_lessons_count.png";
// import ic_battery from "../assets/images/ic_battery.png";
import { Preview } from './Preview';
import { CModal, CModalBody } from '@coreui/react';
let ic_battery = "/assets/images/ic_battery.png";
let ic_course_length = "/assets/images/ic_course_length.png";
let ic_lessons_count = "/assets/images/ic_lessons_count.png";
const PurchaseBadge = ({ course, lessons, isRegistered, registerClicked }) => {

    let [showPreview, setShowPreview] = useState(false)
    const getLessonNumber = () => {
        const totalLessons = lessons.length;
        return totalLessons;
    }

    const getDurationNumber = () => {
        const totalTime = lessons.reduce((total, lesson) => total + lesson.timeLength, 0);
        return totalTime;
    }

    const start = moment().add(0 - getDurationNumber(), 's');
    let discount = course.originPrice - course.price;
    return (
        <>
            {showPreview &&
                <CModal show={showPreview} onClose={() => setShowPreview(false)} size='xl'>
                    <CModalBody className='p-0'>
                        <Preview course={course} onClose={() => setShowPreview(false)} url={course.introVideo} />
                    </CModalBody>
                </CModal>
            }
            <div className="CourseDetail_purchaseBadge d-none d-lg-flex">
                <div onClick={() => setShowPreview(true)} className="CourseDetail_imgPreview">
                    {course.introVideo != null && course.introVideo != '' &&
                        <>
                            <div className="CourseDetail_iconPlay" style={{ position: 'absolute' }}>
                                <FontAwesomeIcon icon={allBrandIcon.faYoutube} className='fa-3x' />
                            </div>
                            <p>Xem giới thiệu khóa học</p>
                        </>
                    }
                    <div className="CourseDetail_bg" style={{ backgroundImage: `url('${course.thumbnailImage}')` }}></div>
                </div>

                {isRegistered &&
                    <p className="CourseDetail_registered">Bạn đã đăng ký khóa học này!</p>
                }
                {/* {!isRegistered &&
                    <h5 style={{ marginTop: 0 }}>{course.price > 0 ? `${NumberHelpers.toDefautFormat(course.price)} đ` : 'Học phí tùy tâm'}</h5>
                } */}

                {(!isRegistered && discount > 0) &&
                    <span className='CourseDetail_discount'>{`${NumberHelpers.toDefautFormat(course.originPrice)} đ`}</span>
                }

                {lessons.length > 0 &&
                    <button className="CourseDetail_learnNow" onClick={registerClicked}>
                        {isRegistered ? 'HỌC TIẾP' : 'đăng ký học'}
                    </button>
                }

                <ul>
                    <li>
                        <img src={ic_course_length} className='CourseDetail_icon' style={{ width: '16px', height: '16px' }} />
                        <span>Tổng số <strong>{getLessonNumber()}</strong> bài học</span>
                    </li>
                    <li>
                        <img src={ic_lessons_count} className='CourseDetail_icon' style={{ width: '16px', height: '16px' }} />
                        <span>Thời lượng <strong>{moment.duration(getDurationNumber(), 'seconds').format("hh [giờ] mm [phút]")}</strong></span>
                    </li>
                    <li>
                        <img src={ic_battery} className='CourseDetail_icon' style={{ width: '16px', height: '16px' }} />
                        <span>Học mọi lúc, mọi nơi</span>
                    </li>
                </ul>
            </div>
        </>
    );
}

const PurchaseBadgeMobile = ({ course, lessons, isRegistered, registerClicked }) => {

    let [showPreview, setShowPreview] = useState(false)
    const getLessonNumber = () => {
        const totalLessons = lessons.length;
        return totalLessons;
    }

    const getDurationNumber = () => {
        const totalTime = lessons.reduce((total, lesson) => total + lesson.timeLength, 0);
        return totalTime;
    }

    const start = moment().add(0 - getDurationNumber(), 's');
    let discount = course.originPrice - course.price;

    return (
        <>
            {showPreview &&
                <CModal show={showPreview} onClose={() => setShowPreview(false)} size='xl'>
                    <CModalBody className='p-0'>
                        <Preview course={course} onClose={() => setShowPreview(false)} url={course.introVideo} />
                    </CModalBody>
                </CModal>
            }
            <div className="w-100 d-flex flex-column align-items-center d-lg-none">
                <div onClick={() => setShowPreview(true)} className="CourseDetail_imgPreview">
                    {course.introVideo != null && course.introVideo != '' &&
                        <>
                            <div className="CourseDetail_iconPlay" style={{ position: 'absolute' }}>
                                <FontAwesomeIcon icon={allBrandIcon.faYoutube} className='fa-3x' />
                            </div>
                            <p>Xem giới thiệu khóa học</p>
                        </>
                    }
                    <div className="CourseDetail_bg" style={{ backgroundImage: `url('${course.thumbnailImage}')` }}></div>
                </div>

                {isRegistered &&
                    <p className="CourseDetail_registered">Bạn đã đăng ký khóa học này!</p>
                }
                {/* {!isRegistered &&
                    <h5 style={{ marginTop: 0 }}>{course.price > 0 ? `${NumberHelpers.toDefautFormat(course.price)} đ` : 'Học phí tùy tâm'}</h5>
                } */}

                {(!isRegistered && discount > 0) &&
                    <span className='CourseDetail_discount'>{`${NumberHelpers.toDefautFormat(course.originPrice)} đ`}</span>
                }

                {lessons.length > 0 &&
                    <button className="btn btn-default border-0 rounded-pill px-5 py-2" onClick={registerClicked}>
                        {isRegistered ? 'HỌC TIẾP' : 'đăng ký học'}
                    </button>
                }

                <ul className='mt-3 w-100'>
                    <li className='py-1'>
                        <img src={ic_course_length} className='CourseDetail_icon' style={{ width: '16px', height: '16px' }} />
                        <span className='ml-3'>Tổng số <strong>{getLessonNumber()}</strong> bài học</span>
                    </li>
                    <li className='py-1'>
                        <img src={ic_lessons_count} className='CourseDetail_icon' style={{ width: '16px', height: '16px' }} />
                        <span className='ml-3'>Thời lượng <strong>{moment.duration(getDurationNumber(), 'seconds').format("hh [giờ] mm [phút]")}</strong></span>
                    </li>
                    <li className='py-1'>
                        <img src={ic_battery} className='CourseDetail_icon' style={{ width: '16px', height: '16px' }} />
                        <span className='ml-3'>Học mọi lúc, mọi nơi</span>
                    </li>
                </ul>
            </div>
        </>
    )
}

export { PurchaseBadge, PurchaseBadgeMobile };