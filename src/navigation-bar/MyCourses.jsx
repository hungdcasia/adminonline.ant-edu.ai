import { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { userService } from "../services";
import { userActions } from "../actions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import { Link, Switch, Route } from "react-router-dom";
import { UrlHelpers, history } from "../helpers";
import closeButton from "../assets/images/close-black.svg";
import { useSelector } from "react-redux";

const MyCourses = (props) => {
    const [showMyCourse, setShowMyCourse] = useState(false);
    const wrapperRef = useRef();
    let myCourses = useSelector(r => r.myCourses)
    const { courses } = myCourses;
    const onclickOutsideMenu = (event) => {
        if (!showMyCourse)
            return;

        const { target } = event

        if (wrapperRef && !wrapperRef.current.contains(event.target)) {
            setShowMyCourse(false);
        }
    }

    const onIconClicked = () => {
        if (showMyCourse) return;
        setShowMyCourse(true);
    }

    useEffect(() => {
        document.addEventListener('click', onclickOutsideMenu);
        if (courses == null) {
            userActions.getMyCourses()
        }
        return () => {
            document.removeEventListener('click', onclickOutsideMenu)
        }
    });

    return (
        <div className="NavBar_iconWrapper NavBar_iconComments" ref={wrapperRef}>
            <FontAwesomeIcon className="fa-w-14 NavBar_icon lms-menu-icon" icon={allIcon.faBookOpen} onClick={onIconClicked} />
            {showMyCourse &&
                <div className="">
                    <div className="MyCourse_overlay MyCourse_hiddenDesktop"></div>
                    <div className="MyCourse_container">
                        <span className="MyCourse_arrowUp MyCourse_visibleDesktop"></span>
                        <header>
                            <h6>Khóa học của tôi</h6>
                            <span className="MyCourse_closeBtn MyCourse_hiddenDesktop"
                                onClick={() => setShowMyCourse(false)}>
                                <img src={closeButton} alt="Close button" />
                            </span>
                        </header>
                        <div id="my-course-content-id" className="MyCourse_content">
                            <ul>
                                {courses != null && courses.length > 0 &&
                                    courses.map((item, index) =>
                                        <MyCourseItem key={index} course={item} />
                                    )
                                }
                                {courses == null || courses.length == 0 &&
                                    <div id="my-course-content-id" className="MyCourse_content">
                                        <p className="MyCourse_noResult">{courses == null ? 'Đang tải...' : 'Bạn chưa đăng ký khóa học nào...'}</p>
                                        {courses != null &&
                                            <div className="MyCourse_lookingForCourse">
                                                <Link to="/courses" onClick={() => setShowMyCourse(false)} className="ranks_primary base_button sizes_s tooltip_tooltip" type="button">
                                                    <div className="base_inner sizes_inner"><span className="base_text">Tìm khóa học</span></div>
                                                </Link>
                                            </div>
                                        }
                                    </div>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

const MyCourseItem = (props) => {
    const { userCourse, course } = props.course;
    const learningPath = UrlHelpers.createLearningUrl(course.slug, course.id);
    return (
        <li className=""
            onClick={() => history.push(learningPath)} >
            <div className="MyCourse_thumbnail"><img src={course.thumbnailImage} alt={course.name} /></div>
            <div className="MyCourse_courseInfoWrapper">
                <div className="MyCourse_name">{course.name}</div>
                <div className="MyCourse_description">Tác giả: Admin</div>
                <span className="MyCourse_progressValue">{userCourse.progress}%</span>
                <div className="MyCourse_progress"><span className="MyCourse_progressBar" style={{ width: `${userCourse.progress}%` }}></span></div>
            </div>
        </li>
    );
}

export { MyCourses };