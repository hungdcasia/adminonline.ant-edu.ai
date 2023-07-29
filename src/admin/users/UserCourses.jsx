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
import { useParams } from 'react-router';
import { useQuery, useQueryClient } from 'react-query';
import classNames from 'classnames';

const UserCourses = props => {
    let { id } = useParams();
    let [sort] = useState({
        sort: 'registeredDateTime', direction: 'desc'
    })
    const queryClient = useQueryClient()
    const defaultFilters = [{ field: 'Id', value: id, operator: '==' }]

    const getUserCourses = () => {
        let pagingOptions = {
            page: 1,
            pageSize: 500
        }

        let filterOptions = defaultFilters.concat([])
        let sortOptions = sort

        return studentService.getList(pagingOptions, filterOptions, sortOptions)
    }

    const { data: allCoursesResult } = useQuery('allCourses', () => courseService.getList(), { staleTime: 600000 })
    const { isFetching, error, data: userCourseResult } = useQuery(['userCourses', id, allCoursesResult],
        () => getUserCourses(),
        { staleTime: 600000, enabled: !!allCoursesResult })
    let students = userCourseResult?.data?.items ?? []
    let courses = allCoursesResult?.data ?? []
    const columns = [
        {
            dataField: 'id',
            text: 'Id',
            type: 'number',
            style: {
                width: '70px',
            }
        },
        {
            dataField: 'displayName',
            text: 'Tên hiển thị',
            type: 'string',
            formatter: (cellContent, row) => (
                <span><Avatar url={row.avatar} className='rounded-circle w-30px h-30px' /> {cellContent}</span>
            )
        },
        {
            dataField: 'courseId',
            text: 'Khóa học',
            type: 'string',
            sort: true,
            sortValue: (cell, row) => courses.find(r => r.id == cell)?.name,
            formatter: (cellContent, row) => courses.find(r => r.id == cellContent)?.name ?? 'Đã xóa'
        },
        {
            dataField: 'courseCode',
            text: 'Mã KH',
            sort: true,
            type: 'string',
            sortValue: (cell, row) => courses.find(r => r.id == row.courseId)?.code ?? '',
            formatter: (cellContent, row) => courses.find(r => r.id == row.courseId)?.code
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
                <Moment date={row.registeredDateTime} format="HH:mm:ss DD/MM/YYYY" />
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

    const deleteItem = (item) => {
        studentService.remove(item.courseId, id).then(res => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                reload()
            }
        });
    }

    const deleteClicked = item => {
        modalActions.show({
            title: `Bạn chắc chắn muốn xóa?`,
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
                'KH': courses.find(c => c.id == r.courseId)?.name,
                'Mã KH': courses.find(c => c.id == r.courseId)?.code,
                'Progress': r.progress,
                'Ngày đăng ký': moment(r.registeredDateTime).toDate(),
            }
        })
        exportHelpers.dataToXLSX('students', data)
    }

    const reload = () => {
        queryClient.invalidateQueries(['userCourses', id])
    }

    return (
        <>
            <CRow>
                <CCol xs="12" lg="12" className='h-100'>
                    <CCard>
                        <CCardHeader>
                            <span className='h3'>Danh sách Khóa học ({students.length})</span>
                            <div className="card-header-actions">
                                <CButton onClick={reload}>
                                    <FontAwesomeIcon icon={allIcon.faSyncAlt} className={classNames({ 'fa-spin': isFetching })} /> XLSX
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
                                remote={{ sort: false, pagination: false }}
                                keyField="courseId"
                                data={students}
                                columns={columns}
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

export default UserCourses