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
import { useEffect, useRef, useState } from 'react'
import { courseService, categoryService, uploadService, donateAccountService, userService } from "../services";
import { history, string_to_slug, UrlHelpers, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, ImageInput, PageToolBar, SelectInput, TextAreaInput, TextInput, NumberInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { Link, Route, Switch, useParams } from "react-router-dom";
import { Requirement, WillLearn } from './CourseCreate';
import { useQuery, useQueryClient } from 'react-query';
import CourseDetail from './CourseDetail';
import { Tab, TabLinkItem } from '../../shared/tabs/TabComponent';
import CourseLessons from './CourseLessons';
import Students from './Students';
import { CourseSurvey } from './CourseSurvey';
import { CourseUserSurvey } from './CourseUserSurveys';
import { QuestionBank } from './QuestionBank';
import { CourseCertificate } from './CourseCertificate';

const CoursePage = props => {

    let { id } = useParams();
    const queryClient = useQueryClient()
    const { data: categoriesResult } = useQuery(['course-categories'], () => categoryService.getCategories, { staleTime: 300000 })
    const { data: courseResult } = useQuery(['course', id], () => courseService.getDetail(id), { staleTime: 60000 })
    let course = courseResult?.data?.course

    useEffect(() => {
        return () => {
            queryClient.removeQueries('course-categories')
            queryClient.removeQueries(['userCourses', id])
        }
    }, [])
    return (
        <div className='container-fluid px-0'>
            <div className='row'>
                <div className='col-12'>
                    <PageToolBar><span className='h3'>{course?.name}</span></PageToolBar>
                </div>
            </div>
            <div className='row'>
                <div className='col-12'>
                    <Tab>
                        <TabLinkItem to={`/admin/courses/${id}`} label='Thông tin chung' />
                        <TabLinkItem to={`/admin/courses/${id}/lessons`} label='Nội dung học' />
                        <TabLinkItem to={`/admin/courses/${id}/students`} label='Học viên' />
                        {/* <TabLinkItem to={`/admin/courses/${id}/surveys`} label='Khảo sát' /> */}
                        {/* <TabLinkItem to={`/admin/courses/${id}/user-surveys`} label='KQ Khảo sát' /> */}
                        <TabLinkItem to={`/admin/courses/${id}/questions`} label='Ngân hàng câu hỏi' />
                        <TabLinkItem to={`/admin/courses/${id}/certificate`} label='Chứng chỉ' />
                    </Tab>
                </div>
            </div>
            <Switch>
                <Route path='/admin/courses/:id/lessons' component={CourseLessons} />
                <Route path='/admin/courses/:id/students' component={Students} />
                {/* <Route path='/admin/courses/:id/surveys' component={CourseSurvey} /> */}
                {/* <Route path='/admin/courses/:id/user-surveys' component={CourseUserSurvey} /> */}
                <Route path='/admin/courses/:id/questions' component={QuestionBank} />
                <Route path='/admin/courses/:id/certificate' component={CourseCertificate} />
                <Route path='/admin/courses/:id' component={CourseDetail} />
            </Switch>
        </div>
    )
}


export default CoursePage