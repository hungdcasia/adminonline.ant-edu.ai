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
import { history, string_to_slug, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, ImageInput, SelectInput, TextInput, PasswordInput, FilterComponent, DateTimeInput, NumberInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { categoryService, courseService, liveSchedule, liveScheduleService, uploadService, userService } from '../services';
import Moment from 'react-moment';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Avatar } from '../../shared';
import moment from 'moment';
import { exportHelpers } from '../helpers';
import { LiveScheduleForm } from './LiveScheduleForm';
import { useQuery, useQueryClient } from 'react-query';
import queryObjectHash from '../shared/queryObjectHash';
import classNames from 'classnames';

const createModel = (item) => {
    return {
        id: 0,
        title: item?.title ?? '',
        summary: item?.summary ?? '',
        description: item?.description ?? '',
        presenter: item?.presenter ?? '',
        startTime: null,
        duration: item?.duration ?? 30 * 60,
        restrictionCourseId: item?.restrictionCourseId ?? 0,
        categoryId: item?.categoryId ?? 0,
        platform: item?.platform ?? 'ZOOM',
        thumbnail: item?.thumbnail ?? '',
        maxParticipants: item?.maxParticipants ?? 30,
        facebookEventLink: item?.facebookEventLink ?? '',
        joinRoomLink: item?.joinRoomLink ?? '',
        agenda: item?.agenda ?? []
    }
}

const MainDataName = 'LiveSchedulesList';

