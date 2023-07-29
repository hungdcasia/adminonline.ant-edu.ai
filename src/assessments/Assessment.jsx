import React, { Component, Suspense, useState } from 'react';
import { connect, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import * as allIconBrand from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Link, Switch, Route, useParams } from 'react-router-dom';
import { generatePath } from "react-router";
import { NumberHelpers, UrlHelpers } from "../helpers/index";
import { courseService, userService } from "../services";
import Moment from 'react-moment';
import moment from 'moment';
import { history } from "../helpers";
import { alertActions, modalActions } from "../actions";
import Tour from "reactour";
import { LessonType, settingKeysConstant, themeConst } from '../constants';
import StarRatings from 'react-star-ratings';
import { useTheme } from '../helpers/theme.helpers';
import PdfComponent from '../shared/PdfComponent';
import throttle from "lodash.throttle"
import { CModal, CModalBody, CModalHeader } from '@coreui/react';
import { useQuery, useQueryClient } from 'react-query';
import Countdown from 'react-countdown';
import { useEffect } from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useRef } from 'react';

const Assessment = () => {
    // const screenHandle = useFullScreenHandle();
    let { attemptGuid } = useParams()
    let [autoSubmit, setAutoSubmit] = useState(false);
    let [submited, setSubmited] = useState(false)
    const { data: result } = useQuery(['assessment-attempt', attemptGuid], () => courseService.getAssessmentAttempt(attemptGuid))
    let assessmentAttempt = result?.data ?? null
    let questions = assessmentAttempt == null ? [] : JSON.parse(assessmentAttempt.questions);
    questions.map(item => {
        item.answers = JSON.parse(item.answers)
        return item;
    })

    useEffect(() => {
        if (assessmentAttempt != null) {
            let endTime = moment(assessmentAttempt.expireTime, 'x').local().toDate();
            let now = new Date()
            let isEndTime = endTime <= now;
            setSubmited(isEndTime)
        }
        // screenHandle.enter()
    }, [assessmentAttempt])


    const submit = () => {
        setAutoSubmit(false)
        setSubmited(true);
        let model = questions.map(question => {
            return {
                id: question.id,
                answerIds: question.answers.filter(r => r.isChecked).map(r => r.id)
            }
        });

        courseService.submitAssessmentAttempt(attemptGuid, model)
            .then(res => {
                if (res.isSuccess) {
                    if (res.data.isPass) {
                        modalActions.show({
                            title: `Chúc mừng. Bạn đã vượt qua bài thi với số điểm ${res.data.point}/100.`,
                            ok: 'Về trang chủ',
                            cancel: "Trang chứng chỉ",
                            onCancel: () => {
                                history.replace('/user/certificates')
                            },
                            onOk: () => {
                                history.replace('/')
                            }
                        })
                    } else {
                        modalActions.show({
                            title: `Thật tiếc. Bạn đã hoàn thành bài thi với số điểm ${res.data.point}/100.`,
                            ok: 'Về trang chủ',
                            cancel: "Trang chứng chỉ",
                            onCancel: () => {
                                history.replace('/user/certificates')
                            },
                            onOk: () => {
                                history.replace('/')
                            }
                        })
                    }
                }
            });
    }

    const onSubmitClick = () => {
        let endTime = moment(assessmentAttempt.expireTime, 'x').local().toDate();
        let now = new Date()
        let isEndTime = endTime <= now;
        if (!isEndTime) {
            modalActions.show({
                title: 'Vẫn còn thời gian. Bạn có chắc chắn muốn nộp bài?',
                ok: 'Nộp bài',
                cancel: "Không",
                onCancel: () => {

                },
                onOk: () => {
                    submit()
                }
            })
        } else {
            submit()
        }
    }

    return (
        // <FullScreen handle={screenHandle} onChange={(state) => { console.log('screen: ' + state); }}>
        <div className="fullscreen" id='learning-lesson'>
            <section className="container-fluid px-0">
                <div className='row' style={{ height: '100vh' }}>
                    <div className='col-3 h-100 border-right' style={{ borderColor: 'gray' }}>

                        <div className='w-100 d-flex h-100 flex-column '>
                            <div className='row justify-content-center'>
                                {assessmentAttempt != null &&
                                    <>
                                        {submited ?
                                            <div className="countdown">
                                                <div className='countdown-card'>
                                                    <div className="countdown-value px-3">
                                                        {/* <span>Đang nộp bài</span> */}
                                                    </div>
                                                </div>
                                            </div> :
                                            <CoundownView attemp={assessmentAttempt} onComplete={() => { setAutoSubmit(true) }} />
                                        }
                                    </>
                                }
                            </div>
                            <div className='row flex-column justify-content-center mt-auto'>
                                {autoSubmit &&
                                    <Countdown date={Date.now() + 10000} onComplete={() => { submit() }} renderer={({ seconds }) => {
                                        return (
                                            <div className='text-danger'>Tự động nộp bài sau {seconds} giây.</div>
                                        )
                                    }} />
                                }
                                <button className={`btn btn-success btn-lg font-weight-bold px-4 py-3 mb-5 text-uppercase`}
                                    onClick={onSubmitClick}
                                    disabled={submited}>Nộp bài</button>
                            </div>
                        </div>
                    </div>

                    <div className='col-9 h-100 overflow-auto'>
                        {questions.length > 0 &&
                            <QuestionsView questions={questions} />
                        }
                    </div>
                </div>
            </section>
        </div>
        // </FullScreen>
    )
}

