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
import Moment from 'react-moment';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Avatar } from '../../shared';
import moment from 'moment';
import { exportHelpers } from '../helpers';
import { useQuery, useQueryClient } from 'react-query';
import queryObjectHash from '../shared/queryObjectHash';
import classNames from 'classnames';
import { surveyService } from '../services/survey.service';
import { surveyModel } from './SurveysModel';
import { SurveyForm } from './SurveyForm';

const MainDataName = 'Surveys';

const Surveys = props => {
    let ready = useRef()
    const queryClient = useQueryClient()

    const { data: getListResult, isFetching } = useQuery([MainDataName], () => surveyService.getAll())
    let surveys = getListResult?.data ?? []
    let [editing, setEditing] = useState();

    useEffect(() => {
        if (!ready.current) {
            ready.current = true
            return;
        }
    })

    const reloadData = () => {
        queryClient.invalidateQueries(MainDataName)
    }

    const copyClicked = (item) => {
        setEditing(new surveyModel(item))
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
        },
        {
            dataField: 'description',
            text: 'Mô tả',
            sort: true,
            canFilter: true,
            type: 'string',
        },
        {
            dataField: 'action',
            style: { width: '120px' },
            text: '',
            formatter: (cellContent, item) => {
                return (
                    <div className="d-flex" >
                        <CButton
                            color="light"
                            type='link'
                            size="sm"
                            className='mx-1'
                            title='Danh sách đăng ký'
                            to={`/admin/surveys/${item.id}/registers`}
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
                        <CButton
                            color="light"
                            size="sm"
                            className='mx-1'
                            title='cập nhật thông tin'
                            onClick={() => { editClicked(item) }}
                        >
                            <FontAwesomeIcon icon={allIcon.faPencilAlt} />
                        </CButton>
                    </div >
                )
            }
        }
    ]

    const onCreateClick = () => {
        setEditing(new surveyModel());
    }

    const editClicked = item => {
        setEditing(item)
    }

    return (
        <>
            <CRow className={editing ? 'd-none' : ''}>
                <CCol xs="12" lg="12" className='h-100'>
                    <CCard>
                        <CCardHeader>
                            <span className='h3'>Danh sách Surveys</span>
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
                                    <BootstrapTable
                                        striped
                                        hover
                                        remote={{ sort: false, pagination: false }}
                                        keyField="id"
                                        data={surveys}
                                        columns={columns}
                                        pagination={paginationFactory({
                                            page: 1,
                                            sizePerPage: 20,
                                            totalSize: surveys.length,
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
                                    />
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            {editing &&
                <SurveyForm
                    item={editing}
                    onCancel={() => { setEditing(false) }}
                    onSuccess={() => { reloadData(); setEditing(false); }} />
            }
        </>
    )
}

export default Surveys