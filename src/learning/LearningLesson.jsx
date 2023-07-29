import React, { Component, Suspense } from 'react';
import { connect, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import * as allIconBrand from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Link, Switch, Route } from 'react-router-dom';
import { generatePath } from "react-router";
import { NumberHelpers, UrlHelpers } from "../helpers/index";
import { courseService, userService } from "../services";
import Moment from 'react-moment';
import moment from 'moment';
import { history } from "../helpers";
import { LessonVideoPlayer, LessonComment, LessonNote, LearningRelated, LearningFooter, LessonList } from './';
import { LessonExcercises } from "../excercise/LessonExcercises";
import { alertActions, modalActions } from "../actions";
import Tour from "reactour";
import { LessonType, settingKeysConstant, themeConst } from '../constants';
import StarRatings from 'react-star-ratings';
import { useTheme } from '../helpers/theme.helpers';
import PdfComponent from '../shared/PdfComponent';
import throttle from "lodash.throttle"
import { LearningContext } from './LearningContext';
import { CModal, CModalBody, CModalHeader } from '@coreui/react';
import { QuizStatistics, QuizStatisticsButton } from './QuizStatistics';
import { CourseMedal } from './CourseMedal';
import { SurveyButton } from './CourseSurvey';
import { CertificateButton } from './CourseCertificate';
let logo = "/assets/images/logo-ant-edu.png";
const donateMessage = 'Nếu hài lòng với khoá học, dự án chúng tôi rất vui nếu bạn có một chút đóng góp tuỳ tâm để nhiều khoá học tốt hơn nữa được ra đời và đến với mọi người. Bạn có thể chuyển tiền ủng hộ qua số tài khoản hoặc quét mã VNpay, Momo trực tiếp cho người phụ trách dự án này.';
const mobileWidth = 992
class LearningLesson extends Component {
    constructor(props) {
        super(props);

        let { lessonId, courseId, course, lesson, tab } = props.match.params;

        this.state = {
            showDonate: false,
            showRating: false,
            userFeedback: '',
            star: null,
            courseId: courseId,
            lessonId: lessonId,
            currentLesson: null,
            courseSlug: course,
            course: null,
            userCourse: null,
            category: null,
            chapters: [],
            lessons: [],
            quizzes: [],
            userQuizzes: [],
            isRegistered: false,
            tab: tab,
            isTourOpen: false,
            isMobile: window.innerWidth <= mobileWidth,
            showDesktopLessons: true
        };

        this.Auto_Next = localStorage.getItem(settingKeysConstant.AUTO_NEXT_LESSON) != "true";
        this.throttleResize = throttle(() => {
            this.setState({
                isMobile: window.innerWidth <= mobileWidth
            })
        }, 500)
    }

    componentDidMount() {
        let { courseId, course } = this.props.match.params;
        let { authentication } = this.props;
        if (authentication.loggedIn) {
            this.getCourseData(courseId);
        } else {
            history.replace(UrlHelpers.createCourseDetailUrl(course, courseId));
        }
        window.addEventListener("resize", this.throttleResize)
    }

    getCourseData = (courseId, courseSlug) => {
        courseService.getCourseDetail(courseId)
            .then(res => {
                if (!res.isSuccess) return;
                let isRegistered = res.data.userCourse != null;
                this.setState({
                    course: res.data.course,
                    userCourse: res.data.userCourse,
                    category: res.data.category,
                    isRegistered: isRegistered
                });
            });

        courseService.getCourseLessons(courseId)
            .then(res => {
                if (!res.isSuccess) return;
                let { chapters, lessons, quizzes, userLessons, userQuizzes } = res.data;
                let hasCheckpoint = false;
                lessons.forEach((lesson, index, array) => {
                    lesson.completed = userLessons.some(r => r.lessonId == lesson.id);
                    lesson.locked = hasCheckpoint
                    if (!lesson.completed && lesson.checkpoint) {
                        hasCheckpoint = true;
                    }
                })

                this.setState({
                    chapters: chapters,
                    lessons: lessons,
                    quizzes: quizzes,
                    userQuizzes: userQuizzes,
                });

                let lessonId = this.state.lessonId;
                if (lessonId) {
                    let currentLesson = this.findCurrentLesson(res.data.lessons, lessonId)
                    if (currentLesson?.locked == false) {
                        this.setState({
                            currentLesson: currentLesson
                        });
                        return
                    }
                }

                let lessonNotComplete = res.data.lessons.find(r => !r.completed);
                lessonId = lessonNotComplete != null ? lessonNotComplete.id : res.data.lessons[0].id;
                let currentLesson = this.findCurrentLesson(res.data.lessons, lessonId);
                this.changePlayingLesson(currentLesson);
            });

        courseService.getCourseFeedback(courseId)
            .then(res => {
                if (res.isSuccess && res.data) {
                    this.setState({
                        star: res.data.star,
                        userFeedback: res.data.comment
                    });
                }
            });
    }

