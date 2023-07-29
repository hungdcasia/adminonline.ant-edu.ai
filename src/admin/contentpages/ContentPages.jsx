import CIcon from '@coreui/icons-react';
import APICONFIGS from '../../api-configs.json';
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
    CPagination,
    CRow,
    CValidFeedback
} from '@coreui/react'
import { useEffect, useRef, useState } from 'react'
import { store, string_to_slug, UrlHelpers, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, ImageInput, MyUploadAdapter, PageToolBar, SelectInput, TextInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { contentPageService, uploadService, userService } from '../services';
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Moment from 'react-moment';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const fields = [
    { key: "id", label: "#", _style: { width: '5%' } },
    { key: "name", label: "Name", _style: { width: '20%' } },
    { key: "url", label: "Url", _style: { width: '20%' } },
    // { key: "openNew", label: "OpenNew", _style: { width: '20%' } },
    { key: "modifiedDateTime", label: "Last Update", _style: { width: '10%' } },
    { key: "action", label: "", _style: { width: '10%' } }
];

const createModel = () => {
    return {
        id: 0,
        name: '',
        content: '',
        url: '',
        openNew: false
    }
}

const ContentPageList = props => {
    let [pages, setPages] = useState([]);
    let [editing, setEditing] = useState();


    const getPages = () => {
        contentPageService.getList()
            .then((res) => {
                if (res.isSuccess) {
                    setPages(res.data);
                }
            });
    };

    const reloadPages = () => {
        getPages();
    }

    useEffect(() => {
        getPages();
    }, []);

    const editClicked = item => {
        setEditing(item)
    }

    const onCreateClick = () => {
        setEditing(createModel())
    }

    const deleteItem = (item) => {
        contentPageService.remove(item.id)
            .then(res => {
                if (res.isSuccess) {
                    reloadPages();
                }
            })
    }

    const deleteClicked = item => {
        modalActions.show({
            title: 'Bạn chắc chắn muốn xóa mục này?',
            ok: 'Chắc chắn',
            cancel: "Không",
            onCancel: () => {

            },
            onOk: () => {
                deleteItem(item);
            }
        });
    }

    const onSuccess = item => {
        reloadPages();
        setEditing(false);
    }

    return (
        <>
            <CRow className={editing ? 'd-none' : ''}>
                {/* <UserFilter /> */}
                <CCol xs='12' lg='12'>
                    <PageToolBar>
                        <CButton className={'float-right mb-0'}
                            onClick={onCreateClick}
                            defaultChecked
                            title='Create'>
                            <FontAwesomeIcon icon={allIcon.faPlus} />
                            Thêm
                        </CButton>
                    </PageToolBar>
                </CCol>
                <CCol xs="12" lg="12" className='h-100'>
                    <CCard>
                        <CCardHeader>
                            <span className='h3'>Quản lý trang nội dung</span>
                            <div className="card-header-actions">

                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={pages}
                                fields={fields}
                                striped
                                hover
                                border
                                itemsPerPage={20}
                                scopedSlots={{
                                    'name': (item) => (
                                        <td>
                                            <a href='#' onClick={(e) => { editClicked(item); e.preventDefault(); }}>{item.name}</a>
                                        </td>
                                    ),
                                    'modifiedDateTime': (item) => (
                                        <td>
                                            <Moment date={item.modifiedDateTime} format="YYYY/MM/DD HH:mm" />
                                        </td>
                                    ),
                                    'id': (item) => (
                                        <td>
                                            {item.id}
                                        </td>
                                    ),
                                    'action': (item, index) => (
                                        <td >
                                            <div className="py-2 d-flex justify-content-center">
                                                <CButton
                                                    className='ml-3'
                                                    color="light"
                                                    size="sm"
                                                    title='Xóa'
                                                    onClick={() => { deleteClicked(item, index) }}
                                                >
                                                    <FontAwesomeIcon icon={allIcon.faTrashAlt} />
                                                </CButton>
                                            </div>
                                        </td>
                                    )
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            {editing &&
                <ContentPageForm onCancel={() => { setEditing(false) }} item={editing} onSuccess={onSuccess} />
            }
        </>
    )
}

const ContentPageForm = ({ item, onCancel, onSuccess }) => {
    let [name] = useFormField({
        value: item.name,
        rules: [{ rule: 'required', message: 'Please Input' }],
    })
    let [content, setContent] = useState(item.content ?? '')

    let [url] = useFormField({
        value: item.url,
        rules: [{ rule: 'required', message: 'Please Input' }],
    })

    let [newPage] = useFormField({ value: item.openNew ?? false })

    const onSubmit = () => {
        let model = {
            id: item.id,
            name: name.value,
            content: content,
            url: url.value,
            openNew: newPage.value
        }
        let prom = item.id == 0 ? contentPageService.create(model) : contentPageService.update(model)
        prom.then(res => {
            if (res.isSuccess) {
                alertActions.successUpdate()
            }
        }).finally(() => {
            onSuccess()
        })
    };
    return (
        <CRow>
            <CCol>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        {/* <span className="navbar-brand h4">{item.id == 0 ? 'Thêm tài khoản' : 'Cập nhật tài khoản'}</span> */}
                        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        </ul>
                        <div className="form-inline my-2 my-lg-0">
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
                        </div>
                    </div>
                </nav>
                <CCard>
                    <CCardHeader></CCardHeader>
                    <CCardBody>
                        <TextInput
                            name="name"
                            label="Tên"
                            field={name}
                            rawProps={{}}
                        />

                        <TextInput
                            name="url"
                            label="Url"
                            field={url}
                            rawProps={{}}
                        />

                        <CheckboxInput
                            name="newPage"
                            label="Trang mới"
                            rawProps={{}}
                            field={newPage}
                        />

                        <CFormGroup className=''>
                            <CLabel>Nội dung</CLabel>
                            <CKEditor
                                editor={ClassicEditor}
                                config={{
                                    fontSize: {
                                        options: [
                                            9,
                                            11,
                                            13,
                                            'default',
                                            17,
                                            19,
                                            21
                                        ]
                                    },
                                    image: {
                                        toolbar: [
                                            'imageStyle:alignLeft',
                                            'imageStyle:alignCenter',
                                            'imageStyle:alignRight',
                                            '|',
                                            'resizeImage',
                                        ],

                                        // The default value.
                                        styles: [
                                            'full',
                                            'side',
                                            'alignLeft', 'alignCenter', 'alignRight', 'resizeImage', 'uploadImage'
                                        ]
                                    },
                                    toolbar: [
                                        'sourceEditing', '|',
                                        'heading', '|',
                                        'fontfamily', 'fontsize', "fontBackgroundColor", "fontColor", '|',
                                        'bold', 'italic', 'strikethrough', 'underline', 'alignment', '|',
                                        'bulletedList', 'numberedList', 'todoList', '|',
                                        'link', '|',
                                        'outdent', 'indent', '|',
                                        'insertTable', '|',
                                        'htmlEmbed', 'blockQuote', '|',
                                        'imageInsert', 'uploadImage', 'resizeImage', 'mediaEmbed', '|',
                                        'undo', 'redo', '|',
                                        'highlight',
                                    ]
                                }}
                                onReady={editor => {
                                    editor.plugins.get("FileRepository").createUploadAdapter = function (loader) {
                                        return new MyUploadAdapter(loader);
                                    };
                                }}
                                data={content}
                                onChange={(event, editor) => {
                                    const data = editor.getData()
                                    setContent(data)
                                }}
                                onBlur={(event, editor) => { }}
                                onFocus={(event, editor) => { }}
                            />
                        </CFormGroup>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export { ContentPageList }