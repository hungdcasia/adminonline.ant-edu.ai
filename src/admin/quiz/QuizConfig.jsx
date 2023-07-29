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
    CProgress,
    CRow,
    CValidFeedback
} from '@coreui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { courseService, categoryService, lessonService, quizService } from "../services";
import { history, newFormField, string_to_slug, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, NumberInput, SelectInput, TextInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { Link } from "react-router-dom";
import ReactPlayer from 'react-player';
import Moment from 'react-moment';
import moment from 'moment';
import { Guid } from 'js-guid';
import { AzureMP } from '../../libs/azure-mp';

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

const QuizConfig = props => {
    let [courses, setCourses] = useState([]);
    let [lessons, setLessons] = useState([])
    let [courseSelectedId] = useFormField({ value: 0 });
    let [lessonSelectedId] = useFormField({ value: 0 });
    let [lesson, setLesson] = useState()
    let [quizs, setQuizs] = useState([])

    const getCourses = () => {
        courseService.getList()
            .then((res) => {
                if (res.isSuccess) {
                    setCourses(res.data);
                }
            });
    };

    const getLessons = (courseId) => {
        lessonService.getAllByCourse(courseId)
            .then((res) => {
                if (res.isSuccess) {
                    setLessons(res.data.lessons)
                }
            });
    };

    const getQuizs = (lessonId) => {
    };

    useEffect(() => {
        getCourses();
    }, []);

    const onCourseSelected = () => {
        lessonSelectedId.value = 0
        lessonSelectedId.refresh()
        setLessons([])
        setLesson(null)
        getLessons(courseSelectedId.value)
    }

    const onLessonSelected = () => {
        setLesson(lessons.find(r => r.id == lessonSelectedId.value))
        getQuizs(lessonSelectedId.value)
    }


    return (
        <>
            <CRow>
                <CCol xs="12" lg="12" className='h-100'>
                    <CCard>
                        <CCardHeader>
                            <span className='h3'>Chọn bài học</span>
                            <div className="card-header-actions">
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol xs='6' lg='6'>
                                    <SelectInput name='course'
                                        label='Chọn khóa học'
                                        rawProps={{}}
                                        onChange={onCourseSelected}
                                        field={courseSelectedId}
                                        dataSource={courses}
                                    />
                                </CCol>
                                <CCol xs='6' lg='6'>
                                    <SelectInput name='course'
                                        label='Chọn bài học'
                                        rawProps={{}}
                                        onChange={onLessonSelected}
                                        field={lessonSelectedId}
                                        dataSource={lessons}
                                    />
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            {lesson &&
                <LessonQuiz lesson={lesson} />
            }
        </>
    )
}

const fields = [
    { key: "#", label: "#", _style: { width: '5%' } },
    { key: "title", label: "Câu hỏi", _style: { width: '30%' } },
    { key: "type", label: "type", _style: { width: '10%' } },
    { key: "displayTime", label: "time", _style: { width: '10%' } },
    { key: "action", label: "", _style: { width: '10%' } }
];

const LessonQuiz = ({ lesson }) => {
    let [progress, setProgress] = useState({ played: 0 });
    let videoPlayer = useRef()
    let [quizs, setQuizs] = useState([])
    let [playing, setPlaying] = useState(false)
    let [editingItem, setEditingItem] = useState(null)

    const getQuizs = () => {
        quizService.getListByLesson(lesson.id)
            .then(res => {
                if (res.isSuccess) {
                    setQuizs(res.data);
                }
            });
    }

    useEffect(() => {
        setPlaying(false)
        getQuizs()
    }, [lesson])

    const videoProgress = state => {
        if (state.played) {
            setProgress(state)
        }
    }

    const handleVideoDuration = (duration) => {
    }

    const onCreateClick = () => {
        setPlaying(false)
        setEditingItem({ displayTime: Math.floor(progress?.playedSeconds ?? 0) })
    }

    const editClicked = (item) => {
        setEditingItem(item)
    }

    const deleteItem = (item) => {
        quizService.remove(item.id).then(res => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                getQuizs()
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

    const isAzureMediaUrl = () => {
        var url = lesson.videoUrl;
        return url != null && url.includes('streaming.media.azure.net');
    }

    return (
        <CRow>
            <CCol xs="6" lg="6" className='h-100'>
                <CCard>
                    <CCardHeader>
                        <span className='h3'>{lesson.name}</span>
                        <div className="card-header-actions">
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CLabel>video url: <a href={lesson.videoUrl} target='_blank'>{lesson.videoUrl}</a></CLabel>
                        <CRow>
                            {isAzureMediaUrl() ?
                                <div className='w-100'>
                                    <AzureMP
                                        className='w-100'
                                        skin="amp-flush"
                                        src={[{ src: lesson.videoUrl, type: "application/vnd.ms-sstr+xml" }]}
                                        playing={playing}
                                        onPlay={() => setPlaying(true)}
                                        onPause={() => setPlaying(false)}
                                        onSeek={e => { }}
                                        onError={e => { }}
                                        onProgress={videoProgress}
                                        onDuration={handleVideoDuration}
                                    />
                                </div> :
                                <div className='w-100 position-relative' style={{ paddingBottom: '66%' }}>
                                    <ReactPlayer
                                        ref={videoPlayer}
                                        className='w-100 h-100 position-absolute'
                                        style={{ top: 0 }}
                                        url={lesson.videoUrl}
                                        playing={playing}
                                        pip={false}
                                        controls={true}
                                        light={false}
                                        loop={false}
                                        playbackRate={1.0}
                                        volume={1}
                                        onPlay={() => setPlaying(true)}
                                        onPause={() => setPlaying(false)}
                                        onSeek={e => { }}
                                        onError={e => { }}
                                        onProgress={videoProgress}
                                        onDuration={handleVideoDuration}
                                    />
                                </div>
                            }
                        </CRow>
                        <CProgress size="xs" value={progress.played} max={1} color="danger" className="mb-1 bg-gray" />
                        <CRow alignHorizontal='center'>
                            <CButton onClick={onCreateClick} className='btn-outline-info mt-2' disabled={editingItem != null}>
                                {moment.duration(Math.floor(progress.playedSeconds), 'seconds').format("mm:ss")} <br />Tạo câu hỏi
                            </CButton>
                        </CRow>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs="6" lg="6" className='h-100'>
                <CCard className={editingItem ? 'd-none' : ''}>
                    <CCardBody>
                        <CDataTable
                            items={quizs}
                            fields={fields}
                            striped
                            hover
                            border
                            itemsPerPage={20}
                            pagination
                            scopedSlots={{
                                '#': (item, index) => (
                                    <td>
                                        {index}
                                    </td>
                                ),
                                'title': (item) => {
                                    return (
                                        <td>
                                            {item.title}
                                        </td>
                                    )
                                },
                                'displayTime': (item) => {
                                    return (
                                        <td>{moment.duration(item.displayTime, 'seconds').format("mm:ss")}</td>
                                    )
                                },
                                'action': (item, index) => (
                                    <td >
                                        <div className="py-2 d-flex justify-content-center">
                                            <CButton
                                                color="light"
                                                size="sm"
                                                onClick={() => { editClicked(item, index) }}
                                            >
                                                <FontAwesomeIcon icon={allIcon.faPencilAlt} />
                                            </CButton>
                                            <CButton
                                                className='ml-3'
                                                color="light"
                                                size="sm"
                                                onClick={() => { deleteClicked(item, index) }}
                                            >
                                                <FontAwesomeIcon icon={allIcon.faTrashAlt} />
                                            </CButton>
                                        </div>
                                    </td>
                                )
                            }}
                        />
                    </CCardBody>
                </CCard>
                {editingItem &&
                    <QuizForm
                        lesson={lesson}
                        // quiz={{ time: Math.floor(progress.playedSeconds) }}
                        quiz={editingItem}
                        onCancel={() => { setEditingItem(null); }}
                        onSuccess={() => { setEditingItem(null); getQuizs(); }} />
                }
            </CCol>
        </CRow>
    )
}

const QuizType = {
    SingleChoice: 'SingleChoice',
    MutipleChoice: 'MutipleChoice'
}

const QuizTypeDS = [
    { id: QuizType.MutipleChoice, name: QuizType.MutipleChoice },
    { id: QuizType.SingleChoice, name: QuizType.SingleChoice }
]

const QuizForm = ({ lesson, quiz, onCancel, onSuccess }) => {
    let [title, setTitle] = useFormField({ value: quiz.title ?? '', rules: [{ rule: 'required', message: 'please input' }] })
    let [content, setContent] = useFormField({ value: quiz.content ?? '', rules: [] })
    let [time, setTime] = useFormField({ value: quiz.displayTime ?? 0, rules: [{ rule: 'required', message: 'please input' }] })
    let [point, setPoint] = useFormField({ value: quiz.point ?? 0, rules: [{ rule: 'required', message: 'please input' }] })

    let [type, setType] = useState(quiz.type ?? QuizType.SingleChoice)
    const [inputList, setInputList] = useState([]);
    let [form] = useForm([title, content, time])
    let [error, setError] = useState('');

    useEffect(() => {
        if (quiz.answers && quiz.answers != '') {
            var answers = JSON.parse(quiz.answers);
            setInputList(answers.map(item => { return { Content: item.Content, Id: item.Id, Right: item.Right, error: '' } }))
        }
    }, [quiz]);

    const checkValidAnswers = () => {
        var isvalid = true;
        for (let i = 0; i < inputList.length; i++) {
            const answer = inputList[i];
            if (!answer || answer == '') {
                answer.error = 'Please input.'
                isvalid = false;
            }
        }
        if (!isvalid) {
            setInputList([...inputList]);
        }

        // no right answer
        if (!inputList.some(r => r.Right)) {
            setError('Please chose at least one right answer');
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
                displayTime: time.value,
                point: point.value,
                type: type,
                lessonId: lesson.id,
                courseId: lesson.courseId,
                answers: JSON.stringify(inputList.map(item => {
                    return {
                        Content: item.Content,
                        Id: item.Id,
                        Right: item.Right,
                    }
                }))
            }
            let prom = model.id == 0 ? quizService.create(model) : quizService.update(model);
            prom.then(res => {
                if (res.isSuccess) {
                    alertActions.successUpdate()
                    onSuccess()
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
        if (type == QuizType.MutipleChoice) {
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
        setInputList([...inputList, { Content: "", Id: Guid.newGuid().toString(), Right: false, error: '' }]);
    };

    return (
        <CCard>
            <CCardHeader>
                <span className='h3'></span>
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
            </CCardHeader>
            <CCardBody>
                <CFormGroup>
                    <CLabel htmlFor=''>Type *</CLabel>
                    <select className={`custom-select`}
                        value={type}
                        onChange={(e) => { setType(e.target.value); inputList.forEach(e => e.Right = false); setInputList([...inputList]) }}
                    >
                        <option value={QuizType.SingleChoice}>{QuizType.SingleChoice}</option>
                        <option value={QuizType.MutipleChoice}>{QuizType.MutipleChoice}</option>
                    </select>
                </CFormGroup>

                <TextInput name='title'
                    label='title'
                    rawProps={{}}
                    required
                    field={title}
                />
                <TextInput name='content'
                    label='content'
                    rawProps={{}}
                    field={content}
                />
                <NumberInput name='point'
                    label='point'
                    rawProps={{}}
                    field={point}
                />
                <NumberInput name='time'
                    label='displaytime (s) *'
                    rawProps={{}}
                    field={time}
                />
                <CLabel>Answers</CLabel>
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
                                                type={type == QuizType.SingleChoice ? "radio" : 'checkbox'}
                                                name="Right"
                                                id={index}
                                                checked={answer.Right}
                                                onChange={() => { }}
                                                onClick={(e) => handleRightClick(e, index)} />
                                        </div>
                                        <CFormGroup>
                                            <input className={`form-control ${answer.error == '' ? '' : 'is-invalid'}`}
                                                type='text'
                                                name="Content"
                                                value={answer.Content}
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
        </CCard >
    )
}

export default QuizConfig