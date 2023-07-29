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

const CertificateButton = ({ courseId }) => {

    const { data: userresult } = useQuery(['user-certificate', courseId], () => courseService.getUserCertificateByCourseId(courseId))
    let userCertificate = userresult?.data ?? null

    const { data: result } = useQuery(['course-certificate', courseId], () => courseService.getCertificate(courseId))
    let certificate = result?.data ?? null

    let hasCertificate = certificate != null

    let [showModal, setShowModel] = useState(false)

    if (!hasCertificate) {
        return (<></>)
    }

    const onStartClick = () => {
        setShowModel(false)
        courseService.assessmentCertificateAttempt(courseId)
            .then(res => {
                if (res.isSuccess) {
                    history.push('/assessment/' + res.data)
                }
            })
    }

    return (
        <>
            <div className="mr-3 hover-pointer" onClick={() => setShowModel(true)}>
                <FontAwesomeIcon icon={allIcon.faGraduationCap} className="fa-w-16" />
                <span className='d-none d-sm-inline-block ml-1'>Chứng chỉ</span>
            </div >

            {showModal &&
                <CModal show={showModal}
                    scrollable
                    size=''
                    onClose={() => setShowModel(false)}>
                    <CModalHeader closeButton className='text-dark font-weight-bold h3'>
                        Chứng chỉ
                    </CModalHeader>
                    <CModalBody>
                        {userCertificate == null ?
                            <div className='text-dark'>
                                <p>Để đạt chứng chỉ này bạn phải vượt qua bài kiểm tra có thời lượng {certificate.duration} phút, yêu cầu đúng {Math.ceil(certificate.questionNumber * certificate.passCondition / 100)}/{certificate.questionNumber} câu hỏi trắc nghiệm. </p>
                                {/* <div className='d-flex justify-content-center'>
                                <div className='d-flex flex-row'>
                                <img src={certificate.icon} style={{ width: "100px", height: '100px' }} />
                                <p>{certificate.name}</p>
                                <p>{certificate.description}</p>
                                </div>
                            </div> */}
                                <button className='btn btn-info' onClick={onStartClick}>Bắt đầu thi</button>
                            </div> :
                            <div className='w-100 d-flex flex-column'>
                                <div className='text-dark'>Bạn đã đạt được chứng chỉ của khóa học này.</div>
                                <Link to='/user/certificates' className='btn btn-link'>Trang cá nhân</Link>
                            </div>
                        }
                    </CModalBody>
                </CModal>
            }
        </>
    )
}

export { CertificateButton }