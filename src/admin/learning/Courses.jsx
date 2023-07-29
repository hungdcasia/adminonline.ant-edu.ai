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
import { useEffect, useRef, useState } from 'react'
import { courseService, categoryService } from "../services";
import { history, NumberHelpers, string_to_slug, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, FilterComponent, SelectInput, TextInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { Link } from "react-router-dom";
import queryObjectHash from '../shared/queryObjectHash';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useQuery } from 'react-query';

const fields = [
    { key: "name", label: "Tên" },
    { key: "code", label: "Mã KH" },
    // { key: "description", label: "Mô tả", _style: { width: '30%' } },
    { key: "price", label: "Giá", _style: { width: '10%' } },
    { key: "category", label: "Nhóm", _style: { width: '20%' } },
    { key: "active", label: "Trạng thái", _style: { width: '10%' } },
    { key: "registered", label: "Học viên", _style: { width: '10%' } },
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
const Courses = props => {
    let [categories, setCategories] = useState([]);
    // let [courses, setCourses] = useState([]);

    let initOptions = queryObjectHash.fromQueryString(props.location.search, 'q')
    let defaultSort = { sort: 'name', direction: 'asc' };
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

    let ready = useRef()
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

    const getCategories = () => {
        categoryService.getCategories()
            .then((res) => {
                if (res.isSuccess) {
                    setCategories(res.data);
                }
            });
    }

    const getCourses = () => {
        let pagingOptions = {
            page: paging.page == 0 ? 1 : paging.page,
            pageSize: paging.pageSize
        }

        let filterOptions = defaultFilters.concat(filters)
        let sortOptions = { sort: sort.sort, direction: sort.direction }
        return courseService.filter(pagingOptions, filterOptions, sortOptions)
    }

    const { data: courseResult, isFetching } = useQuery(['courses', sort, paging, filters], () => { return getCourses() })

    let courses = courseResult?.data?.items ?? [];
    let total = courseResult?.data?.total ?? 0;

    const onCreateClick = () => {
        history.push('/admin/courses/create');
    }

    useEffect(() => {
        getCategories();
        // getCourses();
    }, []);

    const deleteItem = (item) => {
        courseService.remove(item.id).then(res => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                getCourses();
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

    const dupplicateItem = item => {
        courseService.dupplicate(item.id).then(res => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                getCourses();
            }
        });
    }

    const dupplicateClicked = item => {
        modalActions.show({
            title: 'Bạn chắc chắn muốn nhân bản mục này?',
            ok: 'Chắc chắn',
            cancel: "Không",
            onCancel: () => {

            },
            onOk: () => {
                dupplicateItem(item);
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
                width: '60px',
            }
        },
        {
            dataField: 'name',
            text: 'Tên',
            sort: true,
            canFilter: true,
            type: 'string',
            style: {
                maxWidth: '30%',
            },
            formatter: (cellContent, item) => (
                <>
                    <img width='40' src={item.thumbnailImage} className='mr-2' />
                    <Link to={`/admin/courses/${item.id}`}>{item.name}</Link>
                </>
            )
        },
        {
            dataField: 'code',
            text: 'Code',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'price',
            text: 'Giá bán',
            sort: true,
            canFilter: true,
            type: 'number',
            formatter: (cellContent, row) => (
                <span>{NumberHelpers.toDefautFormat(cellContent)}đ</span>
            )
        },
        {
            dataField: 'authorName',
            text: 'Tác giả',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'categoryId',
            text: 'Danh mục',
            sort: true,
            canFilter: true,
            operators: ['=='],
            type: 'number',
            formatter: (cellContent, row) => (
                <span>{row.category?.name}</span>
            ),
            customInput: (value, onChange) => {
                return (
                    <select className="custom-select mr-2" value={value} onChange={(e) => onChange(e.target.value)}>
                        <option value=''>Tất cả</option>
                        {categories.filter(r => r.level == 1).map(r => (
                            <option value={r.id}>{r.name}</option>
                        ))}
                    </select>
                )
            }
        },
        {
            dataField: 'active',
            text: 'Trạng thái',
            canFilter: true,
            type: 'bool',
            formatter: (cellContent, item) => (
                <CBadge color={getBadge(item.active)}>
                    {item.active ? "Hiện" : "ẩn"}
                </CBadge>
            ),
            customInput: (value, onChange) => {
                return (
                    <select className="custom-select mr-2" value={value} onChange={(e) => onChange(e.target.value)}>
                        <option value=''>Tất cả</option>
                        <option value='true'>Hiện</option>
                        <option value='false'>Ẩn</option>
                    </select>
                )
            }
        },
        {
            dataField: 'featured',
            text: 'Nổi bật',
            hidden: true,
            canFilter: true,
            type: 'bool',
            customInput: (value, onChange) => {
                return (
                    <select className="custom-select mr-2" value={value} onChange={(e) => onChange(e.target.value)}>
                        <option value=''>Tất cả</option>
                        <option value='true'>Có</option>
                        <option value='false'>Không</option>
                    </select>
                )
            }
        },
        {
            dataField: 'registered',
            text: 'Học viên',
            hidden: true,
            canFilter: true,
            type: 'number',
            formatter: (cellContent, item) => (
                <Link to={'/admin/courses/' + item.id + '/students'}>{item.registered}</Link>
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
                        title='Nhân bản'
                        onClick={() => { dupplicateClicked(item) }}
                    >
                        <FontAwesomeIcon icon={allIcon.faClone} />
                    </CButton>
                    {/* <CButton
                        className='ml-3'
                        color="light"
                        size="sm"
                        title='Cấu hình bài học'
                        onClick={() => { history.push('/admin/courses/' + item.id + '/lessons') }}
                    >
                        <FontAwesomeIcon icon={allIcon.faCog} />
                    </CButton>
                    <CButton
                        className='ml-3'
                        color="light"
                        size="sm"
                        title='Quản lý học viên'
                        onClick={() => { history.push('/admin/courses/' + item.id + '/students') }}
                    >
                        <FontAwesomeIcon icon={allIcon.faUsers} />
                    </CButton> */}
                    <CButton
                        className='ml-3'
                        color="light"
                        size="sm"
                        title='Xóa'
                        onClick={() => { deleteClicked(item) }}
                    >
                        <FontAwesomeIcon icon={allIcon.faTrashAlt} />
                    </CButton>
                </div>
            )
        }
    ]

    const onFilter = (items) => {
        if (filters.length == 0 && items.length == 0) return
        setFilters(items);
    }

    return (
        <>
            <CRow>
                <CCol sm='12'>
                    <FilterComponent onFilter={onFilter} filterConfigs={columns.filter(r => r.canFilter)} />
                </CCol>
                <CCol xs="12" lg="12" className='h-100'>
                    <CCard>
                        <CCardHeader>
                            <span className='h3'>Danh sách khóa học</span>
                            <div className="card-header-actions">
                                <CButton className={'float-right mb-0'}
                                    onClick={onCreateClick}
                                    defaultChecked
                                    title='Create'>
                                    <FontAwesomeIcon icon={allIcon.faPlus} /> Thêm khóa học
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
                                data={courses}
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

                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}
export default Courses