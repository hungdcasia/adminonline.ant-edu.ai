import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import * as allIconBrand from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { NumberHelpers } from "../helpers/index";
import { courseService } from "../services";
import Moment from 'react-moment';
import moment from 'moment';
import '../assets/scss/_excercise.scss';
import { learningExcercisesActions } from "../actions";
import { connect } from 'react-redux';
import excerciseLevels from "../constants/excercise-level.json";
import ReactMarkdown from 'react-markdown';

class LessonExcercises extends Component {
    constructor(props) {
        super(props);

        const { lesson, course, excerciseId } = props.learningExcercises;

        this.state = {
            excercisesData: null,
            excerciseId: excerciseId,
            currentExcercise: null,
            answers: null
        };

        this.backButtonClicked = this.backButtonClicked.bind(this);
        this.getExcercisesDetail = this.getExcercisesDetail.bind(this);
        this.quizNumberClicked = this.quizNumberClicked.bind(this);
        this.checkboxClicked = this.checkboxClicked.bind(this);
        this.radioClicked = this.radioClicked.bind(this);
        this.submitAnswerClicked = this.submitAnswerClicked.bind(this);

        this.getExcercisesDetail();
    }

    getExcercisesDetail() {
        const { lesson, course, excerciseId } = this.props.learningExcercises;
        courseService.getLessonExcercisesDetail(lesson.id)
            .then(res => {
                const { data } = res;
                let currentExcercise = data.find(item => item._id == excerciseId);
                this.setState({
                    excercisesData: data,
                    excerciseId: excerciseId,
                    currentExcercise: currentExcercise,
                    answers: currentExcercise?.answers.map(item => {
                        return {
                            id: item._id,
                            title: item.title,
                            isChecked: false,
                            right: item.right
                        }
                    })
                })
            });
    }

    quizNumberClicked(index) {
        const { excercisesData } = this.state;
        let currentExcercise = excercisesData[index];
        this.setState({
            excerciseId: currentExcercise._id,
            currentExcercise: currentExcercise,
            answers: currentExcercise?.answers.map(item => {
                return {
                    id: item._id,
                    title: item.title,
                    isChecked: false,
                    right: item.right
                }
            })
        });
    }

    backButtonClicked() {
        this.props.clearExcercises();
    }

    checkboxClicked(event) {
        let { answers, currentExcercise } = this.state;
        if (currentExcercise.passed)
            return;
        answers.forEach(item => {
            if (item.id === event.target.value) {
                item.isChecked = event.target.checked;
            }
        });
        this.setState({ answers: answers });
    }

    radioClicked(event) {
        let { answers, currentExcercise } = this.state;
        if (currentExcercise.passed)
            return;
        answers.forEach(item => {
            item.isChecked = item.id === event.target.value;
        });
        this.setState({ answers: answers });
    }

    submitAnswerClicked() {
        const { answers, currentExcercise, excercisesData } = this.state
        if (currentExcercise.passed) {
            let currentIndex = excercisesData.findIndex(item => item._id == currentExcercise._id);

            if (currentIndex == excercisesData.length - 1) {
                this.backButtonClicked();
                return;
            }
            this.quizNumberClicked(currentIndex + 1);
            return;
        }
    }

