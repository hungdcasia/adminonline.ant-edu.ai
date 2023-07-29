import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { BackButton } from "./BackButton";
import { userService } from "../services";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { alertActions, userActions } from "../actions";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import { NumberHelpers, UrlHelpers } from "../helpers";
import { Link } from "react-router-dom";
import { CModal, CModalBody, CModalHeader } from "@coreui/react";

const MyCoursesPage = props => {
    window.gtag('event', 'page_view', {
        page_location: window.location
    })

    let myCourses = useSelector(r => r.myCourses)
    const { courses } = myCourses
    let [courseDetail, setCourseDetail] = useState(null)

    useEffect(() => {
        userActions.getMyCourses();
    }, []);

    return (
        <div className="">
            <div className='row'>
                <span className='h2 font-weight-bold'>Khóa học của tôi</span>
            </div>
            {courses != null &&
                <>
                    {courses.map((item, index) => {

                        let totalPoint = item.userCourse.completedPoint
                        let medalIndex = item.course.medals.findIndex(r => totalPoint >= r.point)
                        let hasMedal = item.course.medals.length > 0
                        return (
                            <div className='row border Border-rounded CourseItem shadow my-3 position-relative' key={item.course.id}>
                                <div className='col-3 pl-0'>
                                    <div className='w-100 h-100 Border-rounded' style={{ backgroundImage: `url('${item.course.thumbnailImage}')`, backgroundSize: 'cover' }}>
                                    </div>
                                </div>
                                <div className='col-6 pl-0 pt-3 pb-3 m-6 d-flex flex-column justify-content-center'>
                                    <div className='h4 font-weight-bold'>{item.course.name}</div>
                                    <div className='pt-2 h6 text-white'>Bạn đã hoàn thành <span className="h5 text-active">{item.userCourse.progress}%</span> khóa học</div>
                                    <div className="w-100 h-10px rounded-pill bg-white-20 overflow-hidden">
                                        <div className="h-10px bg-white" style={{ width: `${item.userCourse.progress}%` }}></div>
                                    </div>
                                    {/* <div className='pt-3'>
                                        <Link to={UrlHelpers.createCourseDetailUrl(item.course.slug, item.course.id)}
                                            className='btn btn-default border-0 rounded-pill'>Học tiếp</Link>
                                    </div> */}
                                </div>
                                <div className='col-3 pl-0 pt-3 pb-3 d-flex align-items-center'>
                                    <div className="VerticalDivider"></div>
                                    <div className="w-100 text-center">
                                        <div className=''>
                                            <Link to={UrlHelpers.createCourseDetailUrl(item.course.slug, item.course.id)}
                                                className='btn btn-active border-0 rounded-pill font-weight-bold'>Đi tới bài học</Link>
                                        </div>
                                    </div>
                                    
                                </div>
                                {hasMedal &&
                                    <span className='position-absolute mx-auto text-center h4' style={{ top: 5, right: 5 }}
                                        onClick={() => setCourseDetail(item)}>
                                        {medalIndex == 0 &&
                                            <FontAwesomeIcon title='Huy chương tím' className='text-purple' icon={allIcon.faAward} size='2x' />
                                        }

                                        {medalIndex == 1 &&
                                            <FontAwesomeIcon title='Huy chương vàng' className='text-gold' icon={allIcon.faAward} size='2x' />
                                        }

                                        {medalIndex == 2 &&
                                            <FontAwesomeIcon title='Huy chương bạc' className='text-silver' icon={allIcon.faAward} size='2x' />
                                        }

                                        {medalIndex == -1 &&
                                            <FontAwesomeIcon className='text-dark opacity-20' icon={allIcon.faAward} size='2x' />
                                        }
                                    </span>
                                }
                            </div>
                        )
                    })}
                </>
            }

            {/* {courseDetail &&
                <CModal show={courseDetail != null}
                    scrollable
                    size='lg'
                    onClose={() => setCourseDetail(null)}>
                    <CModalHeader closeButton className='text-dark font-weight-bold h3'>
                        Huy chương
                    </CModalHeader>
                    <CModalBody>
                        <CourseMedal course={courseDetail.course} userCourse={courseDetail.userCourse} />
                    </CModalBody>
                </CModal>
            } */}
        </div>
    )
}

const CourseMedal = ({ course, userCourse }) => {
    let totalPoint = userCourse.completedPoint
    let medalIndex = course.medals.findIndex(r => totalPoint >= r.point)

    return (
        <div className='d-flex flex-column text-dark'>
            <div className='font-weight-bold'>Tổng điểm: {NumberHelpers.toDefautFormat(totalPoint)}</div>
            <table className="table table-borderless">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr className={medalIndex == 0 ? 'text-purple' : 'opacity-30'}>
                        <td><FontAwesomeIcon icon={allIcon.faAward} size='3x' /></td>
                        <td className='text-dark'>Huy chương tím ({NumberHelpers.toDefautFormat(course.medals[0].point)} điểm)</td>
                    </tr>
                    <tr className={medalIndex == 1 ? 'text-gold' : 'opacity-30'}>
                        <td><FontAwesomeIcon icon={allIcon.faAward} size='3x' /></td>
                        <td className='text-dark'>Huy chương vàng ({NumberHelpers.toDefautFormat(course.medals[1].point)} điểm)</td>
                    </tr>
                    <tr className={medalIndex == 2 ? 'text-silver' : 'opacity-30'}>
                        <td><FontAwesomeIcon icon={allIcon.faAward} size='3x' /></td>
                        <td className='text-dark'>Huy chương bạc ({NumberHelpers.toDefautFormat(course.medals[2].point)} điểm)</td>
                    </tr>
                </tbody>
            </table>
        </div >
    )
}

export { MyCoursesPage };