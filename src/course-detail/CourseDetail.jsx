import React, { Component, Fragment, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { NumberHelpers, UrlHelpers } from "../helpers";
import { courseService, userService } from "../services";
import { PurchaseBadge, PurchaseBadgeMobile } from "./PurchaseBadge";
import { CourseComment } from "./CourseComment";
import { CourseWillLearn } from "./CourseWillLearn";
import { Preview } from "./Preview";
import { CourseRequire } from "./CourseRequire";
import Moment from 'react-moment';
import moment from 'moment';
import { history } from "../helpers";
import { NoData, Modal } from "../shared";
import { alertActions, modalActions } from "../actions";
import { connect } from "react-redux";
import * as allShareButton from "react-share";
import { RelatedCourses } from './RelatedCourses';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams
} from "react-router-dom";
import { useSelector } from 'react-redux';
import { useForceUpdate } from '../helpers/useForceUpdate';
import QuizItem from './quizzes/QuizItem';

const CourseDetail = props => {

    let authentication = useSelector(r => r.authentication)
    let { id } = useParams()

    useEffect(() => {
        window.gtag('event', 'page_view', {
            page_location: window.location
        })

        courseService.getCourseDetail(id)
            .then(res => {
                setCourseDetail(res.data)

                window.gtag('event', 'view_item', {
                    items: [{
                        item_id: id,
                        item_name: res.data.course.name,
                        item_category: res.data.category.name,
                        price: res.data.course.price,
                        discount: res.data.course.originPrice - res.data.course.price,
                        currency: "VND",
                    }]
                })
            });

        courseService.getCourseLessons(id)
            .then(res => {
                let { chapters, lessons, userLessons } = res.data;
                if (userLessons)
                    for (let i = 0; i < userLessons.length; i++) {
                        const userLesson = userLessons[i];
                        let lesson = lessons.find(r => r.id == userLesson.lessonId);
                        if (lesson)
                            lesson.completed = true;
                    }

                chapters.forEach(item => {
                    item.expanded = true;
                });

                setCourseLessons(res.data)
            });
    }, [id])

    let [courseDetail, setCourseDetail] = useState({})
    let [courseLessons, setCourseLessons] = useState({ chapters: [], lessons: [], userLessons: [], quizzes: [], userQuizzes: [] })

    let { course, category, userCourse } = courseDetail
    let { chapters, lessons, quizzes, userLessons, userQuizzes } = courseLessons
    let isRegistered = userCourse != null;

    const registerClicked = () => {
        if (!authentication.loggedIn) {
            modalActions.show({
                title: 'Vui lòng đăng nhập để tham gia khóa học.',
                ok: 'Đăng nhập',
                onOk: () => {
                    history.login();
                }
            });
            return;
        }

        if (lessons.length == 0) return;
        if (isRegistered) {
            const learningPath = UrlHelpers.createLearningUrl(course.slug, course.id);
            history.push(learningPath);
            return;
        }

        if (authentication.needConfirmEmail) {
            alertActions.error('Tài khoản của bạn chưa được xác thực. Vui lòng kiểm tra hòm thư và xác thực tài khoản.');
            return;
        }

        registerCourse();
    }

    const registerCourse = () => {
        if (course.price > 0) {
            history.push(`/checkout/${course.slug}/${course.id}`);
            return;
        }

        courseService.registerCourse(course.id)
            .then(res => {
                if (res.isSuccess) {
                    const learningPath = UrlHelpers.createLearningUrl(course.slug, course.id);
                    history.push(learningPath);
                }
            })
            .finally(() => { });
    }

    if (course == null)
        return (
            <section className="App_wrapper">
                <section className="container App_appContainer">
                    <section className="row CourseDetail_wrapper">
                        <section className="col-md-12 col-lg-8">
                        </section>
                    </section>
                </section>
            </section>
        );


    return (
        <section className="App_wrapper">
            <section className="container App_appContainer">
                <section className="row CourseDetail_wrapper">
                    <section className="col-md-12 col-lg-8">
                        <ul className="CourseDetail_breadcrumb">
                            <li>
                                <Link to="/user/courses">Khóa học</Link>
                                <FontAwesomeIcon icon={allIcon.faChevronRight} className="fa-w-10 CourseDetail_icon" />
                            </li>
                            <li><span>{category.name}</span></li>
                        </ul>
                        <h1 className="CourseDetail_courseName CourseDetail_visibleDesktop">{course.name}</h1>
                        <h1 className="CourseDetail_courseName CourseDetail_hiddenDesktop">{course.name}</h1>
                        <div className="CourseDetail_textContent" dangerouslySetInnerHTML={{ __html: course.description }}></div>

                        <PurchaseBadgeMobile course={course} lessons={lessons} isRegistered={isRegistered} registerClicked={registerClicked} />

                        <CourseWillLearn course={course} />
                        <CourseContent chapters={chapters} lessons={lessons} quizzes={quizzes} userQuizzes={userQuizzes} userLessons={userLessons} course={course} isRegistered={isRegistered} registerCourse={registerCourse} />
                        <CourseRequire course={course} />
                        <RelatedCourses courseId={id} />
                        {/* <CourseComment course={course} /> */}
                    </section>
                    <section className="col-md-12 col-lg-4">
                        <PurchaseBadge course={course} lessons={lessons} isRegistered={isRegistered} registerClicked={registerClicked} />
                    </section>
                </section>
            </section>
        </section>
    );
}