    findCurrentLesson = (lessons, lessonId) => {
        let lesson = lessons.find(r => r.id == lessonId);
        return lesson;
    }

    changePlayingLesson = (lesson, chapter) => {
        var oldLessonId = this.state.lessonId;

        let { courseSlug, courseId, tab } = this.state;
        let path = UrlHelpers.createLearningUrl(courseSlug, courseId, lesson.slug, lesson.id, tab);
        if (!oldLessonId) {
            history.replace(path);
            return;
        }
        history.push(path);

        window.gtag('event', 'learning_lesson', {
            lesson_id: lesson.id,
            lesson_name: lesson.name,
            course_id: courseId,
            course_name: this.state.course?.name
        })
        window.gtag('event', 'page_view', {
            page_location: window.location
        })
    }

    componentWillReceiveProps(nextProps) {
        let { lessonId, courseId, course, lesson, tab } = nextProps.match.params;

        if (tab != this.state.tab)
            this.setState({
                tab: tab
            });

        if (lessonId && lessonId != this.state.lessonId) {
            var currentLesson = this.findCurrentLesson(this.state.lessons, lessonId);
            this.setState({
                lessonId: lessonId,
                currentLesson: currentLesson
            });
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.throttleResize)
    }

    nodata = () => {
        return (
            <div></div>
        )
    }

    nolessonfound = () => {
        return (
            <div className="fullscreen" id='learning-lesson'>
                <div className="flex-center position-ref full-height"><div className="code"> 404 </div><div className="message" style={{ padding: "10px" }}> Not Found </div></div>
            </div>
        )
    }

    ref = player => {
        this.player = player
    }

    nextLesson = () => {
        const { currentLesson, lessonId, lessons } = this.state;
        let currentIndex = lessons.findIndex(r => r.id == currentLesson.id);
        if (currentIndex == lessons.length - 1) {
            return;
        }
        let nextLesson = lessons[currentIndex + 1];
        this.changePlayingLesson(nextLesson);
    }

    canNextLesson = () => {
        const { currentLesson, lessonId, lessons } = this.state;
        let currentIndex = lessons.findIndex(r => r.id == currentLesson.id);
        if (currentIndex == lessons.length - 1) {
            return false;
        }

        return true;
    }

    handleNextLesson = () => {
        if (this.canNextLesson())
            this.nextLesson();
    }

    setCompleteLesson = (lessonId) => {
        const { lessons, userCourse } = this.state;
        let lesson = lessons.find(r => r.id == lessonId)
        let isCompleted = lesson.completed
        if (!isCompleted) {
            let progress = Math.floor((lessons.filter(r => r.completed).length) * 100 / lessons.length);
            return courseService.completeLesson(lessonId, progress)
                .then(res => {
                    if (res.isSuccess) {
                        lesson.completed = true;

                        let hasCheckpoint = false
                        lessons.forEach((lesson, index, array) => {
                            lesson.locked = hasCheckpoint
                            if (!lesson.completed && lesson.checkpoint) {
                                hasCheckpoint = true;
                            }
                        })

                        userCourse.progress = progress;
                        userCourse.completed = progress === 100;
                        this.setState({
                            userCourse: userCourse,
                            lessons: [...lessons]
                        })
                    }
                });
        }

        return Promise.resolve();
    }

    onLearnedCurrentLesson = () => {
        const { lessonId, } = this.state;
        this.setCompleteLesson(lessonId).then(() => {
            if (this.state.userCourse.completed) {
                if (!this.tryShowRating()) {
                    if (!this.tryShowDonate()) {
                        this.handleNextLesson()
                    }
                }
                return;
            }
            this.handleNextLesson()
        })
    }

    tryShowRating = () => {
        if (this.shouldShowRating != false && !this.state.star) {
            this.shouldShowRating = false
            this.setState({
                showRating: true
            });

            return true
        }
        return false
    }

