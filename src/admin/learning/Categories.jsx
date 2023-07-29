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
import { CheckboxInput, PageToolBar, SelectInput, TextInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { categoryService } from '../services';
import DataTable from 'react-data-table-component';

const fields = [
    { key: "name", label: "Tên", _style: { width: '30%' } },
    { key: "description", label: "Mô tả", _style: { width: '30%' } },
    { key: "parent", label: "Nhóm", _style: { width: '20%' } },
    { key: "active", label: "Trạng thái", _style: { width: '10%' } },
    { key: "action", label: "", _style: { width: '10%' } }
];

const createModel = () => {
    return {
        id: 0,
        name: '',
        description: '',
        parent: 0,
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
const Categories = props => {
    let [groups, setGroups] = useState();
    let [editing, setEditing] = useState();

    const getGroups = () => {
        categoryService.getCategories()
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
                            <CDataTable
                                items={groups?.filter(r => r.level == 1)}
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
                                    'description': (item) => {
                                        return (
                                            <td>
                                                {item.description}
                                            </td>
                                        )
                                    },
                                    'parent': (item) => {
                                        var parent = groups.find(ele => ele.id == item.parent);
                                        return (
                                            <td>
                                                {parent == null ?
                                                    <span className='font-italic'><del>Bị xóa</del></span> :
                                                    <span>{parent.name}</span>
                                                }
                                            </td>
                                        )
                                    },
                                    'action': (item, index) => (
                                        <td >
                                            <div className="py-2 d-flex justify-content-center">
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
                <EditForm onCancel={() => { setEditing(false) }} item={editing} onSuccess={() => { getGroups(); setEditing(false); }} parents={groups.filter(r => r.level == 0)} />
            }
        </>
    )
}

const EditForm = (props) => {
    const { item, onSuccess, onCancel, parents } = props;
    let [name] = useFormField({ value: item?.name, rules: [{ rule: 'required', message: 'Please Input' }] })
    let [description] = useFormField({ value: item?.description ?? '' })
    let [slug] = useFormField({ value: item?.slug ?? '', rules: [{ rule: 'required', message: 'Please Input' }] })
    let [active] = useFormField({ value: item ? item.active : true })
    let [parent] = useFormField({ value: item ? item.parent : 0, rules: [{ rule: 'numeric|min:1,num', message: 'Please Select' }] })
    let [form] = useForm([name, description, slug, active, parent])

    const onSubmit = e => {
        if (form.valid()) {
            var model = {
                id: item.id,
                name: name.value,
                description: description.value,
                parent: parent.value,
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
                <CCol xs='9'>
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
                    <CRow>
                        <CCol xs="8" lg="8" >
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
                        <CCol xs="4" lg="4" >
                            <CCard>
                                {/* <CCardHeader>
                                    <span className='h5'>Nhóm danh mục</span>
                                </CCardHeader> */}
                                <CCardBody>
                                    <SelectInput name='parent'
                                        label='Nhóm danh mục'
                                        required
                                        field={parent}
                                        dataSource={parents}
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

export default Categories