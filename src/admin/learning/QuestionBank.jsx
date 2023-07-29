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
import { history, string_isNullOrEmpty, string_to_slug, UrlHelpers, useForm, useFormField } from "../../helpers";
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
import { assessmentQuestionService } from '../services/assessmentQuestion.service';
import { Guid } from 'js-guid';
import { Fragment } from 'react';

const QuestionType = {
    SingleChoice: 'SingleChoice',
    MutipleChoice: 'MutipleChoice',
}

const questionModel = (item) => {
    return {
        id: 0,
        title: item?.title ?? '',
        content: item?.content ?? '',
        answers: [],
        rightAnswers: [],
        courseId: item?.courseId ?? 0,
    }
}

const QuestionBank = props => {
    let ready = useRef()
    let { id } = useParams();
    let [editQuestion, setEditQuestion] = useState()
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

    const { data: usersResult, isFetching } = useQuery(['assessment-questions', sort, paging, filters], () => { return getList() })

    let users = usersResult?.data?.items ?? [];
    let total = usersResult?.data?.total ?? 0;

    const reloadData = () => {
        queryClient.invalidateQueries('assessment-questions')
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
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'content',
            text: 'Nội dung',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span>{cellContent}</span>
            )
        },
        {
            dataField: 'createdTime',
            text: 'Thời gian tạo',
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
                        onClick={() => { onEditClick(item) }}
                        title="Chi tiết"
                    >
                        <FontAwesomeIcon icon={allIcon.faPencilAlt} />
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

    const getList = () => {
        let pagingOptions = {
            page: paging.page == 0 ? 1 : paging.page,
            pageSize: paging.pageSize
        }

        let filterOptions = defaultFilters.concat(filters)
        let sortOptions = { sort: sort.sort, direction: sort.direction }
        return assessmentQuestionService.getList(pagingOptions, filterOptions, sortOptions)
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

    const onEditClick = (item) => {
        let model = questionModel(item);
        model.answers = JSON.parse(item.answers);
        setEditQuestion(model)
    }

    const onAddClick = () => {
        setEditQuestion(questionModel({ courseId: id }));
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
                            <span className='h3'>Danh sách kết quả</span>
                            <div className="card-header-actions">
                                <CButton
                                    onClick={reloadData}
                                    title='Create'>
                                    <FontAwesomeIcon icon={allIcon.faSyncAlt} className={classNames({ 'fa-spin': isFetching })} /> Làm mới
                                </CButton>

                                <CButton onClick={onAddClick}>
                                    <FontAwesomeIcon icon={allIcon.faPlus} /> Thêm
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
            {editQuestion &&
                <CModal show={true}
                    scrollable
                    size='lg'
                    onClose={() => setEditQuestion(false)}>
                    <CModalHeader closeButton className='text-dark font-weight-bold h3'>
                        Câu hỏi
                    </CModalHeader>
                    <CModalBody>
                        <QuizForm quiz={editQuestion} onCancel={() => setEditQuestion(false)}
                            onSuccess={() => { reloadData(); setEditQuestion(false) }} />
                    </CModalBody>
                </CModal>
            }
        </>
    )
}

const QuizTypeDS = [
    { id: QuestionType.SingleChoice, name: QuestionType.SingleChoice },
    { id: QuestionType.MutipleChoice, name: QuestionType.MutipleChoice },
]

const QuizForm = ({ quiz, onCancel, onSuccess }) => {
    let [title, setTitle] = useFormField({ value: quiz.title ?? '', rules: [{ rule: 'required', message: 'please input' }] })
    let [content, setContent] = useFormField({ value: quiz.content ?? '', rules: [] })

    let [type, setType] = useState(quiz.type ?? QuestionType.SingleChoice)
    const [inputList, setInputList] = useState(quiz.answers.map(item => { return { content: item.content, id: item.id, right: item.right, error: '' } }));
    let [form] = useForm([title, content])
    let [error, setError] = useState('');


    const checkValidAnswers = () => {
        var isvalid = true;
        for (let i = 0; i < inputList.length; i++) {
            const answer = inputList[i];
            if (string_isNullOrEmpty(answer.content)) {
                answer.error = 'Nhập nội dung đáp án.'
                isvalid = false;
            }
        }
        if (!isvalid) {
            setInputList([...inputList]);
        }

        //no right answer
        if (!inputList.some(r => r.right)) {
            setError('Chọn ít nhất 1 câu trả lời đúng');
            isvalid = false;
        }

        return isvalid;
    }

    const onSubmit = () => {
        if (form.valid() && checkValidAnswers()) {
            var model = {
                id: quiz.id ?? 0,
                title: title.value,
                content: content.value,
                type: type,
                courseId: quiz.courseId,
                answers: JSON.stringify(inputList.map(item => {
                    return {
                        content: item.content,
                        id: item.id,
                        right: item.right,
                    }
                }))
            }

            assessmentQuestionService.create(model)
                .then(res => {
                    if (res.isSuccess) {
                        alertActions.success("Tạo câu hỏi thành công.");
                        onSuccess(model)
                    }
                })
        }
    }

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        list[index]['error'] = '';
        setInputList(list);
    };

    const handleRightClick = (e, index) => {
        const { name, checked } = e.target;
        const list = [...inputList];
        if (type == QuestionType.MutipleChoice) {
            list[index][name] = checked;
        } else {
            list.forEach((e, i) => {
                e[name] = index == i;
            });
        }

        setInputList(list);
        setError('')
    }

    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        if (inputList.length == 5)
            return;
        setInputList([...inputList, { content: "", id: Guid.newGuid().toString(), right: false, error: '' }]);
    };

    return (
        <CCard className='m-0 border-0'>
            <CCardBody>
                <CFormGroup>
                    <CLabel htmlFor=''>Loại câu hỏi *</CLabel>
                    <select className={`custom-select`}
                        value={type}
                        onChange={(e) => { setType(e.target.value); inputList.forEach(e => e.right = false); setInputList([...inputList]) }}
                    >
                        {QuizTypeDS.map(r => (
                            <option value={r.id} key={r.id}>{r.name}</option>
                        ))}
                    </select>
                </CFormGroup>

                <TextInput name='title'
                    label='Tiêu đề'
                    rawProps={{}}
                    required
                    field={title}
                />
                <TextInput name='content'
                    label='Nội dung'
                    rawProps={{}}
                    field={content}
                />
                <CLabel>Đáp án</CLabel>
                <CFormGroup>
                    <CRow >
                        {inputList.map((answer, index) => {
                            return (
                                <Fragment key={index}>
                                    <CCol xs='12' lg='12' className='form-inline mb-1'>
                                        <button className=" btn mr-3"
                                            disabled={inputList.length == 1}
                                            onClick={() => handleRemoveClick(index)}>
                                            <FontAwesomeIcon icon={allIcon.faMinusCircle} className='text-danger' style={{ fontSize: '18x' }} />
                                        </button>
                                        <div className="form-check">
                                            <input className="form-check-input"
                                                type={type == QuestionType.SingleChoice ? "radio" : 'checkbox'}
                                                name="right"
                                                id={index}
                                                checked={answer.right}
                                                onChange={() => { }}
                                                onClick={(e) => handleRightClick(e, index)} />
                                        </div>
                                        <CFormGroup>
                                            <input className={`form-control ${answer.error == '' ? '' : 'is-invalid'}`}
                                                type='text'
                                                name="content"
                                                value={answer.content}
                                                style={{ minWidth: '350px' }}
                                                onChange={e => handleInputChange(e, index)}
                                            />
                                        </CFormGroup>
                                    </CCol>
                                    <CCol xs='12' lg='12' className='form-inline'>
                                        {answer.error != '' &&
                                            <CInvalidFeedback > {answer.error}</CInvalidFeedback>
                                        }
                                    </CCol>
                                </Fragment>
                            );
                        })}
                    </CRow>
                    {inputList.length < 5 &&
                        < CRow >
                            <CCol xs='12' lg='12' className='form-inline'>
                                <button onClick={handleAddClick} className='btn'>
                                    <FontAwesomeIcon icon={allIcon.faPlusCircle} className='text-success' style={{ fontSize: '18x' }} />
                                </button>
                            </CCol>
                        </CRow>
                    }
                    <CLabel className='text-danger'>{error}</CLabel>
                </CFormGroup>
            </CCardBody>
            <CCardFooter>
                <div className="card-header-actions">
                    <CButton className={'float-right'}
                        color="danger"
                        onClick={onCancel}>
                        <FontAwesomeIcon icon={allIcon.faTrashAlt} /> Hủy
                    </CButton>
                    <CButton className={'float-right mr-3'}
                        color="success"
                        onClick={onSubmit}>
                        <FontAwesomeIcon icon={allIcon.faSave} /> Lưu
                    </CButton>
                </div>
            </CCardFooter>
        </CCard >
    )
}

export { QuestionBank }