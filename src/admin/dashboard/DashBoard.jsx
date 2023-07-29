import CIcon from '@coreui/icons-react';
import {
    CBadge,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CForm,
    CFormGroup,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CInvalidFeedback,
    CLabel,
    CRow,
    CValidFeedback
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { courseService, categoryService, statisticService } from "../services";
import { history, NumberHelpers, string_to_slug, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, SelectInput, TextInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { Link } from "react-router-dom";
import { CChartLine, CChartDoughnut } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'

const DashBoard = (props) => {
    let [stats, setStats] = useState({});
    let [courses, setCourses] = useState([])
    let [topCourses, setTopCourses] = useState()
    let [topCoursesByRevenue, setTopCoursesByRevenue] = useState()

    const prepareTopCourseData = (courses) => {

    }

    useEffect(() => {
        statisticService.getSystemStas()
            .then(res => {
                if (res.isSuccess) {
                    setStats(res.data)
                }
            })

        statisticService.topCourseByRegistered()
            .then(res => {
                if (res.isSuccess) {
                    let data = res.data
                    let total = data.totalRegistered
                    let courses = data.topCourses
                    courses.push({ name: "Còn lại", registered: total - courses.reduce((sum, a) => sum + a.registered, 0) })

                    let answer = {
                        labels: courses.map(r => r.name),
                        datasets: [
                            {
                                data: courses.map(r => r.registered),
                                backgroundColor: [
                                    '#ff5252',
                                    '#ffaf00',
                                    '#52d726',
                                    "#2dcb75",
                                    "#5fb7d4",
                                    "#c9c9c9"
                                ],
                                hoverBackgroundColor: [
                                    '#ff5252',
                                    '#ffaf00',
                                    '#52d726',
                                    "#2dcb75",
                                    "#5fb7d4",
                                    "#c9c9c9"
                                ],
                            }],

                    }

                    setTopCourses(answer)
                }
            })

        statisticService.topCourseByRevenue()
            .then(res => {
                if (res.isSuccess) {
                    let data = res.data
                    let total = data.totalRevenue
                    let courses = data.topCourses
                    courses.push({ name: "Còn lại", revenue: total - courses.reduce((sum, a) => sum + a.revenue, 0) })

                    let answer = {
                        labels: courses.map(r => r.name),
                        datasets: [
                            {
                                data: courses.map(r => r.revenue),
                                backgroundColor: [
                                    '#ff5252',
                                    '#ffaf00',
                                    '#52d726',
                                    "#2dcb75",
                                    "#5fb7d4",
                                    "#c9c9c9"
                                ],
                                hoverBackgroundColor: [
                                    '#ff5252',
                                    '#ffaf00',
                                    '#52d726',
                                    "#2dcb75",
                                    "#5fb7d4",
                                    "#c9c9c9"
                                ],
                            }],

                    }

                    setTopCoursesByRevenue(answer)
                }
            })
    }, [])

    return (
        <div className=''>
            <CRow>
                <CCol lg='3' xl='3'>
                    <div className="card text-white bg-gradient-primary">
                        <div className="card-body pb-0 d-flex flex-column">
                            <div>
                                <div className="h4">Tổng số user</div>
                                <div className="h1 mb-3 mt-2" style={{ width: '100%', textAlign: 'end' }}>{NumberHelpers.toDefautFormat(stats.totalUser)}</div>
                            </div>
                        </div>
                    </div>
                </CCol>

                <CCol lg='3' xl='3'>
                    <div className="card text-white bg-gradient-info">
                        <div className="card-body pb-0 d-flex flex-column">
                            <div>
                                <div className="h4">Tổng số khóa học</div>
                                <div className="h1 mb-3 mt-2" style={{ width: '100%', textAlign: 'end' }}>{NumberHelpers.toDefautFormat(stats.totalCourse)}</div>
                            </div>
                        </div>
                    </div>
                </CCol>

                <CCol lg='3' xl='3'>
                    <div className="card text-white bg-gradient-warning">
                        <div className="card-body pb-0 d-flex flex-column">
                            <div>
                                <div className="h4">Lượt đăng ký học</div>
                                <div className="h1 mb-3 mt-2" style={{ width: '100%', textAlign: 'end' }}>{NumberHelpers.toDefautFormat(stats.totalRegister)}</div>
                            </div>
                        </div>
                    </div>
                </CCol>

                <CCol lg='3' xl='3'>
                    <div className="card text-white bg-gradient-danger">
                        <div className="card-body pb-0 d-flex flex-column">
                            <div>
                                <div className="h4">Tổng doanh thu (VND)</div>
                                <div className="h1 mb-3 mt-2" style={{ width: '100%', textAlign: 'end' }}>{NumberHelpers.toDefautFormat(stats.totalRevenue)}</div>
                            </div>
                        </div>
                    </div>
                </CCol>
            </CRow>

            <CRow>
                <CCol xl='6' lg='6'>
                    <CCard>
                        <div className="card-header font-weight-bold">Top khóa học được đăng ký nhiều</div>
                        <div className="chart-wrapper">
                            {topCourses &&
                                <CChartDoughnut type="doughnut" datasets={topCourses.datasets} labels={topCourses.labels} />
                            }
                        </div>
                    </CCard>
                </CCol>

                <CCol xl='6' lg='6'>
                    <CCard>
                        <div className="card-header font-weight-bold">Top khóa học theo doanh thu</div>
                        <div className="chart-wrapper">
                            {topCoursesByRevenue &&
                                <CChartDoughnut type="doughnut" datasets={topCoursesByRevenue.datasets} labels={topCoursesByRevenue.labels} />
                            }
                        </div>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    )
}

export { DashBoard }