const CourseContent = ({ chapters, lessons, userLessons, isRegistered, course, registerCourse, quizzes, userQuizzes }) => {

    let forceUpdate = useForceUpdate()

    const isAllChapterExpanded = () => {
        return !chapters?.some(item => item.expanded !== true);
    }

    const toggleChapter = (index) => {
        chapters[index].expanded = chapters[index].expanded != true
        forceUpdate()
    }

    const toggleAll = () => {
        let isAllExpended = isAllChapterExpanded();
        chapters.forEach(item => item.expanded = !isAllExpended);
        forceUpdate()
    }
    const getDurationNumber = () => {
        const totalTime = lessons.reduce((total, item) => total + item.timeLength, 0);
        return totalTime;
    }
    let start = moment().add(0 - getDurationNumber(), 's');

    return (
        <div className="CurriculumOfCourse_curriculumOfCourse">
            <div className="CurriculumOfCourse_headerSticky">
                <div className="CurriculumOfCourse_headerBlock">
                    <h3 className="CurriculumOfCourse_floatLeft">Nội dung khóa học</h3>
                </div>
                <div className="CurriculumOfCourse_subHeadWrapper">
                    <ul>
                        <li className="hiddenHandheld"><span>{chapters.length} </span> phần</li>
                        <li className="CurriculumOfCourse_dot hiddenHandheld">•</li>
                        <li><span>{lessons.length} </span> bài học</li>
                        <li className="CurriculumOfCourse_dot">•</li>
                        <li><span>Thời lượng <Moment date={start} format="hh [giờ] mm [phút]" trim durationFromNow /></span></li>
                    </ul>
                    <div className="CurriculumOfCourse_toggleBtn" onClick={toggleAll}>{isAllChapterExpanded() ? 'Thu nhỏ' : 'Mở rộng'}  tất cả</div>
                </div>
            </div>
            <div className="CurriculumOfCourse_curriculumPanel">
                {lessons.length == 0 ?
                    <div className="CurriculumOfCourse_panelGroup">
                        <NoData message="Chưa có bài học. Bạn vui lòng quay lại sau." />
                    </div> :
                    <div className="CurriculumOfCourse_panelGroup">
                        <div>
                            {chapters.map((chapter, chapterIndex) =>
                                <ChapterItem key={chapter.id}
                                    chapter={chapter}
                                    lessons={lessons.filter(r => r.chapterId === chapter.id)}
                                    quizzes={quizzes.filter(q => lessons.filter(l => l.chapterId === chapter.id).some(p => p.id === q.lessonId ))}
                                    chapterIndex={chapterIndex}
                                    toggleChapter={toggleChapter}
                                    userLessons={userLessons}
                                    userQuizzes={userQuizzes}
                                    isRegistered={isRegistered}
                                    registerCourse={registerCourse}
                                    course={course} />
                            )}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

function ChapterItem({ chapter, chapterIndex, toggleChapter, lessons, isRegistered, registerCourse, course, quizzes, userQuizzes }) {
    let authentication = useSelector(r => r.authentication)
    const { expanded } = chapter;
    const timeLength = lessons.reduce((total, item) => total + item.timeLength, 0);

    return (
        <div className="CurriculumOfCourse_panel" key={chapter.id}>
            <div className={"CurriculumOfCourse_panelHeading noselect" + (expanded ? ' CurriculumOfCourse_activePanel' : '')} onClick={() => toggleChapter(chapterIndex)}>
                <h5 className="CurriculumOfCourse_panelTitle">
                    <div className="CurriculumOfCourse_headline">
                        <span className="CurriculumOfCourse_floatLeft CurriculumOfCourse_groupName">
                            <strong>{chapter.name}</strong>
                        </span>
                        <span className="CurriculumOfCourse_visibleDesktop CurriculumOfCourse_floatRight CurriculumOfCourse_timeOfSection">{moment.duration(timeLength, 'seconds').format("hh:mm:ss")}</span>
                        <span className="CurriculumOfCourse_floatRight CurriculumOfCourse_totalLessons">{lessons.length} bài học</span>
                    </div>
                </h5>
            </div>
            <div className={"CurriculumOfCourse_collapse" + (expanded ? ' CurriculumOfCourse_in' : '')}>
                <div className="CurriculumOfCourse_panelBody">
                    <div>
                        <div>
                            {
                                lessons.map((lesson, lessionIndex) => <LessonItem
                                    key={lesson.id}
                                    lesson={lesson}
                                    quizzes={quizzes.filter(p => p.lessonId === lesson.id)}
                                    userQuizzes={userQuizzes.filter(p =>p.lessonId === lesson.id)}
                                />)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const LessonItem = ({ lesson, quizzes, userQuizzes }) => {
    return (
        <>
            <div className="CurriculumOfCourse_lessonItem" >
                <span className="CurriculumOfCourse_floatLeft CurriculumOfCourse_iconLink">
                    {lesson.completed ?
                        <FontAwesomeIcon icon={allIcon.faCheckDouble} className='fa-w-16 CurriculumOfCourse_icon CurriculumOfCourse_video' /> :
                        <FontAwesomeIcon icon={allIcon.faPlayCircle} className="fa-w-16 CurriculumOfCourse_icon CurriculumOfCourse_video" />
                    }
                    <div className="CurriculumOfCourse_lessonName">{lesson.name}</div>
                </span>
                <span className="CurriculumOfCourse_floatRight">{moment.duration(lesson.timeLength, 'seconds').format("hh:mm:ss")}</span>
                <span className="CurriculumOfCourse_action CurriculumOfCourse_floatRight">
                    <div>{lesson.type}</div>
                </span>
            </div>
            {
                quizzes.map(quiz => <QuizItem key={quiz.id} quiz={quiz} userQuizzes={userQuizzes.filter(p => p.quizId === quiz.id)}/>)
            }
        </>
    )
}

export { CourseDetail };