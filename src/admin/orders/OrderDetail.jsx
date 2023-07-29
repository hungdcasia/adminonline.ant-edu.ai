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
import { courseService, categoryService, uploadService } from "../services";
import { history, newFormField, string_to_slug, UrlHelpers, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, ImageInput, PageToolBar, SelectInput, TextAreaInput, TextInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { Link } from "react-router-dom";
import { orderService } from '../services/order.service';
import { orderStatusConstants } from '../../constants';

const getBadge = status => {
    switch (status) {
        case 'PENDING': return 'warning'
        case 'CANCELLED': return 'danger'
        case 'COMPLETED': return 'success'
        default: return 'primary'
    }
}

const getBadgeLabel = status => {
    switch (status) {
        case 'PENDING': return 'Chờ thanh toán'
        case 'CANCELLED': return 'Đã hủy'
        case 'COMPLETED': return 'Thành công'
        default: return 'primary'
    }
}

const OrderDetail = props => {

    let { id } = props.match.params;
    let [order, setOrder] = useState();
    let [editing] = useState(false);

    let [name] = useFormField({ value: '', rules: [{ rule: 'required', message: 'Please Input' }] })
    let [description] = useFormField({ value: '' })
    let [slug] = useFormField({ value: '', rules: [{ rule: 'required', message: 'Please Input' }] })
    let [active] = useFormField({ value: true })
    let [thumb] = useFormField({ value: '' })
    let [introVideo] = useFormField({ value: '' })
    let [price] = useFormField({ value: 0 })
    let inputFile = useRef();

    const getOrder = () => {
        if (id > 0)
            orderService.getDetail(id)
                .then((res) => {
                    if (res.isSuccess) {
                        let data = res.data
                        name.value = data.course.name
                        description.value = data.course.description
                        slug.value = data.course.slug
                        thumb.value = data.course.thumbnailImage
                        introVideo.value = data.course.introVideo
                        active.value = data.course.active
                        setOrder(data);
                    }
                });
    };

    useEffect(() => {
        getOrder();
    }, []);

    if (order == null) {
        return (<></>);
    }

    const changeStatus = (status) => {
        modalActions.show({
            title: `Xác nhận chuyển trạng thái đơn hàng thành "${getBadgeLabel(status)}"? Lưu ý thao tác này không thể hoàn tác!`,
            ok: `Đồng ý`,
            cancel: "Hủy",
            onOk: () => {
                orderService.updateStatus(id, status)
                    .then(res => {
                        if (res.isSuccess) {
                            alertActions.successUpdate();
                            getOrder();
                        }
                    })
                    .finally(() => {

                    });
            }
        });
    }

    return (
        <>
            <CRow alignHorizontal='center'>
                <CCol xs='12' lg="12">
                    <CRow>
                        <CCol xs="12" lg="12" className='h-100'>
                            <PageToolBar>
                                {order.status == orderStatusConstants.PENDING &&
                                    <>
                                        <CButton className={'float-right mr-3'}
                                            color="success"
                                            onClick={() => changeStatus(orderStatusConstants.COMPLETED)}>
                                            Hoàn thành
                                        </CButton>

                                        <CButton className={'float-right mr-3'}
                                            color="danger"
                                            onClick={() => changeStatus(orderStatusConstants.CANCELLED)}>
                                            Hủy
                                        </CButton>
                                    </>
                                }
                            </PageToolBar>
                            
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs='8' >
                            <CCard>
                                <CCardHeader>
                                    <span className='h5'>Thông tin đơn hàng -
                                        <CBadge color={getBadge(order.status)}>
                                            {getBadgeLabel(order.status)}
                                        </CBadge>
                                    </span>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput name='name'
                                        label='Khóa học'
                                        field={name}
                                        rawProps={{ readOnly: !editing }}
                                    />
                                    <TextAreaInput name='description'
                                        label='Mô tả'
                                        rawProps={{ readOnly: !editing, style: { height: '120px' } }}
                                        field={description}
                                    />
                                    <CFormGroup>
                                        <CLabel>Ảnh thumb</CLabel>
                                        <ImageInput name='thumb'
                                            label=''
                                            rawProps={{ readOnly: !editing, style: { width: '100%' } }}
                                            field={thumb}
                                        />
                                    </CFormGroup>
                                </CCardBody>
                            </CCard>

                        </CCol>
                        <CCol xs='4' >
                            <CCard>
                                <CCardHeader>
                                    <span className='h5'>Thông tin giá</span>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput name='price'
                                        label='Giá bán'
                                        rawProps={{ readOnly: !editing }}
                                        field={newFormField(order.price)}
                                    />
                                </CCardBody>
                            </CCard>
                            <CCard>
                                <CCardHeader>
                                    <span className='h5'>Tài khoản người dùng</span>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput name='userName'
                                        label='Tên hiển thị'
                                        rawProps={{ readOnly: !editing }}
                                        field={newFormField(order.user?.displayName)}
                                    />
                                    <TextInput name='userEmail'
                                        label='Email đăng nhập'
                                        rawProps={{ readOnly: !editing }}
                                        field={newFormField(order.user?.userName)}
                                    />
                                </CCardBody>
                            </CCard>
                            <CCard>
                                <CCardHeader className="container-fluid">
                                    <span className='h5'>Thông tin liên hệ</span>
                                    <div className="float-right">
                                    </div>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput name='contactName'
                                        label='Tên liên hệ'
                                        field={newFormField(order.contactName)}
                                        rawProps={{ readOnly: !editing }}
                                    />

                                    <TextInput name='contactPhone'
                                        label='Số điện thoại'
                                        field={newFormField(order.contactPhone)}
                                        rawProps={{ readOnly: !editing }}
                                    />

                                    <TextInput name='contactEmail'
                                        label='Email'
                                        field={newFormField(order.contactEmail)}
                                        rawProps={{ readOnly: !editing }}
                                    />
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>
        </>
    )
}


export default OrderDetail