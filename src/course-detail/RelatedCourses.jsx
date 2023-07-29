import React, { Component, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { NumberHelpers, UrlHelpers } from "../helpers";
import { courseService, userService } from "../services";
import { PurchaseBadge } from "./PurchaseBadge";
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
import { CourseGridItem2 } from '../courses/CourseGridItem';

const RelatedCourses = React.memo(function ({ courseId }) {

    let [courses, setCourses] = useState([])

    useEffect(() => {
        courseService.getRelatedCourses(courseId)
            .then((res) => {
                if (res.isSuccess) {
                    setCourses(res.data)
                }
            })
    }, [courseId])

    return (
        <div className="row d-none">
            {courses.length > 0 &&
                <>
                    <div className='col-12 px-0 h4 font-weight-bold pb-2'>
                        Có thể bạn quan tâm
                    </div>
                    {courses.slice(0, 4).map(item =>
                        <div key={item.id} className="col-12 px-0 my-1 course-item-wrapper py-0 cursor-pointer"
                            onClick={() => history.push(UrlHelpers.createCourseDetailUrl(item.slug, item.id))}>
                            <div className='row'>
                                <div className='col-4 pl-0'>
                                    <div className='w-100 h-100' style={{ backgroundImage: `url(${item.thumbnailImage})`, backgroundSize: 'cover' }}>
                                        <div className='w-100 h-100 bg-black opacity-25'></div>
                                    </div>
                                </div>
                                <div className='col-8 pb-5 pl-0 pt-2'>
                                    <div className='h4 mb-0'>{item.name}</div>
                                    <div className='h6 mb-0 font-italic'>{item.category?.name}</div>
                                    <div className='h6 pt-2' dangerouslySetInnerHTML={{ __html: item.description }}></div>
                                    <div className='course-item-footer border-0 px-0'>
                                        <ul>
                                            <li>
                                                <FontAwesomeIcon icon={allIcon.faUserAlt} />
                                            </li>
                                            <li>
                                                {item.registered}
                                            </li>
                                            {item.totalRate > 0 &&
                                                <li><FontAwesomeIcon icon={allIcon.faStar} style={{ color: 'gold' }} /> {Math.round(item.totalStar / item.totalRate * 10) / 10} ({NumberHelpers.toDefautFormat(item.totalRate)} đánh giá)</li>
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <Link to={UrlHelpers.createCourseDetailUrl(item.slug, item.id)} className='position-absolute w-100 h-100' style={{ top: 0 }}></Link>
                        </div>
                    )}
                </>
            }
        </div>
    )
})

export { RelatedCourses }