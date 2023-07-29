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
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import queryString from 'query-string';
import queryObjectHash from '../shared/queryObjectHash';
import classNames from 'classnames';
import { surveyService } from '../services/survey.service';
import DateTimePicker from 'react-datetime-picker';

const QuestionType = {
    SingleChoice: 'SingleChoice',
    MutipleChoice: 'MutipleChoice',
    FreeText: 'FreeText'
}

const CourseUserSurvey = props => {
    let ready = useRef()
    let { id } = useParams();
    let [detailItem, setDetailItem] = useState(null)

    const queryClient = useQueryClient()
    let initOptions = queryObjectHash.fromQueryString(props.location.search, 'q')
    let defaultSort = { sort: 'createdTime', direction: 'desc' };
    let [defaultFilters, setDefaultFilters] = useState([{ field: 'courseId', value: `${id}`, operator: '==' }]);
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

    const { data: usersResult, isFetching } = useQuery(['user-surveys', sort, paging, filters], () => { return getUsers() })

    let users = usersResult?.data?.items ?? [];
    let total = usersResult?.data?.total ?? 0;

    const reloadData = () => {
        queryClient.invalidateQueries('user-surveys')
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
            dataField: 'user.displayName',
            text: 'Tên hiển thị',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span><Avatar url={row.user.avatar} className='rounded-circle w-30px h-30px' /><Link className='ml-1' to={`/admin/users/${row.user.id}/info`}>{row.user.displayName}</Link></span>
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
            dataField: 'user.email',
            text: 'Email',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'createdTime',
            text: 'Thời gian',
            sort: true,
            type: 'date',
            canFilter: true,
            formatter: (cellContent, row) => (
                <Moment date={cellContent} format="YYYY/MM/DD HH:mm:ss" />
            ),
            customInput: (value, onValueChange) => {

                let input = value ? moment(value, 'X').toDate() : null
                const onChange = (v) => {
                    let output = v == null ? null : moment(v).format('X');
                    onValueChange(output);
                };

                return (
                    <DateTimePicker
                        className='mx-2 form-control'
                        onChange={onChange}
                        value={input}
                        format='y-MM-dd HH:mm:ss'
                    />
                )
            }
        },
        {
            dataField: 'action',
            text: '',
            formatter: (cellContent, item) => (
                <div className="py-2 d-flex justify-content-center">
                    <CButton
                        className='mx-1'
                        color="light"
                        size="sm"
                        onClick={() => { detailClicked(item) }}
                        title="Chi tiết"
                    >
                        <FontAwesomeIcon icon={allIcon.faEye} />
                    </CButton>

                    <CButton
                        className='mx-1'
                        color="light"
                        size="sm"
                        onClick={() => { deleteClicked(item) }}
                        title="xóa"
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
        return surveyService.getUserSurveys(pagingOptions, filterOptions, sortOptions)
    }

    const onFilter = (items) => {
        if (filters.length == 0 && items.length == 0) return
        setFilters(items);
    }

    const deleteItem = (item) => {
        surveyService.removeUserSurvey(item.id).then(res => {
            if (res.isSuccess) {
                alertActions.successDelete();
                reloadData();
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

    const detailClicked = item => {
        setDetailItem(item)
    }

    return (
        <>
            <CRow className={''}>
                <CCol sm='12'>
                    <FilterComponent onFilter={onFilter} filterConfigs={columns.filter(r => r.canFilter)} />
                </CCol>
                <CCol xs="12" lg="12" className='h-100'>
                    <CCard>
                        <CCardHeader>
                            <span className='h3' onClick={getUsers}>Danh sách kết quả</span>
                            <div className="card-header-actions">
                                <CButton
                                    onClick={reloadData}
                                    title='Create'>
                                    <FontAwesomeIcon icon={allIcon.faSyncAlt} className={classNames({ 'fa-spin': isFetching })} /> Làm mới
                                </CButton>
                                {/*                                 
                                <CButton onClick={exportXLSX}>
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
            {detailItem != null &&
                <CModal show={detailItem != null}
                    scrollable
                    size='xl'
                    onClose={() => setDetailItem(null)}>
                    <CModalHeader closeButton className='text-dark font-weight-bold h3'>
                        KQ Khảo sát...
                    </CModalHeader>
                    <CModalBody>
                        <SurveyView survey={detailItem} onSuccess={() => setDetailItem(null)} />
                    </CModalBody>
                </CModal>
            }
        </>
    )
}

const SurveyView = ({ survey, onSuccess }) => {
    let [questions, setQuestions] = useState(JSON.parse(survey.content));

    const checkboxClicked = (question, answerId) => {
        let answers = question.answers
        answers.forEach(item => {
            if (item.id === answerId) {
                item.isChecked = !item.isChecked;
            }
        });
        setQuestions([...questions])
    }

    const radioClicked = (question, answerId) => {
        let answers = question.answers
        answers.forEach(item => {
            item.isChecked = item.id === answerId;
        });
        setQuestions([...questions])
    }

    const onTextBoxChange = (question, value) => {
        question.answerText = value
    }

    return (
        <div className="survey-quiz-container pb-5">
            {questions.map((question, index) => (
                <div className="question-detail w-100" key={index}>
                    <div className="w-100">
                        <div className="quiz-title text-dark">
                            <h3>Câu {index + 1}: {question.title}</h3>
                        </div>
                        <div className="quiz-content font-italic text-dark">
                            <h5>{question.content}</h5>
                        </div>
                    </div>
                    <div className="quiz-answers">
                        {question.type === QuestionType.SingleChoice &&
                            question.answers.map(answer =>
                                <Radio answer={answer} key={answer.id} />
                            )
                        }
                        {question.type === QuestionType.MutipleChoice &&
                            question.answers.map(answer =>
                                <CheckBox answer={answer} key={answer.id} />
                            )
                        }

                        {question.type === QuestionType.FreeText &&
                            <div className="answer-item">
                                <textarea className={`Input_input Input_m`}
                                    placeholder='Nhập câu trả lời'
                                    readOnly
                                    value={question.answerText} />
                            </div>
                        }
                    </div>
                </div>
            ))}
        </div >
    )
}

const CheckBox = ({ answer, onClicked, error }) => {
    return (
        <div className="answer-item">
            <label className="Checkbox_checkboxLabel Quiz_select">
                <input type="checkbox"
                    className="Checkbox_input"
                    checked={answer.isChecked ?? false}
                    value={answer.id} disabled />
                <div className={`Checkbox_box ${error ? 'border-danger' : ''}`}>
                    <svg className="Checkbox_tick" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M13.579 2.593a.988.988 0 0 0-1.376.243l-5.759 8.225-2.756-2.756a.987.987 0 1 0-1.397 1.397l3.52 3.52a.978.978 0 0 0 .62.353.985.985 0 0 0 1.032-.519l6.362-9.085a.988.988 0 0 0-.243-1.376z"></path>
                    </svg>
                </div>
                <span className="Checkbox_text"></span>
            </label>
            <div className="Quiz_body">
                <div className="Quiz_title  text-dark">{answer.content}</div>
            </div>
        </div>
    )
}


const Radio = ({ answer, onClicked, error }) => {
    return (
        <div className="answer-item">
            <label className="Radio_checkboxLabel Quiz_select">
                <input type="checkbox"
                    className="Radio_input"
                    checked={answer.isChecked ?? false}
                    value={answer.id} disabled />
                <div className={`Radio_box ${error ? 'border-danger' : ''}`}>
                    <svg className="Radio_tick" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M13.579 2.593a.988.988 0 0 0-1.376.243l-5.759 8.225-2.756-2.756a.987.987 0 1 0-1.397 1.397l3.52 3.52a.978.978 0 0 0 .62.353.985.985 0 0 0 1.032-.519l6.362-9.085a.988.988 0 0 0-.243-1.376z"></path>
                    </svg>
                </div>
                <span className="Radio_text"></span>
            </label>
            <div className="Quiz_body">
                <div className="Quiz_title text-dark">{answer.content}</div>
            </div>
        </div>
    )
}

export { CourseUserSurvey }