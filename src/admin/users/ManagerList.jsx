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
    CModalBody,
    CModalHeader,
    CPagination,
    CRow,
    CValidFeedback
} from '@coreui/react'
import { useEffect, useRef, useState } from 'react'
import { string_to_slug, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, FilterComponent, ImageInput, PasswordInput, SelectInput, TextInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { uploadService, userService } from '../services';
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';
import AsyncSelect from 'react-select/async';
import { searchService } from '../../services';
import Moment from 'react-moment';
import moment from 'moment';
import { exportHelpers } from '../helpers';
import { Avatar } from '../../shared';
import BootstrapTable from 'react-bootstrap-table-next';
import { useQuery, useQueryClient } from 'react-query';

const RoleDataSource = [
    { id: 'ADMIN', name: 'ADMIN' },
    { id: 'OPERATOR', name: 'OPERATOR' },
    { id: 'TEACHER', name: 'TEACHER' }
]

const ManagerList = props => {
    const queryClient = useQueryClient()
    const { data: usersResult, isFetching } = useQuery(['admin-users'], () => { return getUsers() })

    let users = usersResult?.data ?? [];
    // let [users, setUsers] = useState([]);
    let [editing, setEditing] = useState(false);
    let [setpassword, setSetPassword] = useState();

    const getUsers = () => {
        return userService.getListAdmin()
    };

    const reloadUsers = () => {
        queryClient.invalidateQueries('admin-users')
    }

    const editClicked = user => {
        setEditing(user)
    }

    const lockItem = (user) => {
        userService.lockUser(user.id, !user.active)
            .then(res => {
                if (res.isSuccess) {
                    alertActions.successUpdate();
                    reloadUsers();
                }
            });
    }

    const lockClicked = user => {
        modalActions.show({
            title: user.active ? 'Bạn chắc chắn muốn khóa tài khoản này? (Người dùng sẽ không thể đăng nhập sử dụng tài khoản này)' : 'Bạn chắc chắn muốn mở khóa tài khoản này?',
            ok: 'Chắc chắn',
            cancel: "Không",
            onCancel: () => {

            },
            onOk: () => {
                lockItem(user);
            }
        });
    }

    const deleteItem = (item) => {
        userService.removeFromRole(item.user.id, item.roleCode).then(res => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                reloadUsers();
            }
        });
    }

    const deleteClicked = item => {
        modalActions.show({
            title: `Bạn chắc chắn muốn xóa quyền quản trị của tài khoản ${item.user.userName}?`,
            ok: 'Chắc chắn',
            cancel: "Không",
            onCancel: () => {

            },
            onOk: () => {
                deleteItem(item);
            }
        });
    }

    const exportXLSX = () => {
        let data = users.map(r => {
            return {
                'ID': r.id,
                'Tên đăng nhập': r.userName,
                'Tên hiển thị': r.displayName,
                'Email': r.email,
                'SĐT': r.phone,
                'Xác thực TK': r.emailConfirmed,
                'Hoạt động': r.active,
                'Ngày đăng ký': moment(r.createdDateTime).toDate(),
            }
        })
        exportHelpers.dataToXLSX('admin-users', data)
    }

    const columns = [
        {
            dataField: 'user.id',
            text: '#',
            type: 'number',
            sort: true,
            style: {
                width: '70px',
            }
        },
        {
            dataField: 'user.displayName',
            text: 'Tên hiển thị',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span><Avatar url={row.avatar} className='rounded-circle w-30px h-30px' /> {cellContent}</span>
            )
        },
        {
            dataField: 'user.userName',
            text: 'Tên đăng nhập',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'roleCode',
            text: 'Role',
            sort: true,
            canFilter: true,
            type: 'string',
            style: {
                width: '120px',
            },
            formatter: (cellContent, row) => (
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'user.active',
            text: 'Active',
            canFilter: true,
            type: 'bool',
            formatter: (cellContent, row) => (
                <CBadge color={cellContent ? 'success' : 'danger'}>
                    {cellContent ? "Hoạt động" : "Khóa"}
                </CBadge>
            )
        },
        {
            dataField: 'user.emailConfirmed',
            text: 'Xác thực tài khoản',
            hidden: true,
            canFilter: true,
            type: 'bool',
            formatter: (cellContent, row) => (
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'user.createdDateTime',
            text: 'Đăng ký',
            sort: true,
            canFilter: true,
            type: 'date',
            formatter: (cellContent, row) => (
                <Moment date={cellContent} format="HH:mm DD/MM/YYYY" />
            )
        },
        {
            dataField: 'action',
            text: '',
            formatter: (cellContent, item) => (
                <div className="py-2 d-flex justify-content-center">
                    <CButton
                        color="light"
                        size="sm"
                        className='mx-1'
                        onClick={() => { editClicked(item) }}
                    >
                        <FontAwesomeIcon icon={allIcon.faPencilAlt} />
                    </CButton>
                    <CButton
                        color="light"
                        size="sm"
                        className='mx-1'
                        title='đặt lại mật khẩu'
                        onClick={() => { setSetPassword(item) }}
                    >
                        <FontAwesomeIcon icon={allIcon.faKey} />
                    </CButton>
                    <CButton
                        className='mx-1'
                        color="light"
                        size="sm"
                        onClick={() => { lockClicked(item) }}
                        title={item.user.active ? 'Khóa tài khoản' : "Mở khóa tài khoản"}
                    >
                        <FontAwesomeIcon icon={item.user.active ? allIcon.faLock : allIcon.faLockOpen} />
                    </CButton>

                    <CButton
                        className='mx-1'
                        color="light"
                        size="sm"
                        onClick={() => { deleteClicked(item) }}
                        title="Xóa"
                    >
                        <FontAwesomeIcon icon={allIcon.faTrash} />
                    </CButton>
                </div>
            )
        }
    ]

    return (
        <>
            <CRow>
                <CCol xs="12" lg="12" className='h-100'>
                    {editing != false &&
                        <CModal show={editing != false} centered onClose={() => setEditing(false)}>
                            <ChangeUserRole
                                user={editing?.user}
                                role={editing?.roleCode}
                                onCancel={() => setEditing(false)}
                                onSuccess={() => { reloadUsers(); setEditing(false) }}
                            />
                        </CModal>
                    }
                    <CCard>
                        <CCardHeader>
                            <span className='h3'>Danh sách quản trị viên</span>
                            <div className="card-header-actions">
                                <CButton onClick={() => setEditing({})}>
                                    <FontAwesomeIcon icon={allIcon.faPlus} /> Thêm quản trị viên
                                </CButton>

                                <CButton onClick={exportXLSX}>
                                    <FontAwesomeIcon icon={allIcon.faFileExport} /> XLSX
                                </CButton>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <BootstrapTable
                                striped
                                hover
                                keyField="user.id"
                                data={users}
                                columns={columns}
                            />

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CModal
                show={setpassword}
                centered
                closeOnBackdrop={false}
                onClose={() => setSetPassword(false)}
            >
                <CModalHeader closeButton>Đặt mật khẩu</CModalHeader>
                <CModalBody>
                    <SetPassword item={setpassword?.user} onSuccess={() => setSetPassword(false)} />
                </CModalBody>
            </CModal>
        </>
    )
}

