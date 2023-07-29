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
import { useEffect, useRef, useState, Fragment } from 'react'
import { courseService, chapterService, uploadService, lessonService } from "../services";
import { customFetch, history, string_to_slug, UrlHelpers, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, ImageInput, NumberInput, PageToolBar, SelectInput, TextAreaInput, TextInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { Link } from "react-router-dom";
import moment from 'moment';
import ReactPlayer from 'react-player';
import PdfComponent from '../../shared/PdfComponent';
import { LessonType } from '../../constants';
import { AzureMP } from '../../libs/azure-mp'
import FormQuiz from './forms/FormQuiz';
import { formQuizModel } from './forms/FormQuizModel';

let EditType = {
    EDIT_QUIZ: 'edit-quiz',
    EDIT_CHAPTER: 'edit-chapter',
    EDIT_LESSON: 'edit-lesson',
    SORT_CHAPTER: 'sort-chapter',
    SORT_LESSON: 'sort-lesson'
};

let newChapter = () => {
    return {
        id: 0,
        name: '',
        displayOrder: 100000
    }
}

let newLesson = () => {
    return {
        id: 0,
        chapterId: 0,
        name: '',
        slug: '',
        description: '',
        type: 'video',
        videoUrl: '',
        displayOrder: 100000,
        timeLength: 0,
        checkpoint: false,
        requirePoint: 0
    }
}

const CourseLessons = props => {

    let { id } = props.match.params;
    let [course, setCourse] = useState();
    let [editing, setEditing] = useState(null);
    let [lessons, setLessons] = useState([])
    let [chapters, setChapters] = useState([])
    let [quizzes, setQuizzes] = useState([])

    const getLessons = () => {
        if (id > 0)
            lessonService.getAllByCourse(id)
                .then((res) => {
                    if (res.isSuccess) {
                        setChapters(res.data.chapters)
                        setLessons(res.data.lessons)
                        setQuizzes(res.data.quizzes)
                    }
                });
    };

    const getCourse = () => {
        if (id > 0)
            courseService.getDetail(id)
                .then((res) => {
                    if (res.isSuccess) {
                        setCourse(res.data.course);
                    }
                });
    };

    useEffect(() => {
        getLessons();
        // getCourse();
    }, []);

    const cancelEdit = () => {
        setEditing(null);
    }

    const editChapterClicked = (chapter) => {
        setEditing({
            type: EditType.EDIT_CHAPTER,
            item: chapter
        })
    }

    const editLessonClicked = (lesson) => {
        setEditing({
            type: EditType.EDIT_LESSON,
            item: lesson
        })
    }

    const editQuizClicked = (quiz, lesson) => {
        setEditing({
            type: EditType.EDIT_QUIZ,
            item: quiz,
            lesson: lesson,
        })
    }

    const deleteChapterClicked = (chapter) => {
        modalActions.show({
            title: 'Bạn chắc chắn muốn xóa mục này?',
            ok: 'Chắc chắn',
            cancel: "Không",
            onCancel: () => {

            },
            onOk: () => {
                chapterService.remove(chapter.id)
                    .then(res => {
                        if (res.isSuccess) {
                            alertActions.successUpdate();
                            getLessons();
                        }
                    })
            }
        });
    }

    const deleteLessonClicked = (lesson) => {
        modalActions.show({
            title: 'Bạn chắc chắn muốn xóa mục này?',
            ok: 'Chắc chắn',
            cancel: "Không",
            onCancel: () => {

            },
            onOk: () => {
                lessonService.remove(lesson.id)
                    .then(res => {
                        if (res.isSuccess) {
                            alertActions.successUpdate();
                            getLessons();
                        }
                    })
            }
        });
    }

    const deleteQuizClicked = (quiz) => {
        modalActions.show({
            title: 'Bạn chắc chắn muốn xóa mục này?',
            ok: 'Chắc chắn',
            cancel: "Không",
            onCancel: () => {

            },
            onOk: () => {
                lessonService.removeQuiz(quiz.id)
                    .then(res => {
                        if (res.isSuccess) {
                            alertActions.successUpdate();
                            getLessons();
                        }
                    })
            }
        });
    }

    const sortChapterClicked = () => {
        setEditing({
            type: EditType.SORT_CHAPTER
        })
    }

    const sortLessonClicked = (chapter) => {
        setEditing({
            type: EditType.SORT_LESSON,
            item: chapter
        })
    }



    return (
        <>
            < CRow alignHorizontal='center'>
                {!editing &&
                    <CCol xs='12' lg="12">
                        <CRow>
                            <CCol xs="12" lg="12" className='h-100'>
                                <PageToolBar hideBackButton>
                                    {chapters.length > 0 &&
                                        <CButton className={'float-right mr-2'}
                                            color="info"
                                            onClick={() => editLessonClicked(newLesson())}
                                            size={''} alt="Thêm chương">
                                            <FontAwesomeIcon icon={allIcon.faPlus} /> Bài học
                                        </CButton>
                                    }
                                    <CButton className={'float-right mr-2'}
                                        color="info"
                                        onClick={() => editChapterClicked(newChapter())}
                                        size={''} alt="Thêm chương">
                                        <FontAwesomeIcon icon={allIcon.faPlus} /> Chương
                                    </CButton>
                                    <CButton className={'float-right mb-0'}
                                        color="info"
                                        onClick={sortChapterClicked}
                                        size={''} alt="Sắp xếp chương">
                                        <FontAwesomeIcon icon={allIcon.faSortAmountDownAlt} /> Chương
                                    </CButton>
                                </PageToolBar>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol xs='12' >
                                <CCard>
                                    <CCardHeader>
                                        <span className='h5'>Danh sách bài học</span>
                                    </CCardHeader>
                                    <CCardBody>
                                        <table className="table table-light table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Loại</th>
                                                    <th>Tên</th>
                                                    <th>Điểm yêu cầu</th>
                                                    <th>Thời lượng</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {chapters.map(chapter =>
                                                    <Fragment key={chapter.id}>
                                                        <tr className='font-weight-bold'>
                                                            <td className="align-middle" width='30px' scope="row">Chương</td>
                                                            <td className="align-middle" width='40%'>{chapter.name}</td>
                                                            <td className="align-middle"></td>
                                                            <td className="align-middle"></td>
                                                            {/* <td className="align-middle"></td> */}
                                                            <td className="align-middle" width='30px'>
                                                                <div className="py-2 d-flex justify-content-end">
                                                                    <CButton
                                                                        color="light"
                                                                        size="sm"
                                                                        title="edit"
                                                                        onClick={() => editChapterClicked(chapter)}
                                                                    >
                                                                        <FontAwesomeIcon icon={allIcon.faPencilAlt} />
                                                                    </CButton>
                                                                    <CButton
                                                                        className='ml-3'
                                                                        color="light"
                                                                        size="sm"
                                                                        title="Sắp xếp bài học"
                                                                        onClick={() => sortLessonClicked(chapter)}
                                                                    >
                                                                        <FontAwesomeIcon icon={allIcon.faSortAmountDownAlt} />
                                                                    </CButton>
                                                                    <CButton
                                                                        className='ml-3'
                                                                        color="light"
                                                                        size="sm"
                                                                        title="delete"
                                                                        onClick={() => deleteChapterClicked(chapter)}
                                                                    >
                                                                        <FontAwesomeIcon icon={allIcon.faTrashAlt} />
                                                                    </CButton>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {lessons.filter(lesson => lesson.chapterId === chapter.id).map(lesson =>
                                                            <Fragment key={lesson.id}>
                                                                <tr key={lesson.id}>
                                                                    <td width='30px' className="align-middle" scope="row">Bài</td>
                                                                    <td width='40%' className="align-middle">{lesson.name}</td>
                                                                    <td width='20%' className="align-middle">{lesson.checkpoint ? lesson.requirePoint : ''}</td>
                                                                    <td className="align-middle">{moment.duration(lesson.timeLength, 'seconds').format("mm:ss")}</td>
                                                                    {/* <td className="align-middle">{lesson.videoUrl ? <a target="_blank" href={lesson.videoUrl}>Xem</a> : 'no-video'}</td> */}
                                                                    <td width='30px' className="align-middle">
                                                                        <div className="py-2 d-flex justify-content-end">
                                                                            <CButton
                                                                                title='Thêm Quiz' 
                                                                                className='ml-3'
                                                                                color="light"
                                                                                size="sm"
                                                                                onClick={() => editQuizClicked(new formQuizModel(), lesson)}
                                                                            >
                                                                                <FontAwesomeIcon icon={allIcon.faPlus} />
                                                                            </CButton>
                                                                            <CButton
                                                                                title='Sửa' 
                                                                                className='ml-3'
                                                                                color="light"
                                                                                size="sm"
                                                                                onClick={() => editLessonClicked(lesson)}
                                                                            >
                                                                                <FontAwesomeIcon icon={allIcon.faPencilAlt} />
                                                                            </CButton>

                                                                            <CButton
                                                                                title='Xoá'
                                                                                className='ml-3'
                                                                                color="light"
                                                                                size="sm"
                                                                                onClick={() => deleteLessonClicked(lesson)}
                                                                            >
                                                                                <FontAwesomeIcon icon={allIcon.faTrashAlt} />
                                                                            </CButton>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                {quizzes.filter(p => p.lessonId === lesson.id).map(quiz =>
                                                                    <tr key={quiz.id}>
                                                                        <td width='30px' className="align-middle" scope="row">Quiz</td>
                                                                        <td width='40%' className="align-middle">{quiz.title}</td>
                                                                        <td width='20%' className="align-middle"></td>
                                                                        <td className="align-middle">{quiz.time ? moment.duration(quiz.time, 'seconds').format("mm:ss"): "N/A"}</td>
                                                                        {/* <td className="align-middle">{lesson.videoUrl ? <a target="_blank" href={lesson.videoUrl}>Xem</a> : 'no-video'}</td> */}
                                                                        <td width='30px' className="align-middle">
                                                                            <div className="py-2 d-flex justify-content-end">
                                                                                <CButton
                                                                                    title='Sửa quiz' 
                                                                                    className='ml-3'
                                                                                    color="light"
                                                                                    size="sm"
                                                                                    onClick={() => editQuizClicked(quiz, lesson)}
                                                                                >
                                                                                    <FontAwesomeIcon icon={allIcon.faPencilAlt} />
                                                                                </CButton>

                                                                                <CButton
                                                                                    title='Xoá quiz' 
                                                                                    className='ml-3'
                                                                                    color="light"
                                                                                    size="sm"
                                                                                    onClick={() => deleteQuizClicked(quiz)}
                                                                                >
                                                                                    <FontAwesomeIcon icon={allIcon.faTrashAlt} />
                                                                                </CButton>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </Fragment>
                                                        )}
                                                    </Fragment>
                                                )}
                                            </tbody>
                                        </table>
                                    </CCardBody>
                                </CCard>

                            </CCol>
                        </CRow>
                    </CCol>
                }

                {(editing && editing.type === EditType.EDIT_CHAPTER) &&
                    <CCol xs='9' lg="9">
                        <FormChapter chapter={editing.item}
                            courseId={id}
                            course={course}
                            onCancel={() => setEditing(null)}
                            onSuccess={() => { setEditing(null); getLessons() }} />
                    </CCol>
                }

                {(editing && editing.type === EditType.EDIT_LESSON) &&
                    <CCol xs='9' lg="9">
                        <FormLesson lesson={editing.item}
                            courseId={id}
                            course={course}
                            chapters={chapters}
                            onCancel={() => setEditing(null)}
                            onSuccess={() => { setEditing(null); getLessons() }} />
                    </CCol>
                }

                {(editing && editing.type === EditType.EDIT_QUIZ) &&
                    <CCol xs='9' lg="9">
                        <FormQuiz  lesson={editing.lesson}
                            item={editing.item}
                            courseId={id}
                            course={course}
                            chapters={chapters}
                            onCancel={() => setEditing(null)}
                            onSuccess={() => { setEditing(null); getLessons() }} />
                    </CCol>
                }

                {(editing && editing.type === EditType.SORT_CHAPTER) &&
                    <CCol xs='9' lg="9">
                        <SortChapter
                            courseId={id}
                            course={course}
                            chapters={chapters}
                            onCancel={() => setEditing(null)}
                            onSuccess={() => { setEditing(null); getLessons() }} />
                    </CCol>
                }

                {(editing && editing.type === EditType.SORT_LESSON) &&
                    <CCol xs='9' lg="9">
                        <SortLesson
                            courseId={id}
                            course={course}
                            lessons={lessons.filter(r => r.chapterId === editing.item.id)}
                            onCancel={() => setEditing(null)}
                            onSuccess={() => { setEditing(null); getLessons() }} />
                    </CCol>
                }
            </CRow>


        </>
    )
}

const FormChapter = props => {
    let { chapter, course, courseId, onCancel, onSuccess } = props
    let [name] = useFormField({ value: (chapter?.name ?? ''), rules: [{ rule: 'required', message: 'Please Input' }] })
    let [description] = useFormField({ value: (chapter?.description ?? ''), rules: [] })
    let [form] = useForm([name, description]);
    const onSubmitClicked = () => {
        if (form.valid()) {
            let model = {
                id: chapter.id,
                courseId: courseId,
                name: name.value,
                description: description.value,
                displayOrder: chapter.displayOrder
            }

            let prom = null;
            if (chapter.id == 0) {
                prom = chapterService.create(model);
            } else {
                prom = chapterService.update(model);
            }

            prom.then(res => {
                if (res.isSuccess) {
                    alertActions.successUpdate()
                    onSuccess()
                }
            })
        }
    }

    const onCancelClicked = () => {
        onCancel();
    }

    return (
        <>
            <CRow>
                <CCol xs='12' lg='12'>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <CButton onClick={() => history.push('/admin/courses/' + courseId)}
                                type='link'>
                                <FontAwesomeIcon icon={allIcon.faChevronLeft} /> Khóa học {course?.name}</CButton>
                            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            </ul>
                            <div className="form-inline my-2 my-lg-0">
                                <CButton className={'float-right mr-3'}
                                    color="success"
                                    onClick={onSubmitClicked}>
                                    <FontAwesomeIcon icon={allIcon.faSave} /> Lưu
                                </CButton>
                                <CButton className={'float-right mr-3'}
                                    color="info"
                                    onClick={onCancelClicked}>
                                    <FontAwesomeIcon icon={allIcon.faSave} /> Hủy
                                </CButton>
                            </div>
                        </div>
                    </nav>
                </CCol>
            </CRow>
            <CRow>
                <CCol xs='12' lg='12'>
                    <CCard>
                        <CCardHeader>
                            <span className='h5'>Thêm chương</span>
                        </CCardHeader>
                        <CCardBody>
                            <TextInput name='name'
                                label='Tên'
                                required
                                field={name}
                            />
                            <TextAreaInput name='description'
                                label='Mô tả'
                                rawProps={{ style: { height: '120px' } }}
                                field={description}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

const getHMS = (timeInSeconds) => {
    let h = Math.floor(timeInSeconds / 3600)
    let m = Math.floor((timeInSeconds - h * 3600) / 60)
    let s = timeInSeconds - h * 3600 - m * 60

    return [h, m, s]
}

const FormLesson = props => {
    let { lesson, chapters, course, courseId, onCancel, onSuccess } = props
    let [initH, initM, initS] = getHMS(lesson?.timeLength ?? 0)
    let inputPdfFile = useRef()
    let videoPlayer = useRef()

    let [name] = useFormField({ value: (lesson?.name ?? ''), rules: [{ rule: 'required', message: 'Please Input' }] })
    let [description] = useFormField({ value: (lesson?.description ?? ''), rules: [] })
    let [slug] = useFormField({ value: (lesson?.slug ?? ''), rules: [] })
    let [chapterId] = useFormField({ value: (lesson?.chapterId ?? 0), rules: [{ rule: 'numeric|min:1,num', message: 'Please Select' }] })

    let [hour] = useFormField({ value: initH, rules: [] })
    let [minute] = useFormField({ value: initM, rules: [] })
    let [seconds] = useFormField({ value: initS, rules: [] })

    let [lessonType, setLessonType] = useState(lesson?.type ?? LessonType.VIDEO)

    let [videoUrl] = useFormField({ value: (lesson?.videoUrl ?? ''), rules: [] })
    let [pdfUrl, setPdfUrl] = useState(lesson?.videoUrl ?? '')

    let [checkpoint, setCheckpoint] = useState(lesson?.checkpoint)
    let [requirePoint, setRequirePoint] = useState(lesson?.requirePoint)

    let [form] = useForm([name, description, slug, chapterId, videoUrl]);

    let [videoInfo, setVideoInfo] = useState();
    let [durationInfo, setDurationInfo] = useState(0)

    const onSubmitClicked = () => {
        if (form.valid()) {
            let model = {
                id: lesson.id,
                courseId: courseId,
                chapterId: chapterId.value,
                name: name.value,
                description: description.value,
                slug: slug.value,
                type: lessonType,
                timeLength: hour.value * 3600 + minute.value * 60 + seconds.value,
                videoUrl: lessonType == LessonType.VIDEO ? videoUrl.value : pdfUrl,
                displayOrder: lesson.displayOrder,
                checkpoint: checkpoint,
                requirePoint: checkpoint ? requirePoint : 0
            }

            let prom = null;
            if (lesson.id == 0) {
                prom = lessonService.create(model);
            } else {
                prom = lessonService.update(model);
            }

            prom.then(res => {
                if (res.isSuccess) {
                    alertActions.successUpdate()
                    onSuccess()
                }
            })
        }
    }

    const setTimeLength = (timeInSeconds) => {
        setDurationInfo(timeInSeconds)
        let [h, m, s] = getHMS(timeInSeconds)
        hour.value = h ?? 0
        minute.value = m ?? 0
        seconds.value = s ?? 0

        seconds.refresh?.call()
        minute.refresh?.call()
        hour.refresh?.call()
    }

    const onCancelClicked = () => {
        onCancel();
    }

    const onNameChange = () => {
        slug.value = string_to_slug(name.value);
        slug.refresh?.call();
    }

    useEffect(() => {
        if (lesson.type == LessonType.VIDEO && lesson.videoUrl) {
            checkVideoUrl();
        }
    }, [])

    const checkVideoUrl = () => {
        if (videoUrl.value) {
            if (isAzureMediaUrl()) {
                setVideoInfo(null);
                return;
            }
            fetch(`https://noembed.com/embed?url=${videoUrl.value}`)
                .then(res => res.json())
                .then(res => {
                    if (typeof res.error !== undefined) {
                        setVideoInfo(res);
                    } else {
                        setVideoInfo(null);
                        setDurationInfo(null)
                        alertActions.error('Không thể lấy thông tin video')
                    }
                })
                .catch(e => {
                    alertActions.error('Không thể lấy thông tin video')
                })
        }
    }

    const onChangeFileClicked = () => {
        inputPdfFile.current.click()
    }

    const onSelectFile = (event) => {
        event.stopPropagation()
        event.preventDefault()
        if (event.target.files && event.target.files.length > 0) {
            var file = event.target.files[0]
            uploadService
                .uploadDocument(file)
                .then((res) => {
                    if (res.isSuccess) {
                        let docUrl = uploadService.getImageUrl(res.data)
                        setPdfUrl(docUrl)
                    }
                })
                .finally(() => {
                    event.target.value = ''
                })
        }
    }

    const isAzureMediaUrl = () => {
        var url = videoUrl.value;
        return url != null && url.includes('streaming.media.azure.net');
    }

    return (
        <>
            <CRow>
                <CCol xs='12' lg='12'>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <CButton onClick={() => history.push('/admin/courses/' + courseId)}
                                type='link'>
                                <FontAwesomeIcon icon={allIcon.faChevronLeft} /> Khóa học {course?.name}</CButton>
                            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            </ul>
                            <div className="form-inline my-2 my-lg-0">
                                <CButton className={'float-right mr-3'}
                                    color="success"
                                    onClick={onSubmitClicked}>
                                    <FontAwesomeIcon icon={allIcon.faSave} /> Lưu
                                </CButton>
                                <CButton className={'float-right mr-3'}
                                    color="info"
                                    onClick={onCancelClicked}>
                                    <FontAwesomeIcon icon={allIcon.faSave} /> Hủy
                                </CButton>
                            </div>
                        </div>
                    </nav>
                </CCol>
            </CRow>
            <CRow>
                <CCol xs='12' lg='12'>
                    <CCard>
                        <CCardHeader>
                            <span className='h5'>Thêm bài học</span>
                        </CCardHeader>
                        <CCardBody>
                            <TextInput name='name'
                                label='Tên'
                                onBlur={onNameChange}
                                required
                                field={name}
                            />

                            <TextInput name='slug'
                                label='slug'
                                field={slug}
                                rawProps={{ readOnly: true }}
                            />

                            <TextAreaInput name='description'
                                label='Mô tả'
                                rawProps={{ style: { height: '120px' } }}
                                field={description}
                            />

                            <SelectInput name='chapter'
                                label='Chương'
                                rawProps={{}}
                                required
                                field={chapterId}
                                dataSource={chapters}
                            />

                            <CFormGroup>
                                <CLabel>Loại nội dung *</CLabel>
                                <select className='custom-select' value={lessonType} onChange={e => setLessonType(e.target.value)}>
                                    <option value={LessonType.VIDEO}>Video</option>
                                    <option value={LessonType.PDF}>Pdf</option>
                                </select>
                            </CFormGroup>

                            <CLabel>Thời lượng</CLabel>
                            <div className='row form-inline mb-3'>
                                <div className='col col-2' style={{ width: '80px' }}>
                                    <NumberInput
                                        label=''
                                        name='hour'
                                        rawProps={{ style: { width: '100%' }, min: '0' }}
                                        field={hour}
                                    />
                                </div>:
                                <div className='col col-2' style={{ width: '80px' }}>
                                    <NumberInput
                                        label=''
                                        name='minute'
                                        rawProps={{ style: { width: '100%' }, min: '0' }}
                                        field={minute}
                                    />
                                </div>:
                                <div className='col col-2' style={{ width: '80px' }}>
                                    <NumberInput
                                        label=''
                                        name='seconds'
                                        rawProps={{ style: { width: '100%' }, min: '0' }}
                                        field={seconds}
                                    />
                                </div>
                            </div>

                            <CFormGroup>
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox"
                                        className="custom-control-input"
                                        id='checkpoint'
                                        name='checkpoint'
                                        checked={checkpoint}
                                        onChange={(e) => { setCheckpoint(e.target.checked); }} />
                                    <label className="custom-control-label" htmlFor='checkpoint'>Checkpoint</label>
                                </div>
                            </CFormGroup>

                            {checkpoint &&
                                <CFormGroup>
                                    <label htmlFor='requirePoint'>Điểm tối thiểu</label>
                                    <input
                                        type="number"
                                        className='form-control'
                                        name='requirePoint'
                                        value={requirePoint}
                                        onChange={(e) => setRequirePoint(e.target.value)}
                                    />
                                </CFormGroup>
                                // <NumberInput name='requirePoint' field={requirePoint} label='Điểm tối thiểu' />
                            }
                        </CCardBody>
                    </CCard>

                    {lessonType == LessonType.VIDEO &&
                        <CCard>
                            <CCardHeader>
                                <span className='h5'>Nội dung bài học</span>
                            </CCardHeader>
                            <CCardBody>
                                <TextInput name='video'
                                    label='Video Url'
                                    field={videoUrl}
                                    onBlur={checkVideoUrl}
                                    rawProps={{}}
                                />
                                {!isAzureMediaUrl() ?
                                    <>
                                        {videoInfo &&
                                            <CFormGroup className='px-3'>
                                                <CLabel className='col-sm-12 col-form-label font-weight-bold'>Thông tin Video</CLabel>
                                                <CLabel className='col-sm-12 col-form-label'>Tên: {videoInfo.title}</CLabel>
                                                <CLabel className='col-sm-12 col-form-label'>Url: <a target="_blank" href={videoInfo.url}>{videoInfo.url}</a></CLabel>
                                                {durationInfo > 0 ?
                                                    <CLabel className='col-sm-12 col-form-label'>
                                                        Độ dài: {moment.duration(durationInfo, 'seconds').format("mm:ss")} ({durationInfo}s)
                                                    </CLabel> :
                                                    <CLabel className='col-sm-12 col-form-label text-warning'>
                                                        Độ dài: không lấy được thông tin
                                                    </CLabel>
                                                }
                                                <CLabel className='col-sm-12 col-form-label'>Xem thử:</CLabel>
                                                <ReactPlayer
                                                    ref={videoPlayer}
                                                    className=''
                                                    width='100%'
                                                    url={videoInfo.url}
                                                    pip={false}
                                                    playing={true}
                                                    controls={true}
                                                    light={false}
                                                    loop={false}
                                                    volume={1}
                                                    onDuration={(d) => setTimeLength(Math.round(d))}
                                                    muted={true}
                                                />
                                            </CFormGroup>
                                        }
                                    </> :
                                    <>
                                        <AzureMP
                                            className='w-100'
                                            skin="amp-flush"
                                            src={[{ src: videoUrl.value, type: "application/vnd.ms-sstr+xml" }]}
                                            onDuration={(d) => setTimeLength(Math.round(d))}
                                        />
                                    </>
                                }
                            </CCardBody>
                        </CCard>
                    }

                    {lessonType == LessonType.PDF &&
                        <CCard>
                            <CCardHeader>
                                <span className='h5'>Nội dung bài học</span>
                                <div className="float-right">
                                    <input
                                        type="file"
                                        id="file"
                                        ref={inputPdfFile}
                                        onChange={onSelectFile}
                                        accept="application/pdf"
                                        style={{ display: 'none' }}
                                    />
                                    <CButton type="link" onClick={onChangeFileClicked}>
                                        Tải lên
                                    </CButton>
                                </div>
                            </CCardHeader>
                            <CCardBody>
                                <CLabel>Url: <a target="_blank" href={videoUrl.value}>{videoUrl.value}</a></CLabel>
                                <div style={{ overflowX: 'auto', maxHeight: '500px' }}>
                                    {pdfUrl != null &&
                                        <PdfComponent pdfFile={pdfUrl} />
                                    }
                                </div>
                            </CCardBody>
                        </CCard>
                    }
                </CCol>
            </CRow>
        </>
    )
}

const SortChapter = props => {
    let { chapters, onCancel, onSuccess, courseId, course } = props;
    let [items, setItems] = useState(chapters.map((ele, index) => {
        return { id: ele.id, name: ele.name, index: index }
    }))

    const onSubmitClicked = () => {
        if (items.length == 0) {
            onSuccess()
            return;
        }

        var model = {};
        items.forEach((item, index) => {
            model[item.id] = index + 1;
        });

        chapterService.sort(model)
            .then(res => {
                if (res.isSuccess) {
                    alertActions.successUpdate();
                    onSuccess()
                }
            });
    }

    const onCancelClicked = () => {
        onCancel();
    }

    const upClick = chapter => {
        var index = chapter.index;
        if (index == 0)
            return;
        chapter.index = index - 1;
        items[index - 1].index = index;
        setItems(items.sort((a, b) => a.index - b.index).map(r => r));
    }

    const downClick = chapter => {
        var index = chapter.index;
        if (index == items.length - 1)
            return;
        chapter.index = index + 1;
        items[index + 1].index = index;
        setItems(items.sort((a, b) => a.index - b.index).map(r => r));
    }

    return (
        <>
            <CRow>
                <CCol xs='12' lg='12'>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <CButton onClick={() => history.push('/admin/courses/' + courseId)}
                                type='link'>
                                <FontAwesomeIcon icon={allIcon.faChevronLeft} /> Khóa học {course?.name}</CButton>
                            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            </ul>
                            <div className="form-inline my-2 my-lg-0">
                                <CButton className={'float-right mr-3'}
                                    color="success"
                                    onClick={onSubmitClicked}>
                                    <FontAwesomeIcon icon={allIcon.faSave} /> Lưu
                                </CButton>
                                <CButton className={'float-right mr-3'}
                                    color="info"
                                    onClick={onCancelClicked}>
                                    <FontAwesomeIcon icon={allIcon.faSave} /> Hủy
                                </CButton>
                            </div>
                        </div>
                    </nav>
                </CCol>
            </CRow>
            <CRow>
                <CCol xs='12' lg='12'>
                    <table className="table table-light table-hover">
                        <tbody>
                            {items.map(chapter =>
                                <Fragment key={chapter.id}>
                                    <tr className='font-weight-bold'>
                                        {/* <td className="align-middle" width='30px' scope="row">Chương</td> */}
                                        <td className="align-middle" width='50%'>{chapter.name}</td>
                                        <td className="align-middle"></td>
                                        <td className="align-middle"></td>
                                        <td className="align-middle" width='30px'>
                                            <div className="py-2 d-flex justify-content-end">
                                                <CButton
                                                    color="light"
                                                    size="sm"
                                                    title="edit"
                                                    onClick={() => downClick(chapter)}
                                                >
                                                    <FontAwesomeIcon icon={allIcon.faArrowDown} />
                                                </CButton>

                                                <CButton
                                                    className='ml-3'
                                                    color="light"
                                                    size="sm"
                                                    title="delete"
                                                    onClick={() => upClick(chapter)}
                                                >
                                                    <FontAwesomeIcon icon={allIcon.faArrowUp} />
                                                </CButton>
                                            </div>
                                        </td>
                                    </tr>
                                </Fragment>
                            )}
                        </tbody>
                    </table>
                </CCol>
            </CRow>
        </>
    )
}

const SortLesson = props => {
    let { lessons, onCancel, onSuccess, courseId, course } = props;
    let [items, setItems] = useState(lessons.map((ele, index) => {
        return { id: ele.id, name: ele.name, index: index }
    }))

    const onSubmitClicked = () => {
        if (items.length == 0) {
            onSuccess()
            return;
        }

        var model = {};
        items.forEach((item, index) => {
            model[item.id] = index + 1;
        });

        lessonService.sort(model)
            .then(res => {
                if (res.isSuccess) {
                    alertActions.successUpdate();
                    onSuccess()
                }
            });
    }

    const onCancelClicked = () => {
        onCancel();
    }

    const upClick = lesson => {
        var index = lesson.index;
        if (index == 0)
            return;
        lesson.index = index - 1;
        items[index - 1].index = index;
        setItems(items.sort((a, b) => a.index - b.index).map(r => r));
    }

    const downClick = lesson => {
        var index = lesson.index;
        if (index == items.length - 1)
            return;
        lesson.index = index + 1;
        items[index + 1].index = index;
        setItems(items.sort((a, b) => a.index - b.index).map(r => r));
    }

    return (
        <>
            <CRow>
                <CCol xs='12' lg='12'>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <CButton onClick={() => history.push('/admin/courses/' + courseId)}
                                type='link'>
                                <FontAwesomeIcon icon={allIcon.faChevronLeft} /> Khóa học {course?.name}</CButton>
                            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            </ul>
                            <div className="form-inline my-2 my-lg-0">
                                <CButton className={'float-right mr-3'}
                                    color="success"
                                    onClick={onSubmitClicked}>
                                    <FontAwesomeIcon icon={allIcon.faSave} /> Lưu
                                </CButton>
                                <CButton className={'float-right mr-3'}
                                    color="info"
                                    onClick={onCancelClicked}>
                                    <FontAwesomeIcon icon={allIcon.faSave} /> Hủy
                                </CButton>
                            </div>
                        </div>
                    </nav>
                </CCol>
            </CRow>
            <CRow>
                <CCol xs='12' lg='12'>
                    <table className="table table-light table-hover">
                        <tbody>
                            {items.map(chapter =>
                                <Fragment key={chapter.id}>
                                    <tr className=''>
                                        {/* <td className="align-middle" width='30px' scope="row">Chương</td> */}
                                        <td className="align-middle" width='50%'>{chapter.name}</td>
                                        <td className="align-middle"></td>
                                        <td className="align-middle"></td>
                                        <td className="align-middle" width='30px'>
                                            <div className="py-2 d-flex justify-content-end">
                                                <CButton
                                                    color="light"
                                                    size="sm"
                                                    title="edit"
                                                    onClick={() => downClick(chapter)}
                                                >
                                                    <FontAwesomeIcon icon={allIcon.faArrowDown} />
                                                </CButton>

                                                <CButton
                                                    className='ml-3'
                                                    color="light"
                                                    size="sm"
                                                    title="delete"
                                                    onClick={() => upClick(chapter)}
                                                >
                                                    <FontAwesomeIcon icon={allIcon.faArrowUp} />
                                                </CButton>
                                            </div>
                                        </td>
                                    </tr>
                                </Fragment>
                            )}
                        </tbody>
                    </table>
                </CCol>
            </CRow>
        </>
    )
}

export default CourseLessons