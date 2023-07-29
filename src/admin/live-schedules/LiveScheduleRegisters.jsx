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
    CModal,
    CModalBody,
    CModalHeader,
    CPagination,
    CRow,
    CValidFeedback
} from '@coreui/react'
import { useEffect, useRef, useState } from 'react'
import { history, string_to_slug, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, ImageInput, PageToolBar, SelectInput, TextInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { courseService, liveScheduleService, studentService, uploadService, userService } from '../services';
import AsyncSelect from 'react-select/async';
import { searchService } from '../../services';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Moment from 'react-moment';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { FilterComponent } from '../shared/FilterComponent';
import { Avatar } from "../../shared";
import { exportHelpers } from "../helpers";
import moment from 'moment';

const LiveScheduleRegisters = props => {
    let { id } = props.match.params;

    let [isOpenAddPopup, setOpenAddPopup] = useState(false)

    let [paging, setPaging] = useState({
        page: 1,
        pageSize: 20,
        total: 0
    })

    let [filters, setFilters] = useState([]);

    let [sort, setSort] = useState({
        sort: 'registeredTime', direction: 'desc'
    })

    let [students, setStudents] = useState([])

    const defaultFilters = [{ field: 'liveScheduleId', value: id, operator: '==' }]

    const reloadData = () => {
        handleTableChange('sort', {
            page: paging.page,
            sizePerPage: paging.pageSize,
            sortField: sort.sort,
            sortOrder: sort.direction
        })
    }

    useEffect(() => {
    }, [])

    const columns = [
        {
            dataField: 'user.id',
            text: 'Id',
            type: 'number',
            style: {
                width: '70px',
            },
            formatter: (cellContent, row) => row.user?.id
        },
        {
            dataField: 'user.displayName',
            text: 'Tên hiển thị',
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span><Avatar url={row.user?.avatar} className='rounded-circle w-30px h-30px' /> {row.user?.displayName}</span>
            )
        },
        {
            dataField: 'user.userName',
            text: 'Tên đăng nhập',
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'user.email',
            text: 'Email',
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'user.phoneNumber',
            text: 'SĐT',
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'registeredTime',
            text: 'Đăng ký',
            sort: true,
            formatter: (cellContent, row) => moment(cellContent, 'x').local().format("HH:mm:ss DD/MM/yyyy")
        },
        // {
        //     dataField: 'action',
        //     text: '',
        //     formatter: (cellContent, row) => (
        //         <div className="py-2 d-flex justify-content-center">
        //             <CButton
        //                 className='ml-3'
        //                 color="light"
        //                 size="sm"
        //                 onClick={() => { deleteClicked(row) }}
        //             >
        //                 <FontAwesomeIcon icon={allIcon.faTrashAlt} />
        //             </CButton>
        //         </div>
        //     )
        // }
    ]

    useEffect(() => {
        let pagingOptions = {
            page: paging.page,
            pageSize: paging.pageSize,
            total: 0
        }

        setPaging(pagingOptions)
    }, [])

    useEffect(() => {
        reloadData();
    }, [filters])

    const handleTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
        let pagingOptions = {
            page: page == 0 ? 1 : page,
            pageSize: sizePerPage
        }

        let filterOptions = defaultFilters.concat(filters)
        let sortOptions = { sort: sortField, direction: sortOrder }
        setSort(sortOptions)

        if (type == 'pagination') {
        } else if (type = 'sort') {
            pagingOptions.page = 1
        }

        liveScheduleService.getRegisteredList(pagingOptions, filterOptions, sortOptions)
            .then(res => {
                if (res.isSuccess) {
                    let data = res.data
                    setPaging({
                        page: data.page,
                        pageSize: data.pageSize,
                        total: data.total
                    })
                    setStudents(res.data.items)
                }
            })
    }

    const onFilter = (items) => {
        setFilters(items);
    }

    const deleteItem = (item) => {
        studentService.remove(id, item.userId).then(res => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                reloadData();
            }
        });
    }

    const deleteClicked = item => {
        modalActions.show({
            title: `Bạn chắc chắn muốn xóa user ${item.user?.userName} khỏi danh sách học viên?`,
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
        let data = students.map(r => {
            return {
                'ID': r.user?.id,
                'Tên đăng nhập': r.user?.userName,
                'Tên hiển thị': r.user?.displayName,
                'Email': r.user?.email,
                'SĐT': r.user?.phone,
                'Ngày đăng ký': moment(r.registeredTime, 'x').local().toDate(),
            }
        })
        exportHelpers.dataToXLSX('students', data)
    }

    return (
        <>
            <CRow>
                <CCol xs="12" lg="12" className='h-100'>
                    <PageToolBar></PageToolBar>
                </CCol>
                <CCol xs="12" lg="12" className='h-100'></CCol>
            </CRow>
            <CRow className='d-flex justify-content-center'>
                <CCol sm='12'>
                    <FilterComponent onFilter={onFilter} filterConfigs={columns.filter(r => r.canFilter)} />
                </CCol>
            </CRow>
            <CRow>
                <CCol xs="12" lg="12" className='h-100'>
                    <CModal show={isOpenAddPopup} centered onClose={() => setOpenAddPopup(false)}>
                        <CModalHeader closeButton><span className='h3'>Thêm học viên</span></CModalHeader>
                        <CModalBody>
                            <AddStudent courseId={id} onSuccess={() => { reloadData(); setOpenAddPopup(false) }} />
                        </CModalBody>
                    </CModal>
                    <CCard>
                        <CCardHeader>
                            <span className='h3'>Danh sách đăng ký ({paging.total})</span>
                            <div className="card-header-actions">
                                {/* <CButton onClick={() => setOpenAddPopup(true)}>
                                    <FontAwesomeIcon icon={allIcon.faPlus} /> Thêm học viên
                                </CButton> */}

                                <CButton onClick={exportXLSX}>
                                    <FontAwesomeIcon icon={allIcon.faFileExport} /> XLSX
                                </CButton>
                            </div>
                        </CCardHeader>
                        <CCardBody>

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
                                keyField="user"
                                data={students}
                                columns={columns}
                                onTableChange={handleTableChange}
                                pagination={paginationFactory({
                                    page: paging.page,
                                    sizePerPage: paging.pageSize,
                                    totalSize: paging.total,
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
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

const AddStudent = ({ courseId, onSuccess }) => {
    let ref = useRef()
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
        let currentSelected = ref.current.select.select.getValue();
        if (currentSelected != null && currentSelected.length > 0) {
            let userId = currentSelected[0].value;
            studentService.create(courseId, userId)
                .then(res => {
                    if (res.isSuccess) {
                        onSuccess();
                        alertActions.success('Cập nhật thành công!')
                    }
                }).finally(() => {
                    ref.current.select.select.clearValue();
                });
        }
    }

    const handleInputChange = (newValue) => {
        return newValue;
    };

    const onSelectUser = (newValue, actionMeta) => {
    }


    return (
        <CRow className='d-flex'>
            <CCol xs='12' lg='12' sm='12'>
                <AsyncSelect
                    ref={ref}
                    placeholder='Nhập username'
                    isClearable
                    cacheOptions
                    onChange={onSelectUser}
                    loadOptions={loadOptions}
                    onInputChange={handleInputChange}
                />
            </CCol>
            <CCol xs='4' lg='4' sm='6' className='mt-2'>
                <CButton
                    color='primary'
                    onClick={addClicked}
                    title='Thêm'> Thêm </CButton>
            </CCol>
        </CRow>
    )
}

export default LiveScheduleRegisters