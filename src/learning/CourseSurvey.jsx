import React, { Component, Suspense, useState } from 'react';
import { connect, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import * as allIconBrand from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Link, Switch, Route } from 'react-router-dom';
import { generatePath } from "react-router";
import { NumberHelpers, UrlHelpers, string_isNullOrEmpty } from "../helpers/index";
import { courseService, userService } from "../services";
import Moment from 'react-moment';
import moment from 'moment';
import { history } from "../helpers";
import { LessonVideoPlayer, LessonComment, LessonNote, LearningRelated, LearningFooter, LessonList } from '.';
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
import { CourseMedal } from './CourseMedal';
import { useQuery } from 'react-query';

const QuestionType = {
    SingleChoice: 'SingleChoice',
    MutipleChoice: 'MutipleChoice',
    FreeText: 'FreeText'
}

const SurveyButton = ({ courseId }) => {

    const { data: surveyResult } = useQuery(['course-survey', courseId], () => courseService.getSurveyByCourseId(courseId))
    let survey = surveyResult?.data ?? null

    let hasSurvey = survey != null

    let [showModal, setShowModel] = useState(false)
    let [showModalQuestion, setShowModelQuestion] = useState(false)

    if (!hasSurvey) {
        return (<></>)
    }

    return (
        <>
            <div className="mr-3 hover-pointer" onClick={() => setShowModel(true)}>
                <FontAwesomeIcon icon={allIcon.faListAlt} className="fa-w-16" />
                <span className='d-none d-sm-inline-block ml-1'>Khảo sát</span>
            </div >

            {showModal &&
                <CModal show={showModal}
                    scrollable
                    size=''
                    onClose={() => setShowModel(false)}>
                    <CModalHeader closeButton className='text-dark font-weight-bold h3'>
                        Khảo sát
                    </CModalHeader>
                    <CModalBody>
                        <div className='text-dark'>
                            {survey.title != '' &&
                                <p>{survey.title}</p>
                            }
                            {survey.description != '' &&
                                <p dangerouslySetInnerHTML={{ __html: survey.description }}></p>
                            }
                            <button className='btn btn-info' onClick={() => { setShowModel(false); setShowModelQuestion(true) }}>Bắt đầu</button>
                        </div>
                    </CModalBody>
                </CModal>
            }

            {showModalQuestion &&
                <CModal show={showModalQuestion}
                    scrollable
                    size='xl'
                    onClose={() => setShowModelQuestion(false)}>
                    <CModalHeader closeButton className='text-dark font-weight-bold h3'>
                        Khảo sát...
                    </CModalHeader>
                    <CModalBody>
                        <SurveyView survey={survey} onSuccess={() => setShowModelQuestion(false)} />
                    </CModalBody>
                </CModal>
            }
        </>
    )
}

const SurveyView = ({ survey, onSuccess }) => {
    let [questions, setQuestions] = useState(JSON.parse(survey.content));
    let [error, setError] = useState('')

    const validate = () => {
        for (let index = 0; index < questions.length; index++) {
            const question = questions[index];
            if (question.type == QuestionType.FreeText)
                question.error = string_isNullOrEmpty(question.answerText)
            else
                question.error = !question.answers.some(r => r.isChecked)
        }

        return !questions.some(r => r.error);
    }

    const onSubmit = () => {

        if (!validate()) {
            setQuestions([...questions])
            setError('Vui lòng hoàn thành tất cả câu hỏi trong bài khảo sát.')
            return
        }

        setQuestions([...questions])
        setError('')
        let model = {
            surveyId: survey.id,
            content: JSON.stringify(questions)
        }

        courseService.submitSurvey(model)
            .then(res => {
                if (res.isSuccess) {
                    alertActions.success("Gửi khảo sát thành công!")
                    onSuccess?.call()
                }
            })
    }

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

    const onTextBoxChange = (question, value) => {
        question.answerText = value
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

                        {question.type === QuestionType.FreeText &&
                            <div className="answer-item">
                                <textarea className={`Input_input Input_m ${question.error ? 'border-danger' : ''}`}
                                    placeholder='Nhập câu trả lời'
                                    onChange={(e) => { onTextBoxChange(question, e.target.value) }} />
                            </div>
                        }
                    </div>
                </div>
            ))}


            <div className="quiz-actions flex-column">
                <label className='text-danger'>{error}</label>
                <button className="ranks_primary base_button sizes_l quiz-submit"
                    type="button"
                    onClick={onSubmit}>
                    <div className="base_inner sizes_inner"><span className="base_text">Gửi kết quả</span></div>
                </button>
            </div>
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

export { SurveyButton }