    render() {
        const { excercisesData, excerciseId, currentExcercise, answers } = this.state;
        if (excercisesData == null || currentExcercise == null) {
            return (
                <div>nodata</div>
            );
        }

        return (
            <div id='lesson-excercises'>
                <div className="App_wrapper">
                    <div className="Header_wrapper">
                        <div className="Header_backBlock" title="Rời khỏi đây" onClick={this.backButtonClicked}>
                            <FontAwesomeIcon icon={allIcon.faChevronLeft} className='fa-w-10 Header_icon' />
                        </div>
                        <div className="Header_titleBlock Header_playMode">{currentExcercise.title}</div>
                        <div className="Header_progressBlock">
                            {excercisesData.map((item, index) =>
                                <div key={index}
                                    className={`Header_exerciseItem ${excerciseId == item._id && 'Header_exerciseItemActive'}`}
                                    title={item.title}
                                    onClick={() => this.quizNumberClicked(index)}
                                >
                                    {item.passed ? (
                                        <FontAwesomeIcon icon={allIcon.faCheck} className='Header_icon' transform={{ size: 16 }} />
                                    ) : index + 1}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="App_container">
                        <div className="SplitPane  vertical" style={{ "display": "flex", "flex": "1 1 0%", "height": "100%", "position": "absolute", "outline": "none", "overflow": "hidden", "userSelect": "text", "flexDirection": "row", "left": "0px", "right": "0px" }}>
                            <div className="Pane vertical Pane1" style={{ "flex": "0 0 auto", "position": "relative", "outline": "none", "width": "768px" }}>
                                <div id="exercise-content-panel" className="App_panel App_panelContent">
                                    <div id="exercise-sidebar-tabs" className="SideBar_wrapper">
                                        <div className="SideBar_btn noselect SideBar_btnActive" title="Mô tả bài tập">
                                            <FontAwesomeIcon icon={allIcon.faBookOpen} className='SideBar_icon' transform={{ size: 18 }} />
                                        </div>
                                        {/* <div className="SideBar_btn noselect" title="Bảng xếp hạng">
                                            <FontAwesomeIcon icon={allIcon.faTrophy} className='SideBar_icon' transform={{ size: 18 }} />
                                        </div>
                                        <div className="SideBar_btn noselect" title="Lịch sử nộp bài">
                                            <FontAwesomeIcon icon={allIcon.faHistory} className='SideBar_icon' transform={{ size: 18 }} />
                                        </div>
                                        <div className="SideBar_btn noselect" title="Bình luận">
                                            <span className="SideBar_commentsCount">2</span>
                                            <FontAwesomeIcon icon={allIcon.faComment} className='SideBar_icon' transform={{ size: 16 }} />
                                        </div>
                                        <div className="SideBar_btn noselect" title="Trợ giúp">
                                            <FontAwesomeIcon icon={allIcon.faQuestion} className='SideBar_icon' transform={{ size: 12 }} />
                                        </div> */}
                                    </div>
                                    <div id="exercise-sidebar-content-wrapper" className="TextContent_wrapper">
                                        <div className="TextContent_infoBlock">
                                            <div className="TextContent_levelBox TextContent_quiz" title="Quiz">{`#${currentExcercise.type}`}</div>
                                            <div className="TextContent_levelBox TextContent_easy" title={excerciseLevels[currentExcercise.level]}>{excerciseLevels[currentExcercise.level]}</div>
                                            <div id="exercise-point-for-win" className="TextContent_pointBox" title="Số điểm tối đa cho bài tập này">
                                                <div className="TextContent_iconWrap">
                                                    <FontAwesomeIcon icon={allIcon.faHeart} className='TextContent_icon' transform={{ size: 16 }} />
                                                </div>
                                                <span>{currentExcercise.point}</span>
                                            </div>
                                        </div>
                                        <div className="TextContent_content">
                                            <ReactMarkdown>{currentExcercise.content}</ReactMarkdown>
                                        </div>
                                        <div className="TextContent_footer"></div>
                                        <div className="TextContent_minimizedBgr noselect"></div>
                                        <div className="TextContent_minimizedBar noselect">NỘI DUNG BÀI TẬP</div>
                                    </div>
                                </div>
                            </div>
                            <span role="presentation" className="Resizer vertical "></span>
                            <div className="Pane vertical Pane2  " style={{ "flex": "1 1 0%", "position": "relative", "outline": "none" }}>
                                <div className="App_panel App_panelPractice undefined">
                                    <div className="Quiz_wrapper">
                                        {currentExcercise.quizSelectType == 'checkbox' &&
                                            answers.map(answer =>
                                                <CheckBox key={answer.id} checkboxClicked={this.checkboxClicked} quiz={currentExcercise} answer={answer} />
                                            )}
                                        {currentExcercise.quizSelectType == 'radio' &&
                                            answers.map(answer =>
                                                <Radio key={answer.id} radioClicked={this.radioClicked} quiz={currentExcercise} answer={answer} />
                                            )}
                                    </div>
                                    <div className="TestCase_footer">
                                        <div id="exercise-submit-button-block" className="TestCase_content" onClick={this.submitAnswerClicked}>
                                            {currentExcercise.passed ?
                                                (<div className="noselect TestCase_btn">
                                                    <FontAwesomeIcon icon={allIcon.faArrowRight} className='TestCase_icon' transform={{ size: 14 }} />
                                                    <span>Bài tiếp theo</span>
                                                </div>) :
                                                (<div className={`noselect TestCase_btn TestCase_btnSubmit ${!answers.some(item => item.isChecked) && 'TestCase_disabled'}`}>
                                                    <FontAwesomeIcon icon={allIcon.faHeart} className='TestCase_icon' transform={{ size: 14 }} />
                                                    <span>Nộp bài</span>
                                                </div>)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const CheckBox = props => {
    const { answer, quiz, checkboxClicked } = props;
    return (
        <div className="Quiz_item">
            <label className="Checkbox_checkboxLabel Quiz_select">
                <input type="checkbox"
                    className="Checkbox_input"
                    onChange={checkboxClicked}
                    checked={quiz.passed ? answer.right : answer.isChecked}
                    value={answer.id} readOnly={quiz.passed} />
                <div className="Checkbox_box">
                    <svg className="Checkbox_tick" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M13.579 2.593a.988.988 0 0 0-1.376.243l-5.759 8.225-2.756-2.756a.987.987 0 1 0-1.397 1.397l3.52 3.52a.978.978 0 0 0 .62.353.985.985 0 0 0 1.032-.519l6.362-9.085a.988.988 0 0 0-.243-1.376z"></path>
                    </svg>
                </div>
                <span className="Checkbox_text"></span>
            </label>
            <div className="Quiz_body">
                <div className="Quiz_title">{answer.title}</div>
            </div>
        </div>
    )
}

const Radio = props => {
    const { answer, quiz, radioClicked } = props;
    return (
        <div className="Quiz_item">
            <label className="Radio_checkboxLabel Quiz_select">
                <input type="checkbox"
                    className="Radio_input"
                    onChange={radioClicked}
                    checked={quiz.passed ? answer.right : answer.isChecked}
                    value={answer.id} readOnly={quiz.passed} />
                <div className="Radio_box">
                    <svg className="Radio_tick" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M13.579 2.593a.988.988 0 0 0-1.376.243l-5.759 8.225-2.756-2.756a.987.987 0 1 0-1.397 1.397l3.52 3.52a.978.978 0 0 0 .62.353.985.985 0 0 0 1.032-.519l6.362-9.085a.988.988 0 0 0-.243-1.376z"></path>
                    </svg>
                </div>
                <span className="Radio_text"></span>
            </label>
            <div className="Quiz_body">
                <div className="Quiz_title">{answer.title}</div>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    const { learningExcercises } = state;
    return { learningExcercises };
}

const actionCreators = {
    clearExcercises: learningExcercisesActions.clear
};

const connectedPage = connect(mapStateToProps, actionCreators)(LessonExcercises);

export { connectedPage as LessonExcercises }