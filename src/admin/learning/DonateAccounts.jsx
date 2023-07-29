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
import { donateAccountService } from '../services';
import DataTable from 'react-data-table-component';
import { useQuery, useQueryClient } from 'react-query';

const fields = [
    { key: "name", label: "Tên" },
    { key: "description", label: "Mô tả" },
    { key: "bankName", label: "Ngân hàng" },
    { key: "accountNumber", label: "Số TK" },
    { key: "owner", label: "Tên TK" },
    { key: "action", label: "", _style: { width: '40px' } }
];

const createModel = () => {
    return {
        id: 0,
        name: '',
        description: '',
        bankName: '',
        accountNumber: '',
        owner: ''
    }
}

const DonateAccounts = props => {
    let [editing, setEditing] = useState();

    const { data: getAllResult, isFetching } = useQuery(['donate-accounts'], () => { return donateAccountService.getAll() }, { staleTime: 600000 })
    let donateAccounts = getAllResult?.data ?? []
    const queryClient = useQueryClient()

    const onCreateClick = () => {
        setEditing(createModel());
    }

    useEffect(() => {

    }, []);

    const editClicked = item => {
        setEditing(item)
    }

    const deleteItem = (item) => {
        donateAccountService.remove(item.id).then(res => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                reload()
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

    const reload = () => {
        queryClient.invalidateQueries(['donate-accounts'])
    }

    return (
        <>
            <CRow className={editing ? 'd-none' : ''}>
                <CCol xs="12" lg="12" className='h-100'>
                    <CCard>
                        <CCardHeader>
                            <span className='h3'>TK Ủng Hộ</span>
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
                                items={donateAccounts}
                                fields={fields}
                                striped
                                hover
                                border
                                itemsPerPage={20}
                                pagination
                                scopedSlots={{
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
                <EditForm onCancel={() => { setEditing(false) }} item={editing} onSuccess={() => { reload(); setEditing(false); }} parents={donateAccounts.filter(r => r.level == 0)} />
            }
        </>
    )
}

const EditForm = (props) => {
    const { item, onSuccess, onCancel, parents } = props;
    let [name] = useFormField({ value: item?.name, rules: [{ rule: 'required', message: 'Please Input' }] })
    let [description] = useFormField({ value: item?.description ?? '' })
    let [bankName] = useFormField({ value: item?.bankName, rules: [{ rule: 'required', message: 'Please Input' }] })
    let [accountNumber] = useFormField({ value: item?.accountNumber, rules: [{ rule: 'required', message: 'Please Input' }] })
    let [owner] = useFormField({ value: item?.owner, rules: [{ rule: 'required', message: 'Please Input' }] })
    let [form] = useForm([name, description, bankName, accountNumber, owner])

    const onSubmit = e => {
        if (form.valid()) {
            var model = {
                id: item.id,
                name: name.value,
                description: description.value,
                bankName: bankName.value,
                accountNumber: accountNumber.value,
                owner: owner.value
            };
            let promise = null;
            if (item.id == 0) {
                promise = donateAccountService.create(model);
            } else {
                promise = donateAccountService.update(model);
            }

            promise.then((res) => {
                if (res.isSuccess) {
                    alertActions.successUpdate();
                    onSuccess(res.data);
                }
            });
        }
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
                                    <span className='h5'>Thông tin TK</span>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput name='name'
                                        label='Tên'
                                        required
                                        field={name}
                                    />
                                    <TextInput name='description'
                                        label='Mô tả'
                                        field={description}
                                    />
                                    <TextInput name='bank-name'
                                        label='Ngân hàng'
                                        required
                                        field={bankName}
                                    />
                                    <TextInput name='account-number'
                                        label='Số TK'
                                        required
                                        field={accountNumber}
                                    />
                                    <TextInput name='owner'
                                        label='Chủ TK'
                                        required
                                        field={owner}
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

export default DonateAccounts