const LiveSchedulesList = props => {
    let ready = useRef()
    const queryClient = useQueryClient()

    const { data: catResult } = useQuery(['LiveSchedules', 'categories'], () => categoryService.getCategories(), { staleTime: 600000 })
    let categories = catResult?.data ?? []
    const { data: coursesResult } = useQuery(['LiveSchedules', 'courses'], () => courseService.getList(), { staleTime: 600000 })
    let courses = coursesResult?.data ?? []
    let [editing, setEditing] = useState();

    let initOptions = queryObjectHash.fromQueryString(props.location.search, 'q')
    let defaultSort = { sort: 'startTime', direction: 'desc' };
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

    const { data: dataSourceResult, isFetching } = useQuery([MainDataName, sort, paging, filters, catResult, coursesResult], () => getLives(), { enabled: !!catResult && !!coursesResult })
    let dataSource = dataSourceResult?.data?.items ?? [];
    let total = dataSourceResult?.data?.total ?? 0;

    useEffect(() => {
        if (!ready.current) {
            ready.current = true
            return;
        }

        history.replace(queryObjectHash.toBase64HashString(options, 'q'));
    }, [options])

    const reloadData = () => {
        queryClient.invalidateQueries(MainDataName)
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
            dataField: 'title',
            text: 'Tiêu đề',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span><img src={row.thumbnail} className='rounded w-40px h-30px' /> {cellContent}</span>
            )
        },
        {
            dataField: 'presenter',
            text: 'Giảng viên',
            sort: true,
            canFilter: true,
            type: 'string',
        },
        {
            dataField: 'categoryId',
            text: 'Chủ đề',
            type: 'string',
            formatter: (cellContent, row) => categories.find(r => r.id == cellContent)?.name
        },
        {
            dataField: 'startTime',
            text: 'Bắt đầu',
            sort: true,
            canFilter: true,
            type: 'date',
            formatter: (cellContent, row) => moment(cellContent, 'x').format('DD/MM/YYYY HH:mm')
        },
        {
            dataField: 'duration',
            text: 'Thời lượng',
            sort: true,
            type: 'number',
            formatter: (cellContent, row) => (
                moment.duration(cellContent, 'seconds').format("hh:mm:ss")
            )
        },
        {
            dataField: 'restrictionCourseId',
            text: 'Hạn chế ĐK',
            type: 'number',
            formatter: (cellContent, row) => {
                const course = courses.find(r => r.id == cellContent)
                return (
                    <span title={course?.name}>{course?.code}</span>
                )
            }
        },
        {
            dataField: 'maxParticipants',
            text: 'ĐK Tối đa',
            type: 'number'
        },
        {
            dataField: 'registeredCount',
            text: 'Đã ĐK',
            type: 'number'
        },
        {
            dataField: 'status',
            text: 'Trạng thái',
            type: 'string',
            formatter: (cellContent, item) => {
                if (cellContent == 'CANCELLED') {
                    return (<div className='badge badge-danger'>Đã hủy</div>)
                }
                let startTime = moment(item.startTime, 'x').local().toDate();
                let endTime = moment(item.endTime, 'x').local().toDate();
                let now = new Date()
                let isBeing = startTime <= now && now < endTime
                let ended = now > endTime
                if (isBeing)
                    return (<div className='badge badge-success'>Live</div>)

                if (ended)
                    return (<div className='badge badge-secondary'>Ended</div>)

                return (<div className='badge badge-warning'>Waiting</div>)
            }
        },
        {
            dataField: 'action',
            text: '',
            formatter: (cellContent, item) => {
                let isCancelled = item.status == 'CANCELLED'
                let startTime = moment(item.startTime, 'x').local().toDate();
                let endTime = moment(item.endTime, 'x').local().toDate();
                let now = new Date()
                let ended = now > endTime
                return (
                    <div className="d-flex">
                        <CButton
                            color="light"
                            type='link'
                            size="sm"
                            className='mx-1'
                            title='Danh sách đăng ký'
                            to={`/admin/live-schedules/${item.id}/registers`}
                        >
                            <FontAwesomeIcon icon={allIcon.faUsers} />
                        </CButton>

                        <CButton
                            color="light"
                            size="sm"
                            className='mx-1'
                            title='Copy'
                            onClick={() => { copyClicked(item) }}
                        >
                            <FontAwesomeIcon icon={allIcon.faClone} />
                        </CButton>
                        {(!isCancelled && !ended) &&
                            <>
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
                                    title='Hủy lịch trực tiếp'
                                    onClick={() => { cancelClicked(item) }}
                                >
                                    <FontAwesomeIcon icon={allIcon.faBan} />
                                </CButton>
                            </>
                        }
                    </div>
                )
            }
        }
    ]

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

    const getLives = () => {
        let pagingOptions = {
            page: paging.page == 0 ? 1 : paging.page,
            pageSize: paging.pageSize
        }

        let filterOptions = defaultFilters.concat(filters)
        let sortOptions = { sort: sort.sort, direction: sort.direction }
        return liveScheduleService.getList(pagingOptions, filterOptions, sortOptions)
    }

    const onFilter = (items) => {
        setFilters(items);
    }

    const onCreateClick = () => {
        setEditing(createModel());
    }

    const editClicked = item => {
        setEditing(item)
    }

    const copyClicked = item => {
        setEditing(createModel(item))
    }

    const cancelClicked = item => {
        modalActions.show({
            title: 'Bạn có chắc chắn muốn hủy lịch trực tiếp này? (Hành động này không thể hoàn tác.)',
            ok: 'Chắc chắn',
            cancel: "Không",
            onOk: () => {
                liveScheduleService.cancel(item.id)
                    .then(res => {
                        if (res.isSuccess) {
                            reloadData()
                        }
                    })
            }
        });
    }

    const exportXLSX = () => {
        let data = dataSource.map(r => {
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
                            <span className='h3'>Danh sách lịch trực tiếp</span>
                            <div className="card-header-actions">
                                <CButton
                                    onClick={reloadData}
                                    title='Refresh'>
                                    <FontAwesomeIcon icon={allIcon.faSyncAlt} className={classNames({ 'fa-spin': isFetching })} /> Làm mới
                                </CButton>
                                <CButton
                                    onClick={onCreateClick}
                                    title='Create'>
                                    <FontAwesomeIcon icon={allIcon.faPlus} /> Thêm
                                </CButton>
                                {/* <CButton onClick={exportXLSX}>
                                    <FontAwesomeIcon icon={allIcon.faFileExport} /> XLSX
                                </CButton> */}
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
                                        data={dataSource}
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
                                        defaultSorted={[{
                                            dataField: sort.sort,
                                            order: sort.direction
                                        }]}
                                    />
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            {editing &&
                <LiveScheduleForm
                    item={editing}
                    courses={courses}
                    categories={categories}
                    onCancel={() => { setEditing(false) }}
                    onSuccess={() => { reloadData(); setEditing(false); }} />
            }
        </>
    )
}

export default LiveSchedulesList