const CoundownView = ({ attemp, onComplete }) => {
    let endTime = moment(attemp.expireTime, 'x').local().toDate();
    let now = new Date()
    let isEndTime = endTime <= now;
    return (
        <Countdown date={endTime}
            controlled={false}
            onComplete={onComplete}
            renderer={(props) => {
                if (props.completed) {
                    return (
                        <div className="countdown">
                            <div className='countdown-card'>
                                <div className="countdown-value px-3">
                                    <span>Hết thời gian</span>
                                </div>
                            </div>
                        </div>
                    )
                }
                return (
                    <div className=''>
                        <TimeCoundown {...props} />
                    </div>
                )
            }} />
    )
}

const QuestionType = {
    SingleChoice: 'SingleChoice',
    MutipleChoice: 'MutipleChoice'
}

const QuestionsView = (props) => {
    let [questions, setQuestions] = useState(props.questions);

    const checkboxClicked = (question, answerId) => {
        let answers = question.answers
        answers.forEach(item => {
            if (item.id === answerId) {
                item.isChecked = !item.isChecked;
            }
        });
        setQuestions([...questions])
    }

    const radioClicked = (question, answerId) => {
        let answers = question.answers
        answers.forEach(item => {
            item.isChecked = item.id === answerId;
        });
        setQuestions([...questions])
    }

    return (
        <div className="survey-quiz-container pb-5">
            {questions.map((question, index) => (
                <div className="question-detail w-100" key={index}>
                    <div className="w-100">
                        <div className="quiz-title text-dark">
                            <h3>Câu {index + 1}: {question.title}</h3>
                        </div>
                        <div className="quiz-content font-italic text-dark">
                            <h5>{question.content}</h5>
                        </div>
                    </div>
                    <div className="quiz-answers">
                        {question.type === QuestionType.SingleChoice &&
                            question.answers.map(answer =>
                                <Radio answer={answer} key={answer.id} onClicked={(answerId) => { radioClicked(question, answerId) }} error={question.error} />
                            )
                        }
                        {question.type === QuestionType.MutipleChoice &&
                            question.answers.map(answer =>
                                <CheckBox answer={answer} key={answer.id} onClicked={(answerId) => { checkboxClicked(question, answerId) }} error={question.error} />
                            )
                        }
                    </div>
                </div>
            ))}
        </div >
    )
}

const CheckBox = ({ answer, onClicked, error }) => {
    return (
        <div className="answer-item" onClick={() => onClicked(answer.id)}>
            <label className="Checkbox_checkboxLabel Quiz_select">
                <input type="checkbox"
                    className="Checkbox_input"
                    checked={answer.isChecked ?? false}
                    value={answer.id} disabled />
                <div className={`Checkbox_box ${error ? 'border-danger' : ''}`}>
                    <svg className="Checkbox_tick" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M13.579 2.593a.988.988 0 0 0-1.376.243l-5.759 8.225-2.756-2.756a.987.987 0 1 0-1.397 1.397l3.52 3.52a.978.978 0 0 0 .62.353.985.985 0 0 0 1.032-.519l6.362-9.085a.988.988 0 0 0-.243-1.376z"></path>
                    </svg>
                </div>
                <span className="Checkbox_text"></span>
            </label>
            <div className="Quiz_body">
                <div className="Quiz_title  text-dark">{answer.content}</div>
            </div>
        </div>
    )
}


const Radio = ({ answer, onClicked, error }) => {
    return (
        <div className="answer-item" onClick={() => onClicked(answer.id)}>
            <label className="Radio_checkboxLabel Quiz_select">
                <input type="checkbox"
                    className="Radio_input"
                    checked={answer.isChecked ?? false}
                    value={answer.id} disabled />
                <div className={`Radio_box ${error ? 'border-danger' : ''}`}>
                    <svg className="Radio_tick" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M13.579 2.593a.988.988 0 0 0-1.376.243l-5.759 8.225-2.756-2.756a.987.987 0 1 0-1.397 1.397l3.52 3.52a.978.978 0 0 0 .62.353.985.985 0 0 0 1.032-.519l6.362-9.085a.988.988 0 0 0-.243-1.376z"></path>
                    </svg>
                </div>
                <span className="Radio_text"></span>
            </label>
            <div className="Quiz_body">
                <div className="Quiz_title text-dark">{answer.content}</div>
            </div>
        </div>
    )
}

const TimeCoundown = ({ hours, minutes, seconds, completed }) => {
    return (
        <>
            <div className="countdown d-none d-sm-block">
                <div className='countdown-card'>
                    <div className="countdown-value">{hours}</div>
                    <div className="countdown-unit">Giờ</div>
                </div>
                <div className='countdown-card'>
                    <div className="countdown-value">{minutes}</div>
                    <div className="countdown-unit">Phút</div>
                </div>
                <div className='countdown-card'>
                    <div className="countdown-value">{seconds}</div>
                    <div className="countdown-unit">Giây</div>
                </div>
            </div>
            <div className="countdown d-block d-sm-none">
                <div className='countdown-card px-2'>
                    <div className="countdown-value">{hours} : {minutes} : {seconds}</div>
                </div>
            </div>
        </>
    )
}

export { Assessment }