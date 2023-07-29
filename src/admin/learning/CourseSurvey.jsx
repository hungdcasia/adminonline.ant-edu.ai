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
import { surveyModel } from '../surveys/SurveysModel';
import { SurveyForm } from '../surveys/SurveyForm';
import { surveyService } from '../services/survey.service';
import { SurveyView } from '../surveys/SurveyView';

const CourseSurvey = (props) => {
    let { id } = useParams();
    const queryClient = useQueryClient()
    let [createSurvey, setCreateSurvey] = useState(false)
    let [editSurvey, setEditSurvey] = useState(false)

    const { data: surveyResult } = useQuery(['course-survey', id], () => surveyService.getDetailByCourse(id))
    let survey = surveyResult?.data ?? null

    let hasSurvey = survey != null

    const createSurveyClick = () => {
        setCreateSurvey(true)
    }

    const onSuccessCreateSurvey = (survey) => {
        setCreateSurvey(false)
    }

    const onSuccessEditSurvey = (survey) => {
        queryClient.invalidateQueries(['survey', id])
        setEditSurvey(false)
    }

    return (
        <CRow alignHorizontal='center'>
            {(!hasSurvey && !createSurvey) &&
                <CCol sm='12'>
                    <CButton color="info" onClick={createSurveyClick}>Tạo survey</CButton>
                </CCol>
            }

            {createSurvey &&
                <CCol sm='12'>
                    <SurveyForm item={surveyModel({courseId: id, type: 'course'})} onSuccess={onSuccessCreateSurvey} onCancel={() => { setCreateSurvey(false) }} />
                </CCol>
            }

            {hasSurvey &&
                <CCol sm='12'>
                    {editSurvey ?
                        <SurveyForm item={survey} onSuccess={onSuccessEditSurvey} onCancel={() => { setEditSurvey(false) }} />
                        :
                        <SurveyView item={survey} onEditClick={() => { setEditSurvey(true) }} />
                    }
                </CCol>
            }
        </CRow>
    )
}

export { CourseSurvey }