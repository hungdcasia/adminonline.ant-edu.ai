import CIcon from '@coreui/icons-react';
import {
    CBadge,
    CButton,
    CCard,
    CCardBody,
    CCardFooter,
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
    CModal,
    CPagination,
    CRow,
    CValidFeedback
} from '@coreui/react'
import { useEffect, useRef, useState } from 'react'
import { string_to_slug, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, ImageInput, SelectInput, TextInput, PasswordInput, FilterComponent } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { uploadService, userService } from '../services';
import Moment from 'react-moment';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Avatar } from '../../shared';
import moment from 'moment';
import { exportHelpers } from '../helpers';

const UserForm = ({ item, onSuccess, onCancel }) => {

    let [editing, setEditing] = useState(item.id == 0)

    let [displayName] = useFormField({ value: item?.displayName, rules: [{ rule: 'required', message: 'Please Input' }] })
    let [userName] = useFormField({ value: item?.userName, rules: [{ rule: 'required', message: 'Please Input' }] })
    let [email] = useFormField({ value: item?.email ?? '', rules: [{ rule: 'required', message: 'Please Input' }] })
    let [password] = useFormField({ value: '', rules: [{ rule: 'required', message: 'Please Input' }] })
    let [emailConfirmed] = useFormField({ value: item.emailConfirmed, rules: [] })
    let [active] = useFormField({ value: item.active })
    let [avatar] = useFormField({ value: item.avatar })
    let [form] = useForm([displayName, userName, email])
    let [formWithPassword] = useForm([displayName, userName, email, password])
    let inputFile = useRef();

    const onSubmit = e => {
        if (item.id == 0 && !formWithPassword.valid()) {
            return;
        }

        if (item.id > 0 && !form.valid()) {
            return;
        }

        var model = {
            id: item.id,
            displayName: displayName.value,
            userName: userName.value,
            email: email.value,
            emailConfirmed: emailConfirmed.value,
            avatar: avatar.value,
            active: active.value,
        };

        let promise = null;
        if (item.id == 0) {
            model['password'] = password.value
            promise = userService.create(model);
        } else {
            promise = userService.update(model);
        }

        promise.then((res) => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                onSuccess(res.data);
            }
        });
    }

    const onCancelClicked = () => {
        displayName.value = item.displayName;
        userName.value = item.userName;
        email.value = item.email;
        emailConfirmed.value = item.emailConfirmed;
        avatar.value = item.avatar;
        active.value = item.active;
        var arr = [displayName, userName, email, emailConfirmed, avatar, active];
        arr.forEach(element => {
            element.refresh?.()
        });
        setEditing(false)
        onCancel?.()
    }

    const onChangeImage = () => {
        inputFile.current.click();
    }

    const onSelectedFile = (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (event.target.files && event.target.files.length > 0) {
            var file = event.target.files[0];
            uploadService.uploadImage(file)
                .then(res => {
                    if (res.isSuccess) {
                        avatar.value = uploadService.getImageUrl(res.data);
                        avatar.refresh?.call()
                    }
                }).finally(() => {
                    event.target.value = '';
                });
        }
    }

    return (
        <>
            <CRow alignHorizontal='center'>
                <CCol xs='12'>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <span className="navbar-brand h4">{item.id == 0 ? 'Thêm tài khoản' : 'Thông tin tài khoản'}</span>
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
                                            color="danger"
                                            onClick={onCancelClicked}>
                                            <FontAwesomeIcon icon={allIcon.faTrashAlt} /> Hủy
                                        </CButton>
                                    </> :
                                    <CButton className={'float-right mr-3'}
                                        color="info"
                                        onClick={() => setEditing(true)}>
                                        <FontAwesomeIcon icon={allIcon.faPencilAlt} /> Sửa
                                    </CButton>
                                }
                            </div>
                        </div>
                    </nav>
                    <CRow>
                        <CCol xs="8" lg="8" >
                            <CCard>
                                <CCardHeader>
                                    <span className='h5'>Thông tin tài khoản</span>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput name='displayName'
                                        label='Tên hiển thị'
                                        required
                                        field={displayName}
                                        rawProps={{ disabled: !editing }}
                                    />
                                    <TextInput name='userName'
                                        label='TK đăng nhập'
                                        required
                                        field={userName}
                                        rawProps={{ disabled: !editing }}
                                    />
                                    <TextInput name='email'
                                        label='Email'
                                        rawProps={{ autocomplete: "new-email" }}
                                        required
                                        field={email}
                                        rawProps={{ disabled: !editing }}
                                    />

                                    {item.id == 0 &&
                                        <PasswordInput
                                            name='password'
                                            label='Mật khẩu'
                                            rawProps={{ autocomplete: "new-password" }}
                                            rawProps={{ disabled: !editing }}
                                            field={password} />
                                    }

                                    <CheckboxInput name='emailConfirmed'
                                        label='Xác thực email'
                                        field={emailConfirmed}
                                        rawProps={{ disabled: !editing }}
                                    />

                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol xs="4" lg="4" >
                            <CCard>
                                <CCardHeader>
                                    <span className='h5'>Trạng thái</span>
                                </CCardHeader>
                                <CCardBody>
                                    <CheckboxInput name='active'
                                        label='Hoạt động'
                                        field={active}
                                        rawProps={{ disabled: !editing }}
                                    />
                                </CCardBody>
                            </CCard>

                            <CCard>
                                <CCardHeader className="container-fluid">
                                    <span className='h5'>Ảnh đại diện</span>
                                    <div className="float-right">
                                        <input type='file' id='file' ref={inputFile}
                                            onChange={onSelectedFile}
                                            accept="image/png, image/jpeg, image/svg, image/jpg"
                                            style={{ display: 'none' }} />
                                        <CButton type='link' onClick={onChangeImage} disabled={!editing}><FontAwesomeIcon icon={allIcon.faUpload} /></CButton>
                                    </div>
                                </CCardHeader>
                                <CCardBody className='d-flex justify-content-center'>
                                    <ImageInput name='avatar'
                                        label=''
                                        rawProps={{ style: { width: '100px', height: '100px', borderRadius: '50%' } }}
                                        field={avatar}
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

export { UserForm }