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
import { string_to_slug, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, SelectInput, TextInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { blogCategoryService } from '../services/blog-category.service';

const { SearchBar, ClearSearchButton } = Search;

const fields = [
    { key: "name", label: "Tên", _style: { width: '30%' } },
    { key: "description", label: "Mô tả", _style: { width: '30%' } },
    { key: "active", label: "Trạng thái", _style: { width: '10%' } },
    { key: "action", label: "", _style: { width: '10%' } }
];

const createModel = () => {
    return {
        id: 0,
        name: '',
        description: '',
        slug: '',
        active: true
    }
}

const getBadge = status => {
    switch (status) {
        case true: return 'success'
        case false: return 'secondary'
        default: return 'primary'
    }
}

const BlogCategories = props => {
    let [groups, setGroups] = useState([]);
    let [editing, setEditing] = useState();

    const getGroups = () => {
        blogCategoryService.getCategories()
            .then((res) => {
                if (res.isSuccess) {
                    setGroups(res.data);
                }
            });
    };

    const onCreateClick = () => {
        setEditing(createModel());
    }

    useEffect(() => {
        getGroups();
    }, []);

    const editClicked = item => {
        setEditing(item)
    }

    const deleteItem = (item) => {
        blogCategoryService.deleteCategory(item.id).then(res => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                getGroups();
            }
        });
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

    const columns = [
        {
            dataField: 'id',
            text: '#',
            type: 'number',
            sort: true,
            style: {
                width: '70px',
            }
        },
        {
            dataField: 'name',
            text: 'Tên',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => cellContent
        },
        {
            dataField: 'description',
            text: 'Mô tả',
            sort: true,
            canFilter: true,
            type: 'string',
        },
        {
            dataField: 'active',
            text: 'Trạng thái',
            canFilter: true,
            type: 'bool',
            formatter: (cellContent, row) => (
                <CBadge color={getBadge(cellContent)}>
                    {cellContent ? "Hiện" : "ẩn"}
                </CBadge>
            )
        },
        {
            dataField: 'action',
            text: '',
            style: {
                width: '10%',
            },
            formatter: (cellContent, item) => (
                <div className="d-flex justify-content-center">
                    <CButton className='mx-1'
                        color="light"
                        size="sm"
                        onClick={() => { editClicked(item) }}
                    >
                        <FontAwesomeIcon icon={allIcon.faPencilAlt} />
                    </CButton>
                    <CButton
                        className='mx-1'
                        color="light"
                        size="sm"
                        onClick={() => { deleteClicked(item) }}
                    >
                        <FontAwesomeIcon icon={allIcon.faTrashAlt} />
                    </CButton>
                </div>
            )
        }
    ]

    return (
        <>
            <CRow className={editing ? 'd-none' : ''}>
                <CCol xs="12" lg="12" className='h-100'>
                    <CCard>
                        <CCardHeader>
                            <span className='h3'>Quản lý danh mục</span>
                            <div className="card-header-actions">
                                <CButton className={'float-right mb-0'}
                                    onClick={onCreateClick}
                                    title='Create'>
                                    <FontAwesomeIcon icon={allIcon.faPlus} /> Thêm
                                </CButton>
                            </div>
                        </CCardHeader>
                        <CCardBody>

                            <ToolkitProvider
                                keyField="id"
                                data={groups}
                                columns={columns}
                                search={{ searchFormatted: true }}
                            >
                                {
                                    props => (
                                        <div>
                                            <SearchBar {...props.searchProps} placeholder='Nhập để tìm kiếm' />
                                            {/* <hr /> */}
                                            <BootstrapTable striped
                                                hover
                                                {...props.baseProps}
                                                pagination={paginationFactory({
                                                    // page: paging.page,
                                                    sizePerPage: 20,
                                                    // totalSize: paging.total,
                                                    showTotal: true,
                                                    sizePerPageList: [
                                                        { text: '5', value: 5 },
                                                        { text: '10', value: 10 },
                                                        { text: '20', value: 20 },
                                                        { text: '50', value: 50 },
                                                        { text: '100', value: 100 },
                                                        { text: '200', value: 200 },
                                                        { text: '500', value: 500 },
                                                    ]
                                                })}
                                            />
                                        </div>
                                    )
                                }
                            </ToolkitProvider>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            {editing &&
                <EditForm onCancel={() => { setEditing(false) }} item={editing} onSuccess={() => { getGroups(); setEditing(false); }} />
            }
        </>
    )
}

const EditForm = (props) => {
    const { item, onSuccess } = props;
    let [name] = useFormField({ value: item?.name, rules: [{ rule: 'required', message: 'Please Input' }] })
    let [description] = useFormField({ value: item?.description ?? '' })
    let [slug] = useFormField({ value: item?.slug ?? '', rules: [{ rule: 'required', message: 'Please Input' }] })
    let [active] = useFormField({ value: item ? item.active : true })
    let [form] = useForm([name, description, slug, active])

    const onSubmit = e => {
        if (form.valid()) {
            var model = {
                id: item.id,
                name: name.value,
                description: description.value,
                active: active.value,
                slug: slug.value
            };
            let promise = null;
            if (item.id == 0) {
                promise = blogCategoryService.createCategory(model);
            } else {
                promise = blogCategoryService.updateCategory(model);
            }

            promise.then((res) => {
                if (res.isSuccess) {
                    alertActions.successUpdate();
                    onSuccess(res.data);
                }
            });
        }
    }

    const onNameChange = () => {
        slug.value = string_to_slug(name.value);
        slug.refresh?.call();
    }

    return (
        <>
            <CRow alignHorizontal='center'>
                <CCol xs='12'>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <span className="navbar-brand h4">{item.id == 0 ? 'Thêm' : 'Sửa'} danh mục</span>
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
                                    onClick={() => props.onCancel?.call()}>
                                    <FontAwesomeIcon icon={allIcon.faTrashAlt} /> Hủy
                                </CButton>
                            </div>
                        </div>
                    </nav>
                    <CRow>
                        <CCol xs="12" lg="12" >
                            <CCard>
                                <CCardHeader>
                                    <span className='h5'>Thông tin cơ bản</span>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput name='name'
                                        label='Tên'
                                        required
                                        onBlur={onNameChange}
                                        field={name}
                                    />
                                    <TextInput name='description'
                                        label='Mô tả'
                                        field={description}
                                    />
                                    {/* <TextInput name='slug'
                                        label='slug'
                                        required
                                        field={slug}
                                    /> */}
                                    <CheckboxInput name='active'
                                        label='Hiển thị'
                                        field={active}
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

export { BlogCategories }