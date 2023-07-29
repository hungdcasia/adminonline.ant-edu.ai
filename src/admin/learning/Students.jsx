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
import { history, NumberHelpers, string_to_slug, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, ImageInput, PageToolBar, SelectInput, TextInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { courseService, studentService, uploadService, userService } from '../services';
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
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';

const Medals = {
    'first': { name: 'Tím' },
    'second': { name: 'Vàng' },
    'third': { name: 'Bạc' }
}

const Students = props => {
    let { id } = props.match.params;
    const { data: courseResult } = useQuery(['course', id], () => courseService.getDetail(id), { staleTime: 60000 })
    let course = courseResult?.data?.course ?? null
    let medals = course?.medals ?? []

    let [isOpenAddPopup, setOpenAddPopup] = useState(false)

    let [paging, setPaging] = useState({
        page: 1,
        pageSize: 20,
        total: 0
    })

    let [filters, setFilters] = useState([]);

    let [sort, setSort] = useState({
        sort: 'registeredDateTime', direction: 'desc'
    })

    let [students, setStudents] = useState([])

    const defaultFilters = [{ field: 'CourseId', value: id, operator: '==' }]

    const reloadData = () => {
        handleTableChange('sort', {
            page: paging.page,
            sizePerPage: paging.pageSize,
            sortField: sort.sort,
            sortOrder: sort.direction
        })
    }

    const columns = [
        {
            dataField: 'id',
            text: 'Id',
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
            hidden: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'phoneNumber',
            text: 'SĐT',
            sort: true,
            hidden: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'active',
            text: 'Active',
            hidden: true,
            canFilter: true,
            type: 'bool',
            formatter: (cellContent, row) => (
                <span>{cellContent ? 'Active' : 'Inactive'}</span>
            )
        },
        {
            dataField: 'registeredDateTime',
            text: 'Đăng ký',
            sort: true,
            formatter: (cellContent, row) => (
                <Moment date={row.registeredDateTime} format="yyyy/MM/DD HH:mm:ss" />
            )
        },
        {
            dataField: 'progress',
            text: 'Progress',
            canFilter: true,
            type: 'number',
            sort: true,
            formatter: (cellContent, row) => (
                <div style={{ display: 'inline-flex' }}>
                    <div style={{ width: 40, height: 40 }}>
                        <CircularProgressbar strokeWidth='12' value={row.progress} text={``} />
                    </div>
                    <span className='d-inline-flex align-items-center ml-2'>{row.progress}%</span>
                </div>
            )
        },
        {
            dataField: 'completedPoint',
            text: 'Point',
            canFilter: true,
            type: 'number',
            sort: true,
            formatter: (cellContent, row) => (
                <span>{NumberHelpers.toDefautFormat(cellContent)}</span>
            )
        },
        {
            dataField: 'medal',
            text: 'Huy chương',
            canFilter: medals.length > 0,
            type: 'string',
            sort: false,
            formatter: (cellContent, row) => {
                let str = ''
                for (let index = 0; index < medals.length; index++) {
                    const medal = medals[index];
                    if (row.completedPoint >= medal.point) {
                        str = Medals[medal.type].name
                        break
                    }
                }

                return (
                    <span>{str}</span>
                )
            },
            operators: ['=='],
            customInput: (value, onChange) => {
                return (
                    <select className="custom-select mr-2" value={value} onChange={(e) => onChange(e.target.value)}>
                        <option value=''>Tất cả</option>
                        <option value='Tím'>Tím</option>
                        <option value='Vàng'>Vàng</option>
                        <option value='Bạc'>Bạc</option>
                    </select>
                )
            }
        },
        {
            dataField: 'action',
            text: '',
            formatter: (cellContent, row) => (
                <div className="py-2 d-flex justify-content-center">
                    <CButton
                        className='ml-3'
                        color="light"
                        size="sm"
                        onClick={() => { deleteClicked(row) }}
                    >
                        <FontAwesomeIcon icon={allIcon.faTrashAlt} />
                    </CButton>
                </div>
            )
        }
    ]

    useEffect(() => {
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

        let medalFilters = filterOptions.filter(r => r.field == 'medal');
        filterOptions = filterOptions.filter(r => r.field != 'medal')
        for (let index = 0; index < medalFilters.length; index++) {
            const filter = medalFilters[index];
            if (filter.value == 'Tím') {
                filterOptions.push({ field: 'completedPoint', operator: '>=', value: medals[0].point })
            } else if (filter.value == 'Vàng') {
                filterOptions.push({ field: 'completedPoint', operator: '<', value: medals[0].point })
                filterOptions.push({ field: 'completedPoint', operator: '>=', value: medals[1].point })
            }
            else if (filter.value == 'Bạc') {
                filterOptions.push({ field: 'completedPoint', operator: '<', value: medals[1].point })
                filterOptions.push({ field: 'completedPoint', operator: '>=', value: medals[2].point })
            }
        }

        studentService.getList(pagingOptions, filterOptions, sortOptions)
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
        studentService.remove(id, item.id).then(res => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                reloadData();
            }
        });
    }

    const deleteClicked = item => {
        modalActions.show({
            title: `Bạn chắc chắn muốn xóa user ${item.userName} khỏi danh sách học viên?`,
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
                'ID': r.id,
                'Tên đăng nhập': r.userName,
                'Tên hiển thị': r.displayName,
                'Email': r.email,
                'Hoạt động': r.active,
                'Progress': r.progress,
                'Ngày đăng ký': moment(r.registeredDateTime).toDate(),
            }
        })
        exportHelpers.dataToXLSX('students', data)
    }

    if (course == null) {
        return (
            <></>
        )
    }

    return (
        <>
            {/* <CRow>
                <CCol xs="12" lg="12" className='h-100'>
                    <PageToolBar hideBackButton><span className='h3'>{course?.name}</span></PageToolBar>
                </CCol>
                <CCol xs="12" lg="12" className='h-100'></CCol>
            </CRow> */}
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
                            <span className='h3'>Danh sách học viên ({paging.total})</span>
                            <div className="card-header-actions">
                                <CButton onClick={() => setOpenAddPopup(true)}>
                                    <FontAwesomeIcon icon={allIcon.faPlus} /> Thêm học viên
                                </CButton>

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
                                keyField="id"
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

export default Students