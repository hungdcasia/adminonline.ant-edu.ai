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
import { categoryService } from "../services";
import { string_to_slug, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, PageToolBar, TextInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import DataTable from 'react-data-table-component';
import memoize from 'memoize-one';

const fields = [
    { key: "name", label: "Tên" },
    { key: "description", label: "Mô tả" },
    { key: "active", label: "Trạng thái" },
    { key: "action", label: "", _style: { width: '20%' } }
];

const customStyles = {
    header: {
        style: {
            minHeight: '56px',
        },
    },
    headRow: {
        style: {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: '#00000022',
        },
    },
    rows: {
        style: {
            minHeight: '72px', // override the row height
            fontSize: '100%',
            // borderleft: '1px solid #d8dbe0'
        }
    },
    headCells: {
        style: {
            '&:not(:last-of-type)': {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                fontSize: '100%',
                fontWeight: 'bold !important',
                lineHeight: 'normal !important'
            }
        },
    },
    cells: {
        style: {
            paddingLeft: '8px', // override the cell padding for data cells
            paddingRight: '8px',
            fontSize: '100%',
            // borderRight: '1px solid #d8dbe0'
        },
    },
};

const columns = memoize((editClicked, deleteClicked) => [
    { selector: "name", name: "Tên", sortable: true },
    { selector: "description", name: "Mô tả" },
    {
        selector: "active", name: "Trạng thái", cell: item =>
            <CBadge color={getBadge(item.active)}>
                {item.active ? "Hiện" : "ẩn"}
            </CBadge>
    },
    {
        name: "action", cell: item => <>
            <CButton
                color="light"
                size="sm"
                onClick={() => { editClicked(item) }}
            >
                <FontAwesomeIcon icon={allIcon.faPencilAlt} />
            </CButton>
            <CButton
                className='ml-3'
                color="light"
                size="sm"
                onClick={() => { deleteClicked(item) }}
            >
                <FontAwesomeIcon icon={allIcon.faTrashAlt} />
            </CButton>
        </>
    }
]);

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
const CategoryGroups = props => {
    let [groups, setGroups] = useState();
    let [editing, setEditing] = useState();

    const getGroups = () => {
        categoryService.getCategories()
            .then((res) => {
                if (res.isSuccess) {
                    setGroups(res.data.filter(r => r.level == 0));
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
        categoryService.deleteCategory(item.id).then(res => {
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

    return (
        <>
            <CRow className={editing ? 'd-none' : ''}>
                <CCol xs="12" lg="12" className='h-100'>
                    <CCard>
                        <CCardHeader>
                            <span className='h3'>Nhóm danh mục</span>
                            <div className="card-header-actions">
                                <CButton className={'float-right mb-0'}
                                    onClick={onCreateClick}
                                    title='Create'>
                                    <FontAwesomeIcon icon={allIcon.faPlus} /> Thêm
                                </CButton>
                            </div>
                        </CCardHeader>
                        <CCardBody>

                            {/* <DataTable
                                columns={columns(editClicked, deleteClicked)}
                                data={groups}
                                customStyles={customStyles}
                            /> */}

                            <CDataTable
                                items={groups}
                                fields={fields}
                                striped
                                hover
                                border
                                itemsPerPage={20}
                                pagination
                                scopedSlots={{
                                    'active': (item) => (
                                        <td>
                                            <CBadge color={getBadge(item.active)}>
                                                {item.active ? "Hiện" : "ẩn"}
                                            </CBadge>
                                        </td>
                                    ),
                                    'action': (item, index) => (
                                        <td className="py-2 d-flex justify-content-center">
                                            <CButton
                                                color="light"
                                                size="sm"
                                                onClick={() => { editClicked(item, index) }}
                                            >
                                                <FontAwesomeIcon icon={allIcon.faPencilAlt} />
                                            </CButton>
                                            <CButton
                                                className='ml-3'
                                                color="light"
                                                size="sm"
                                                onClick={() => { deleteClicked(item, index) }}
                                            >
                                                <FontAwesomeIcon icon={allIcon.faTrashAlt} />
                                            </CButton>
                                        </td>
                                    )
                                }}
                            />
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
    const { item, onSuccess, onCancel } = props;
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
                promise = categoryService.createCategory(model);
            } else {
                promise = categoryService.updateCategory(model);
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
                <CCol xs='6' lg='6'>
                    <PageToolBar onBackClicked={onCancel} >
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
                    </PageToolBar>
                    <CRow >
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
                                    <TextInput name='slug'
                                        label='slug'
                                        required
                                        field={slug}
                                    />
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

export default CategoryGroups