    tryShowDonate = () => {
        let shouldShowDonate = false
        let lastShowDonate = moment(localStorage.getItem('donate'), 'x')
        shouldShowDonate = this.state.course.price > 0 && (!lastShowDonate.isValid() || moment().diff(lastShowDonate) > 7 * 24 * 60 * 60)
        if (shouldShowDonate) {
            localStorage.setItem('donate', moment().format("x"))
            this.setState({
                showDonate: true
            });
        }

        return shouldShowDonate;
    }

    feedbackSubmit = () => {
        let { courseId, star, userFeedback } = this.state;
        courseService.courseFeedback(courseId, star, userFeedback)
            .then(res => {
                if (res.isSuccess) {
                    alertActions.success("Gửi đánh giá thành công.");
                }
            })
            .finally(() => {
                this.setState({
                    showRating: false
                });

                this.tryShowDonate()
            });
    }

    render() {
        let { course, courseId, courseSlug, lessonId, tab, currentLesson, chapters, lessons, quizzes, userQuizzes, userCourse } = this.state;
        let { isMobile, showDesktopLessons, isTourOpen, showRating } = this.state

        let tabsActive = {
            "default": tab == null,
            "content": tab == "contents",
            "notes": tab == 'notes',
            "related": tab == 'related',
        };

        let progress = lessons.length == 0 ? 0 : Math.round(lessons.filter(r => r.completed).length * 100 / lessons.length);
        let progressStyle = {
            '--progress': `${progress}%`
        };
        var learningPath = UrlHelpers.createLearningUrl(courseSlug, courseId, currentLesson?.slug, currentLesson?.id);
        return (
            <>
                <LearningContext.Provider value={{
                    onLearnedCurrentLesson: this.onLearnedCurrentLesson,
                    setCompleteLesson: this.setCompleteLesson,
                    changePlayingLesson: this.changePlayingLesson,
                    handleNextLesson: this.handleNextLesson
                }}>
                    <div className="fullscreen" id='learning-lesson'>
                        <section className="container-fluid px-0">
                            <div className='position-fixed h-50px w-100' style={{ top: 0, zIndex: 10 }}>
                                <div className="h-50px w-100 d-flex align-items-center px-2 position-relative text-white">
                                    <Link className="h-100 py-2 pl-4 d-none d-md-block" to='/'>
                                        <img src={logo} alt="Ant Edu" className='h-100' />
                                    </Link>
                                    <div className="Header_divider ml-3"></div>
                                    <Link to={UrlHelpers.createCourseDetailUrl(courseSlug, courseId)} className='pl-2'>
                                        <div className="text-light" title="Rời khỏi đây">
                                            <FontAwesomeIcon icon={allIcon.faChevronLeft} size='lg' className="" />
                                        </div>
                                    </Link>
                                    <Link to={UrlHelpers.createCourseDetailUrl(courseSlug, courseId)} className="btn btn-link d-none d-md-block ml-3 h5 pt-2 text-white">{course?.name}</Link>
                                    <div className='ml-auto d-flex align-items-center'>
                                        {/* <CertificateButton courseId={courseId} /> */}
                                        {/* <SurveyButton courseId={courseId} /> */}
                                        {/* <QuizStatisticsButton course={course} chapters={chapters} lessons={lessons} /> */}
                                        <div className="mr-3 hover-pointer d-none" onClick={() => this.setState({ isTourOpen: true })}>
                                            <FontAwesomeIcon icon={allIcon.faQuestionCircle} className="fa-w-16" />
                                            <span className='d-none d-sm-inline-block ml-1'>Hướng dẫn</span>
                                        </div>
                                        <div className="mr-3 hover-pointer d-none"
                                            onClick={() => this.setState({ showRating: true })}>
                                            <FontAwesomeIcon icon={allIcon.faStar} className="fa-w-6" />
                                            <span style={{ marginLeft: '5px' }} className='d-none d-sm-inline-block ml-1'>Đánh giá</span>
                                        </div>
                                        <div className="mr-3 p-1 px-2 hover-pointer bg-orange text-white d-none"
                                            onClick={() => this.setState({ showDonate: true })}>
                                            <FontAwesomeIcon icon={allIcon.faHeart} className="fa-w-6 blinking" />
                                            <span style={{ marginLeft: '5px' }} className='d-none d-sm-inline-block ml-1'>Quyên góp</span>
                                        </div>
                                        <ThemeButton />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className={`Learning_playerColumn Learning_newScroll ${(isMobile || !showDesktopLessons) && 'Learning_player_fullWidth'}`}>
                                    <div className="ActiveVideo_wrapper noselect">
                                        {currentLesson?.type == LessonType.VIDEO &&
                                            <LessonVideoPlayer url={currentLesson?.videoUrl} currentLesson={currentLesson} currentLessonId={currentLesson.id} canNextLesson={this.canNextLesson()} />
                                        }

                                        {currentLesson?.type == LessonType.PDF &&
                                            <div className='video-wrapper ActiveVideo_player'>
                                                <PdfComponent pdfFile={currentLesson.videoUrl} />
                                            </div>
                                        }

                                        <div className="NextPrevCtrl_btnControl NextPrevCtrl_btnPrev">
                                            <FontAwesomeIcon icon={allIcon.faChevronLeft} className="fa-w-10 NextPrevCtrl_icon" />
                                            <div className="NextPrevCtrl_relatedTitle">
                                                <div><span></span></div>
                                            </div>
                                        </div>
                                        <div className="NextPrevCtrl_btnControl NextPrevCtrl_btnNext">
                                            <FontAwesomeIcon icon={allIcon.faChevronRight} className="fa-w-10 NextPrevCtrl_icon" />
                                            <div className="NextPrevCtrl_relatedTitle">
                                                <div><span></span></div>
                                            </div>
                                        </div>

                                        <button className={"btn-minimum-learning-content btn btn-dark border-none text-white position-absolute " + (showDesktopLessons && 'd-none')}
                                            style={{ top: 20 }}
                                            onClick={() => this.setState({ showDesktopLessons: true })}>
                                            <FontAwesomeIcon icon={allIcon.faArrowLeft} />
                                            <span className='pl-2'>Nội dung học</span>
                                        </button>
                                    </div>
                                    <section className="container-fluid">
                                        <section className="row">
                                            <section className="col-sm-12">
                                                <div className="Tab_tabs">
                                                    <Link aria-current="page" className={tabsActive["default"] ? 'Tab_tab Tab_active' : 'Tab_tab'} id="learn-overview-tab" to={learningPath}>Tổng quan</Link>

                                                    {isMobile && <Link aria-current="page" className={tabsActive["content"] ? 'Tab_tab Tab_active' : 'Tab_tab'} id="learn-overview-tab" to={learningPath + "/contents"}>Bài học</Link>}
                                                    {/* <Link className={tabsActive["notes"] ? 'Tab_tab Tab_active' : 'Tab_tab'} id="learn-note-tab" to={`${learningPath}/notes`}>Ghi chú</Link> */}
                                                    {/* <Link className={tabsActive["related"] ? 'Tab_tab Tab_active' : 'Tab_tab'} id="learn-related-tab" to={`${this.state.coursePath}/related`}>Liên quan</Link> */}
                                                </div>

                                                <div className="Learning_description" style={tabsActive["default"] ? {} : { display: 'none' }}>
                                                    <p dangerouslySetInnerHTML={{ __html: course?.description }}></p>
                                                </div>
                                                {/* <div id="learn-comment-block" className="Learning_commentBlock" style={tabsActive["default"] ? {} : { display: 'none' }}>
                                                    {currentLesson &&
                                                        <LessonComment currentLesson={currentLesson} />
                                                    }
                                                </div> */}
                                                {/* <div data-tour="learn-note-tab-step" className="Note_wrapper" style={tabsActive["notes"] ? {} : { display: 'none' }}>
                                                    <LessonNote courseData={this.state} courseId={courseId} lessonId={lessonId} />
                                                </div> */}
                                                {isMobile &&
                                                    <div style={tabsActive["content"] ? {} : { display: 'none' }}>
                                                        <div id="learn-playlist" className="Playlist_wrapper">
                                                            <header className="Playlist_header" style={progressStyle}>
                                                                <h1 className="Playlist_heading">{course?.name}</h1>
                                                                <div className="Playlist_courseInfo">
                                                                    <p className="Playlist_description">Hoàn thành <span className='text-active'><strong>{lessons?.filter(r => r.completed).length}</strong>/<strong>{lessons?.length}</strong></span> bài học (<strong>{progressStyle['--progress']}</strong>)</p>
                                                                </div>
                                                            </header>
                                                            <LessonList chapters={chapters}
                                                                lessons={lessons}
                                                                quizzes={quizzes}
                                                                courseId={courseId}
                                                                currentLesson={currentLesson}
                                                                userQuizzes={userQuizzes}
                                                                lessonId={lessonId}
                                                                refresh={() => this.getCourseData(courseId)}
                                                                changePlayingLesson={this.changePlayingLesson} />
                                                        </div>
                                                    </div>
                                                }
                                            </section>
                                        </section>
                                    </section>
                                </div>
                                {!isMobile &&
                                    <div className={`Learning_playListColumn ${!showDesktopLessons && 'd-none'}`}>
                                        <div id="learn-playlist" className="Playlist_wrapper">
                                            <header className="Playlist_header" style={progressStyle}>
                                                <h1 className="Playlist_heading">{course?.name}</h1>
                                                <div className="Playlist_courseInfo">
                                                    <p className="Playlist_description">Hoàn thành <span className='text-active'><strong>{lessons?.filter(r => r.completed).length}</strong>/<strong>{lessons?.length}</strong></span> bài học (<strong>{progressStyle['--progress']}</strong>)</p>
                                                    <div className="Playlist_closeBtn Playlist_visibleDesktop" title="Thu nhỏ sách bài học" onClick={() => this.setState({ showDesktopLessons: false })}>
                                                        <svg className="Playlist_icon" width="18" height="18" viewBox="0 0 32 32">
                                                            <path d="M2,14.5h18.4l-7.4-7.4c-0.6-0.6-0.6-1.5,0-2.1c0.6-0.6,1.5-0.6,2.1,0l10,10c0.6,0.6,0.6,1.5,0,2.1l-10,10c-0.3,0.3-0.7,0.4-1.1,0.4c-0.4,0-0.8-0.1-1.1-0.4c-0.6-0.6-0.6-1.5,0-2.1l7.4-7.4H2c-0.8,0-1.5-0.7-1.5-1.5C0.5,15.3,1.2,14.5,2,14.5z M28,3.5C28,2.7,28.7,2,29.5,2S31,2.7,31,3.5v25c0,0.8-0.7,1.5-1.5,1.5S28,29.3,28,28.5V3.5z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </header>
                                            <LessonList chapters={chapters}
                                                lessons={lessons}
                                                quizzes={quizzes}
                                                userQuizzes={userQuizzes}
                                                courseId={courseId}
                                                currentLesson={currentLesson}
                                                lessonId={lessonId}
                                                refresh={() => this.getCourseData(courseId)}
                                                changePlayingLesson={this.changePlayingLesson} />
                                        </div>
                                    </div>
                                }
                            </div>
                            {showRating &&
                                <div className='course-rating-container'>
                                    <div className='course-rating-background'>
                                    </div>
                                    <div className='course-rating-content-container'>
                                        <div className="course-rating-content-wrapper">
                                            <div className='course-rating-header'>
                                                <label className="course-rating-title">Bạn nghĩ sao về khóa học này</label>
                                                <FontAwesomeIcon icon={allIcon.faTimes}
                                                    onClick={() => { this.setState({ showRating: false }) }}
                                                    className="course-rating-close" />
                                            </div>
                                            <div className='course-rating-body'>
                                                <div className='course-rating-star'>
                                                    <StarRatings
                                                        rating={this.state.star ?? 0}
                                                        starRatedColor="rgb(230, 67, 47)"
                                                        changeRating={(newRating) => { this.setState({ star: newRating }) }}
                                                        numberOfStars={5}
                                                        name='rating'
                                                    />
                                                </div>
                                                <div className='course-rating-comment'>
                                                    <textarea className='Input_input Input_m'
                                                        type='texts'
                                                        style={{ width: '100%', height: '100px' }}
                                                        maxLength="250"
                                                        placeholder="Cảm nghĩ của bạn"
                                                        value={this.state.userFeedback}
                                                        onChange={(e) => this.setState({ userFeedback: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className='course-rating-action'>
                                                <button className='ranks_primary base_button sizes_l Header_btn tooltip_tooltip'
                                                    disabled={this.state.star == null}
                                                    onClick={this.feedbackSubmit}>
                                                    Gửi đánh giá
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            }

                            {this.state.showDonate &&
                                <div className='course-rating-container'>
                                    <div className='course-rating-background'>
                                    </div>
                                    <div className='course-rating-content-container'>
                                        <div className="course-rating-content-wrapper">
                                            <div className='course-rating-header'>
                                                <label className="course-rating-title">Ủng hộ Ant Edu</label>
                                                <FontAwesomeIcon icon={allIcon.faTimes}
                                                    onClick={() => { this.setState({ showDonate: false }) }}
                                                    className="course-rating-close" />
                                            </div>
                                            <div className='course-rating-body'>
                                                <div className='course-donate-label'>
                                                    {course.donateAccount ?
                                                        <span style={{ lineHeight: 1.5 }}>{course.donateAccount.description}</span>
                                                        :
                                                        <span style={{ lineHeight: 1.5 }}>Nếu hài lòng với khoá học, dự án chúng tôi rất vui nếu bạn có một chút đóng góp tuỳ tâm để nhiều khoá học tốt hơn nữa được ra đời và đến với mọi người.</span>
                                                    }
                                                </div>
                                            </div>
                                            {course.donateAccount ?
                                                <div className='course-rating-body'>
                                                    <div><span>Ngân hàng: </span><strong className=''>{course.donateAccount.bankName}</strong></div>
                                                    <div><span>Số Tài khoản: </span> <strong>{course.donateAccount.accountNumber}</strong></div>
                                                    <div><span>Chủ Tài khoản: </span> <strong>{course.donateAccount.owner}</strong></div>
                                                </div> :
                                                <div className='course-rating-action'>
                                                    <button className='ranks_primary base_button sizes_l Header_btn tooltip_tooltip'
                                                        onClick={() => {
                                                            window.gtag('event', 'donate_click', {
                                                                position: 'learning'
                                                            })
                                                            history.push("/donation");
                                                        }}>
                                                        <FontAwesomeIcon icon={allIcon.faHeart} style={{ marginRight: '8px' }} />Đồng ý
                                                    </button>
                                                </div>
                                            }
                                        </div>

                                    </div>
                                </div>
                            }
                        </section>
                    </div>

                    <Suspense fallback={<React.Fragment />}>
                        <Tour
                            onRequestClose={() => this.setState({ isTourOpen: false })}
                            steps={tourConfig}
                            isOpen={isTourOpen}
                            rounded={5}
                            showNumber={false}
                            accentColor={'linear-gradient(to right, #1c8f9e, #5cb7b7)'}
                        />
                    </Suspense>
                </LearningContext.Provider >
            </>
        );
    }
}

const tourConfig = [
    {
        content: 'Chào cậu! Mình là Miu - hướng dẫn viên tại Ant Edu, mình sẽ đưa cậu đi thăm quan và giới thiệu cho cậu hiểu rõ hơn về Ant Edu nhé. Đi thôi!',
    },
    {
        selector: '.ActiveVideo_wrapper',
        content: 'Đây là khu vực trung tâm của màn hình này, toàn bộ nội dung các bài học như là video, hình ảnh, văn bản sẽ được hiển thị ở đây nhé ^^',
    },
    {
        selector: '.Learning_playListColumn',
        content: 'Tiếp theo là khu vực quan trọng không kém, đây là danh sách các bài học tại khóa này. Cậu sẽ rất thường xuyên tương tác tại đây để chuyển bài học và làm bài tập đấy >_<',
    },
    {
        selector: '.chapter-0',
        content: 'Đây là bài học đầu tiên dành cho cậu, khi học xong bài học này Miu sẽ đánh "Tích xanh" bên cạnh để đánh dấu cậu đã hoàn thành bài học nhé!',
    },
    {
        selector: '.Learning_commentBlock',
        content: 'Và đây là khu vực dành cho việc hỏi đáp, trao đổi trong mỗi bài học. Nếu có bài học nào hay thì cậu bình luận một lời động viên vào đây cũng được nhé. Miu sẽ rất vui và cảm thấy biết ơn đấy <3',
    }
];

const ThemeButton = () => {
    let theme = useSelector(state => state.themeState)
    let [toggleTheme] = useTheme();
    return (
        <div className="mr-3" onClick={toggleTheme}>
            <FontAwesomeIcon icon={theme.name == themeConst.dark ? allIcon.faSun : allIcon.faMoon} className="fa-w-6" />
        </div>
    )
}

function mapStateToProps(state) {
    return { authentication: state.authentication };
}

const connectedPage = connect(mapStateToProps, {})(LearningLesson);

export { connectedPage as LearningLesson };