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
import { history, string_to_slug, UrlHelpers, useForm, useFormField } from "../../helpers";
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
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import queryString from 'query-string';
import queryObjectHash from '../shared/queryObjectHash';
import classNames from 'classnames';

const createModel = () => {
    return {
        id: 0,
        displayName: '',
        email: '',
        emailConfirmed: false,
        active: true,
        avatar: null
    }
}

const UserList = props => {
    let ready = useRef()
    const queryClient = useQueryClient()
    let [editing, setEditing] = useState();
    let [setpassword, setSetPassword] = useState();
    let initOptions = queryObjectHash.fromQueryString(props.location.search, 'q')
    let defaultSort = { sort: 'createdDateTime', direction: 'desc' };
    let [defaultFilters, setDefaultFilters] = useState([]);
    let [options, setOptions] = useState(initOptions == null ? {
        filters: [],
        paging: { page: 1, pageSize: 20 },
        sort: null
    } : initOptions)

    let paging = options.paging;
    let sort = options.sort ?? defaultSort;
    let filters = options.filters;

    const setSort = (prop) => {
        let newOpt = { ...options };
        newOpt.sort = prop
        setOptions(newOpt)
    }

    const setPaging = (prop) => {
        let newOpt = { ...options };
        newOpt.paging = prop
        setOptions(newOpt)
    }

    const setFilters = (prop) => {
        let newOpt = { ...options };
        newOpt.filters = prop
        newOpt.paging.page = 1
        setOptions(newOpt)
    }

    const { data: usersResult, isFetching } = useQuery(['users', sort, paging, filters], () => { return getUsers() })

    let users = usersResult?.data?.items ?? [];
    let total = usersResult?.data?.total ?? 0;

    const reloadData = () => {
        queryClient.invalidateQueries('users')
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
            dataField: 'displayName',
            text: 'Tên hiển thị',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span><Avatar url={row.avatar} className='rounded-circle w-30px h-30px' /><Link className='ml-1' to={`/admin/users/${row.id}/info`}>{cellContent}</Link></span>
            )
        },
        {
            dataField: 'userName',
            text: 'Tên đăng nhập',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'email',
            text: 'Email',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span>{cellContent} {!row.emailConfirmed && <FontAwesomeIcon className='text-warning' icon={allIcon.faExclamationCircle} title='Tài khoản chưa xác thực' />}</span>
            )
        },
        {
            dataField: 'phoneNumber',
            text: 'SĐT',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'active',
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
            dataField: 'emailConfirmed',
            text: 'Xác thực tài khoản',
            hidden: true,
            canFilter: true,
            type: 'bool',
            formatter: (cellContent, row) => (
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'createdDateTime',
            text: 'Đăng ký',
            sort: true,
            type: 'date',
            canFilter: true,
            formatter: (cellContent, row) => (
                <Moment date={cellContent} format="DD/MM/YYYY HH:mm:ss" />
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
                        title='cập nhật thông tin'
                        onClick={() => { editClicked(item) }}
                    >
                        <FontAwesomeIcon icon={allIcon.faPencilAlt} />
                    </CButton>
                    <CButton
                        color="light"
                        size="sm"
                        className='mx-1'
                        title='đặt lại mật khẩu'
                        onClick={() => { setPasswordClicked(item) }}
                    >
                        <FontAwesomeIcon icon={allIcon.faKey} />
                    </CButton>
                    <CButton
                        className='mx-1'
                        color="light"
                        size="sm"
                        onClick={() => { lockClicked(item) }}
                        title={item.active ? 'Khóa tài khoản' : "Mở khóa tài khoản"}
                    >
                        <FontAwesomeIcon icon={item.active ? allIcon.faLock : allIcon.faLockOpen} />
                    </CButton>

                    <CButton
                        className='mx-1'
                        color="light"
                        size="sm"
                        onClick={() => { deleteClicked(item) }}
                        title="xóa tài khoản"
                    >
                        <FontAwesomeIcon icon={allIcon.faTrash} />
                    </CButton>
                </div>
            )
        }
    ]

    useEffect(() => {
        if (!ready.current) {
            ready.current = true
            return;
        }

        history.replace(queryObjectHash.toBase64HashString(options, 'q'));
    }, [options])

    const handleTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
        if (!ready.current) {
            return;
        }
        let pagingOptions = {
            page: page == 0 ? 1 : page,
            pageSize: sizePerPage
        }

        let filterOptions = [].concat(filters)
        let sortOptions = { sort: sortField ?? defaultSort.sort, direction: sortOrder ?? defaultSort.direction }

        if (type == 'pagination') {
        } else if (type = 'sort') {
            pagingOptions.page = 1
        }

        setOptions({ filters, sort: sortOptions, paging: pagingOptions })
    }

    const getUsers = () => {
        let pagingOptions = {
            page: paging.page == 0 ? 1 : paging.page,
            pageSize: paging.pageSize
        }

        let filterOptions = defaultFilters.concat(filters)
        let sortOptions = { sort: sort.sort, direction: sort.direction }
        return userService.getList(pagingOptions, filterOptions, sortOptions)
    }

    const onFilter = (items) => {
        if (filters.length == 0 && items.length == 0) return
        setFilters(items);
    }

    const onCreateClick = () => {
        setEditing(createModel());
    }

    const editClicked = user => {
        setEditing(user)
    }

    const lockItem = (user) => {
        userService.lockUser(user.id, !user.active)
            .then(res => {
                if (res.isSuccess) {
                    alertActions.successUpdate();
                    reloadData();
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
        userService.remove(item.id).then(res => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                reloadData();
            }
        });
    }

    const deleteClicked = item => {
        modalActions.show({
            title: `Bạn chắc chắn muốn xóa vĩnh viễn tài khoản ${item.userName}?`,
            ok: 'Chắc chắn',
            cancel: "Không",
            onCancel: () => {

            },
            onOk: () => {
                deleteItem(item);
            }
        });
    }

    const setPasswordClicked = (user) => {
        setSetPassword(user)
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
        exportHelpers.dataToXLSX('users', data)
    }

    return (
        <>
            <CRow className={editing ? 'd-none' : ''}>
                <CCol sm='12'>
                    <FilterComponent onFilter={onFilter} filterConfigs={columns.filter(r => r.canFilter)} />
                </CCol>
                <CCol xs="12" lg="12" className='h-100'>
                    <CCard>
                        <CCardHeader>
                            <span className='h3' onClick={getUsers}>Danh sách người dùng</span>
                            <div className="card-header-actions">
                                <CButton
                                    onClick={reloadData}
                                    title='Create'>
                                    <FontAwesomeIcon icon={allIcon.faSyncAlt} className={classNames({ 'fa-spin': isFetching })} /> Làm mới
                                </CButton>
                                <CButton
                                    onClick={onCreateClick}
                                    title='Create'>
                                    <FontAwesomeIcon icon={allIcon.faPlus} /> Thêm
                                </CButton>
                                <CButton onClick={exportXLSX}>
                                    <FontAwesomeIcon icon={allIcon.faFileExport} /> XLSX
                                </CButton>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol lg='12'>
                                    {filters.length > 0 &&
                                        <div className='mb-2'>
                                            <span className='mr-2'><i className="fas fa-filter text-dark"></i></span>
                                            {filters.map((item, index) => (
                                                <CBadge color='secondary' key={index} className='py-1 px-2 mx-1'>{columns.find(r => r.dataField == item.field).text} {item.operator.toLowerCase()} {item.value}</CBadge>
                                            ))}

                                            <div className='btn btn-sm' onClick={() => onFilter([])}>clear</div>
                                        </div>
                                    }

                                    <BootstrapTable
                                        striped
                                        hover
                                        remote={{ sort: true, pagination: true }}
                                        keyField="id"
                                        data={users}
                                        columns={columns}
                                        onTableChange={handleTableChange}
                                        pagination={paginationFactory({
                                            page: paging.page,
                                            sizePerPage: paging.pageSize,
                                            totalSize: total,
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
                                        sort={{
                                            dataField: sort.sort,
                                            order: sort.direction
                                        }}
                                    />
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            {editing &&
                <UserForm onCancel={() => { setEditing(false) }} item={editing} onSuccess={() => { reloadData(); setEditing(false); }} />
            }

            <CModal
                show={setpassword}
                centered
                closeOnBackdrop={false}
            >
                <SetPassword item={setpassword} onSuccess={() => setSetPassword(false)} />
                <div style={{ position: 'absolute', top: 0, right: 5 }} onClick={() => setSetPassword(false)}>
                    <FontAwesomeIcon icon={allIcon.faTimes} />
                </div>
            </CModal>
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
        <CCard className='mb-0'>
            <CCardHeader>
                <span>Đặt lại mật khẩu</span>
            </CCardHeader>
            <CCardBody>
                <PasswordInput
                    label='Mật khẩu mới'
                    field={password} />
            </CCardBody>
            <CCardFooter>
                <CButton color='primary' className='float-center' onClick={onSubmit}>
                    Cập nhật
                </CButton>
            </CCardFooter>
        </CCard>
    )
}

const UserForm = ({ item, onSuccess, onCancel }) => {
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
                <CCol xs='9'>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <span className="navbar-brand h4">{item.id == 0 ? 'Thêm tài khoản' : 'Cập nhật tài khoản'}</span>
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
                                    />
                                    <TextInput name='userName'
                                        label='TK đăng nhập'
                                        required
                                        field={userName}
                                    />
                                    <TextInput name='email'
                                        label='Email'
                                        rawProps={{ autocomplete: "new-email" }}
                                        required
                                        field={email}
                                    />

                                    {item.id == 0 &&
                                        <PasswordInput
                                            name='password'
                                            label='Mật khẩu'
                                            rawProps={{ autocomplete: "new-password" }}
                                            field={password} />
                                    }

                                    <CheckboxInput name='emailConfirmed'
                                        label='Xác thực email'
                                        field={emailConfirmed}
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
                                        <CButton type='link' onClick={onChangeImage} >Tải lên</CButton>
                                    </div>
                                </CCardHeader>
                                <CCardBody>
                                    <ImageInput name='avatar'
                                        label=''
                                        rawProps={{ style: { width: '100%', borderRadius: '50%' } }}
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

export default UserList