const ChangeUserRole = ({ user, role, onCancel, onSuccess }) => {
    let ref = useRef()

    let [roleField] = useFormField({ value: role ?? 'ADMIN', valid: true, rules: [] })
    const loadOptions = (inputValue, callback) => {
        if (inputValue == null || inputValue == '') {
            callback([])
            return;
        }
        searchService.searchUser(inputValue)
            .then(res => {
                if (res.isSuccess) {
                    callback(res.data);
                } else {
                    callback([])
                }
            });
    };

    const addClicked = () => {
        let userId = user?.id ?? 0;
        if (userId == 0) {
            let currentSelected = ref.current.select.select.getValue();
            if (currentSelected != null && currentSelected.length > 0) {
                userId = currentSelected[0].value;
            }
        }

        if (userId != 0)
            userService.addToRole(userId, roleField.value)
                .then(res => {
                    if (res.isSuccess)
                        onSuccess();
                });
    }

    const handleInputChange = (newValue) => {
        return newValue;
    };

    return (
        <>
            <CModalHeader closeButton><span className='h3'>{user == null ? 'Thêm quản trị viên' : 'Thay đổi role'}</span></CModalHeader>
            <CModalBody>
                <CRow>
                    <CCol xs='12' lg='12' sm='12'>
                        <form autocomplete='off' onSubmit={(e) => e.preventDefault()}>
                            <div className='form-group'>
                                <label >UserName </label>
                                {user != null ?
                                    <input className='form-control' readOnly value={user?.userName} /> :
                                    <AsyncSelect
                                        ref={ref}
                                        isClearable
                                        cacheOptions
                                        onChange={() => { }}
                                        loadOptions={loadOptions}
                                        defaultValue={user?.userName}
                                        onInputChange={handleInputChange}
                                        placeholder='Nhập tên tài khoản'
                                    />
                                }
                            </div>
                            <SelectInput
                                name='Role'
                                label='Role'
                                field={roleField}
                                dataSource={RoleDataSource} />
                        </form>
                    </CCol>
                    <CCol cols='12' className='mt-4 pb-3'>
                        <CButton
                            color='primary'
                            onClick={addClicked}
                            title='Thêm'>
                            Thêm
                        </CButton>
                    </CCol>
                </CRow>
            </CModalBody>
        </>
    )
}

const SetPassword = ({ item, onSuccess }) => {
    let [password] = useFormField({ value: '', rules: [{ rule: 'required', message: 'Please Input' }] })
    let [form] = useForm([password])

    useEffect(() => {
        password.value = ''
        password.refresh?.call();
    }, [item])

    const onSubmit = () => {
        if (form.valid()) {
            userService.setPassword({
                id: item.id,
                password: password.value
            })
                .then((res) => {
                    if (res.isSuccess) {
                        alertActions.successUpdate();
                        onSuccess()
                    }
                })
        }
    }

    return (
        <CRow>
            <CCol cols='12' sm='12'>
                <PasswordInput
                    label='Mật khẩu mới'
                    field={password} />
            </CCol>
            <CCol cols='12'>
                <CButton color='primary' className='float-center' onClick={onSubmit}>
                    Cập nhật
                </CButton>
            </CCol>
        </CRow>
    )
}

export default ManagerList