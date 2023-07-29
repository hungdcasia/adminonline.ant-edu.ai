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

const certificateModel = (item) => {
    return {
        courseId: item.courseId ?? 0,
        name: item.name ?? '',
        description: item.description ?? '',
        icon: item.icon ?? '',
        questionNumber: item.questionNumber ?? 30,
        passCondition: item.passCondition ?? 80,
        duration: item.duration ?? 60,
    }
}

const CourseCertificate = () => {
    let { id } = useParams();
    const queryClient = useQueryClient()
    let [editing, setEditing] = useState(false)

    const { data: result } = useQuery(['course-certificate', id], () => courseService.getCertificate(id))
    let certificate = result?.data ?? null

    let hasCertificate = certificate != null

    const createClick = () => {
        setEditing(true)
    }

    const onSuccessCreate = (survey) => {
        setEditing(false)
        queryClient.invalidateQueries(['course-certificate', id])
    }

    const onSuccessEditSurvey = (survey) => {
        queryClient.invalidateQueries(['course-certificate', id])
        setEditing(false)
    }

    return (
        <CRow alignHorizontal='center'>
            {!hasCertificate &&
                <>
                    <CCol sm='12'>
                        {!editing ?
                            <CButton color="info" onClick={createClick}>Setting</CButton> :
                            <CertificateForm item={certificateModel({ courseId: id })} editing={editing} onSuccess={onSuccessCreate} onCancel={() => { setEditing(false) }} />
                        }
                    </CCol>
                </>
            }

            {hasCertificate &&
                <CCol sm='12'>
                    <CertificateForm item={certificate} editing={editing} onSuccess={onSuccessEditSurvey} onCancel={() => { setEditing(false) }} onEditClicked={() => { setEditing(true) }} />
                </CCol>
            }
        </CRow>
    )
}

const CertificateForm = ({ item, onSuccess, onCancel, editing, onEditClicked }) => {
    let [name] = useFormField({ value: item.name, rules: [{ rule: 'required', message: 'Please Input' }] })
    let [description] = useFormField({ value: item.description, rules: [] })
    let [icon] = useFormField({ value: item.icon, rules: [] })
    let [questionNumber] = useFormField({ value: item.questionNumber, rules: [{ rule: 'numeric|min:1,num', message: 'Please input' }] })
    let [duration] = useFormField({ value: item.duration, rules: [{ rule: 'numeric|min:1,num', message: 'Please input' }] })
    let [passCondition] = useFormField({ value: item.passCondition, rules: [{ rule: 'numeric|min:1,num|max:100,num', message: 'Please input number in range 1-100' }] })
    let inputFile = useRef()
    let [form] = useForm([name, description, questionNumber, duration, passCondition,])

    const onSubmit = e => {

        if (!form.valid()) {
            return;
        }

        var model = {
            courseId: item.courseId ?? 0,
            name: name.value,
            description: description.value,
            icon: icon.value,
            questionNumber: questionNumber.value,
            passCondition: passCondition.value,
            duration: duration.value,
        };

        // let promise = null;
        // if (item.id == 0) {
        //     promise = surveyService.create(model);
        // } else {
        //     promise = surveyService.update(model);
        // }

        courseService.updateCertificate(item.courseId, model).then((res) => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                onSuccess(res.data);
            }
        });
    }

    const onChangeImage = () => {
        inputFile.current.click()
    }

    const onSelectThumFile = (event) => {
        event.stopPropagation()
        event.preventDefault()
        if (event.target.files && event.target.files.length > 0) {
            var file = event.target.files[0]
            uploadService
                .uploadImage(file)
                .then((res) => {
                    if (res.isSuccess) {
                        icon.value = uploadService.getImageUrl(res.data)
                        icon.refresh?.call()
                    }
                })
                .finally(() => {
                    event.target.value = ''
                })
        }
    }

    return (
        <>
            <CRow alignHorizontal='center'>
                <CCol xs='12'>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <span className="navbar-brand h4"></span>
                            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            </ul>
                            <div className="form-inline my-2 my-lg-0">
                                {editing ?
                                    <>
                                        <CButton className={'float-right mr-3'}
                                            color="success"
                                            onClick={onSubmit}>
                                            <FontAwesomeIcon icon={allIcon.faSave} /> Lưu
                                        </CButton>
                                        <CButton className={'float-right mb-0'}
                                            color="info"
                                            onClick={onCancel}>
                                            <FontAwesomeIcon icon={allIcon.faTrashAlt} /> Hủy
                                        </CButton>
                                    </> :
                                    <CButton className={'float-right mb-0'}
                                        color="info"
                                        onClick={onEditClicked}>
                                        <FontAwesomeIcon icon={allIcon.faPencilAlt} /> Sửa
                                    </CButton>
                                }
                            </div>
                        </div>
                    </nav>
                    <CRow>
                        <CCol xs="12" lg="12" >
                            <CCard>
                                <CCardHeader>
                                    <span className='h5'>Thông tin cấu hình chứng chỉ</span>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput name='title'
                                        label='Tên'
                                        required
                                        rawProps={{ readOnly: !editing }}
                                        field={name}
                                    />

                                    <TextInput name='description'
                                        label='Mô tả'
                                        required
                                        rawProps={{ readOnly: !editing }}
                                        field={name}
                                    />

                                    <span className="h5">Icon</span>
                                    <ImageInput
                                        name="thumb"
                                        label=""
                                        rawProps={{ style: { width: '200px' } }}
                                        field={icon}
                                    />
                                    <input
                                        type="file"
                                        id="file"
                                        ref={inputFile}
                                        onChange={onSelectThumFile}
                                        accept="image/png, image/jpeg, image/svg, image/jpg"
                                        style={{ display: 'none' }}
                                    />
                                    {editing &&
                                        <CButton type="link" onClick={onChangeImage}>
                                            Tải lên
                                        </CButton>
                                    }

                                    <NumberInput name='questionNumber'
                                        label='Số lượng câu hỏi'
                                        required
                                        rawProps={{ readOnly: !editing }}
                                        field={questionNumber}
                                    />

                                    <NumberInput name='passCondition'
                                        label='Điều kiện đạt (%)'
                                        required
                                        rawProps={{ readOnly: !editing }}
                                        field={passCondition}
                                    />

                                    <NumberInput name='duration'
                                        label='Thời gian làm bài (phút)'
                                        required
                                        rawProps={{ readOnly: !editing }}
                                        field={duration}
                                    />

                                </CCardBody>
                            </CCard>


                        </CCol>
                    </CRow>
                </CCol>
            </CRow>
        </>
    );
}

export { CourseCertificate }