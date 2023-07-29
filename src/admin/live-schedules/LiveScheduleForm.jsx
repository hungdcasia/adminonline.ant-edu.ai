import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormGroup,
    CLabel,
    CRow
} from '@coreui/react'
import { useRef, useState } from 'react'
import { useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { ImageInput, SelectInput, TextInput, DateTimeInput, NumberInput } from '../shared';
import { alertActions } from '../../actions';
import { liveScheduleService, uploadService } from '../services';
import moment from 'moment';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Guid } from 'js-guid';

const PlatformDS = [
    { id: 'ZOOM', name: 'ZOOM' },
    { id: 'GOOGLE MEET', name: 'GOOGLE MEET' },
    { id: 'MS TEAMS', name: 'MS TEAMS' },
    { id: 'ZALO', name: 'ZALO' },
]

const getHMS = (timeInSeconds) => {
    let h = Math.floor(timeInSeconds / 3600)
    let m = Math.floor((timeInSeconds - h * 3600) / 60)
    let s = timeInSeconds - h * 3600 - m * 60

    return [h, m, s]
}

const LiveScheduleForm = ({ item, courses, categories, onSuccess, onCancel }) => {
    let [initH, initM, initS] = getHMS(item.duration)

    let [title] = useFormField({ value: item.title, rules: [{ rule: 'required', message: 'Please Input' }] })
    let [presenter] = useFormField({ value: item.presenter, rules: [{ rule: 'required', message: 'Please Input' }] })
    let [summary, setSummary] = useState(item.summary)
    let [description, setDescription] = useState(item.description)
    let [startTime] = useFormField({ value: item.startTime == null ? null : moment(item.startTime, 'x').local().toDate(), rules: [{ rule: 'required', message: 'Please Input' }] })
    let [restrictionCourseId] = useFormField({ value: item.restrictionCourseId, rules: [] })
    let [categoryId] = useFormField({ value: item.categoryId, rules: [{ rule: 'numeric|min:1,num', message: 'Please Select' }] })
    let [thumbnail] = useFormField({ value: item.thumbnail })
    let [platform] = useFormField({ value: item.platform })
    let [maxParticipants] = useFormField({ value: item.maxParticipants })
    let [joinRoomLink] = useFormField({ value: item.joinRoomLink })
    let [facebookEventLink] = useFormField({ value: item.facebookEventLink })
    const [inputList, setInputList] = useState(item.agenda);

    let [form] = useForm([title, startTime, presenter, categoryId,])
    let inputFile = useRef();

    let [hour] = useFormField({ value: initH, rules: [] })
    let [minute] = useFormField({ value: initM, rules: [] })
    let [seconds] = useFormField({ value: initS, rules: [] })

    const onSubmit = e => {

        if (!form.valid()) {
            return;
        }

        var model = {
            id: item.id,
            title: title.value,
            summary: summary,
            description: description,
            startTime: startTime.value == null ? 0 : moment(startTime.value).format('x'),
            presenter: presenter.value,
            duration: hour.value * 3600 + minute.value * 60 + seconds.value,
            categoryId: categoryId.value,
            restrictionCourseId: restrictionCourseId.value,
            thumbnail: thumbnail.value,
            platform: platform.value,
            maxParticipants: maxParticipants.value,
            joinRoomLink: joinRoomLink.value,
            facebookEventLink: facebookEventLink.value,
            agenda: inputList.filter(r => r.content !== null && r.content != '')
        };

        let promise = null;
        if (item.id == 0) {
            promise = liveScheduleService.create(model);
        } else {
            promise = liveScheduleService.update(model);
        }

        promise.then((res) => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                onSuccess(res.data);
            }
        });
    }

    const onChangeImage = () => {
        inputFile.current.click();
    }

    const onSelectedFile = (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (event.target.files && event.target.files.length > 0) {
            var file = event.target.files[0];
            uploadService.uploadImage(file)
                .then(res => {
                    if (res.isSuccess) {
                        thumbnail.value = uploadService.getImageUrl(res.data);
                        thumbnail.refresh?.call()
                    }
                }).finally(() => {
                    event.target.value = '';
                });
        }
    }

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        list[index]['error'] = '';
        setInputList(list);
    };

    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        // if (inputList.length == 10)
        //     return;
        setInputList([...inputList, { content: "" }]);
    };

    return (
        <>
            <CRow alignHorizontal='center'>
                <CCol xs='12'>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <span className="navbar-brand h4">{item.id == 0 ? 'Thêm lịch trực tiếp' : 'Cập nhật lịch trực tiếp'}</span>
                            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            </ul>
                            <div className="form-inline my-2 my-lg-0">
                                <CButton className={'float-right mr-3'}
                                    color="success"
                                    onClick={onSubmit}>
                                    <FontAwesomeIcon icon={allIcon.faSave} /> Lưu
                                </CButton>
                                <CButton className={'float-right mb-0'}
                                    color="info"
                                    onClick={onCancel}>
                                    <FontAwesomeIcon icon={allIcon.faTrashAlt} /> Hủy
                                </CButton>
                            </div>
                        </div>
                    </nav>
                    <CRow>
                        <CCol xs="8" lg="8" >
                            <CCard>
                                <CCardHeader>
                                    <span className='h5'>Thông tin buổi họp</span>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput name='title'
                                        label='Tiêu đề'
                                        required
                                        field={title}
                                    />

                                    <TextInput name='presenter'
                                        label='Giảng viên'
                                        required
                                        field={presenter}
                                    />

                                    <NumberInput
                                        label='Đăng ký tối đa'
                                        name='maxParticipants'
                                        field={maxParticipants}
                                    />

                                    <SelectInput
                                        label='Chủ đề'
                                        name='categoryId'
                                        field={categoryId}
                                        dataSource={categories}
                                    />

                                    <SelectInput
                                        label='Hạn chế học viên'
                                        name='restrictionCourseId'
                                        field={restrictionCourseId}
                                        dataSource={[{ id: 0, name: 'Không hạn chế' }].concat(courses)}
                                    />

                                    <SelectInput
                                        label='Nền tảng'
                                        name='platform'
                                        field={platform}
                                        dataSource={PlatformDS}
                                    />

                                    <CFormGroup>
                                        <CLabel>Mô tả tóm tắt</CLabel>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            config={{
                                                toolbar: [
                                                    'heading',
                                                    '|',
                                                    'bold',
                                                    'italic',
                                                    'bulletedList',
                                                    'numberedList',
                                                    'blockQuote',
                                                ],
                                            }}
                                            data={summary}
                                            onReady={(editor) => { }}
                                            onChange={(event, editor) => {
                                                const data = editor.getData()
                                                setSummary(data)
                                            }}
                                            onBlur={(event, editor) => { }}
                                            onFocus={(event, editor) => { }}
                                        />
                                    </CFormGroup>

                                    <CFormGroup>
                                        <CLabel>Mô tả chi tiết</CLabel>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            config={{
                                                fontSize: {
                                                    options: [
                                                        9,
                                                        11,
                                                        13,
                                                        'default',
                                                        17,
                                                        19,
                                                        21
                                                    ]
                                                },
                                                toolbar: [
                                                    'sourceEditing', '|',
                                                    'heading', '|',
                                                    'fontfamily', 'fontsize', "fontBackgroundColor", "fontColor", '|',
                                                    'bold', 'italic', 'strikethrough', 'underline', 'alignment', '|',
                                                    'bulletedList', 'numberedList', 'todoList', '|',
                                                    'link', '|',
                                                    'outdent', 'indent', '|',
                                                    'htmlEmbed', 'blockQuote', '|',
                                                    'undo', 'redo', '|',
                                                    'highlight',
                                                ]
                                            }}
                                            data={description}
                                            onChange={(event, editor) => {
                                                const data = editor.getData()
                                                setDescription(data)
                                            }}
                                        />
                                    </CFormGroup>

                                    <TextInput name='facebookEventLink'
                                        label='Link event facebook'
                                        field={facebookEventLink}
                                    />

                                    <TextInput name='joinRoomLink'
                                        label='Link vào phòng'
                                        field={joinRoomLink}
                                    />

                                </CCardBody>
                            </CCard>



                        </CCol>
                        <CCol xs="4" lg="4" >
                            <CCard>
                                <CCardHeader className="">
                                    <span className='h5'>Thời gian</span>
                                </CCardHeader>
                                <CCardBody>
                                    <DateTimeInput
                                        label='Thời gian bắt đầu'
                                        name='start'
                                        field={startTime}
                                        required
                                        rawProps={{
                                            format: 'y-MM-dd HH:mm',
                                            disableClock: true,
                                            minDate: new Date()
                                        }}
                                    />

                                    <CLabel>Thời lượng</CLabel>
                                    <div className='row form-inline'>
                                        <div className='col col-3' style={{ width: '80px' }}>
                                            <NumberInput
                                                label=''
                                                name='hour'
                                                rawProps={{ style: { width: '100%' }, min: '0' }}
                                                field={hour}
                                            />
                                        </div>:
                                        <div className='col col-3' style={{ width: '80px' }}>
                                            <NumberInput
                                                label=''
                                                name='minute'
                                                rawProps={{ style: { width: '100%' }, min: '0' }}
                                                field={minute}
                                            />
                                        </div>:
                                        <div className='col col-3' style={{ width: '80px' }}>
                                            <NumberInput
                                                label=''
                                                name='seconds'
                                                rawProps={{ style: { width: '100%' }, min: '0' }}
                                                field={seconds}
                                            />
                                        </div>
                                    </div>
                                </CCardBody>
                            </CCard>

                            <CCard>
                                <CCardHeader className="">
                                    <span className='h5'>Thời lượng chương trình</span>
                                </CCardHeader>
                                <CCardBody>
                                    <CFormGroup>
                                        <CRow >
                                            {inputList.map((item, index) => {
                                                return (
                                                    <CCol xs='12' lg='12' className='form-inline mb-1' key={index}>
                                                        <button className=" btn mr-3"
                                                            onClick={() => handleRemoveClick(index)}>
                                                            <FontAwesomeIcon icon={allIcon.faMinusCircle} className='text-danger' style={{ fontSize: '18x' }} />
                                                        </button>
                                                        <CFormGroup>
                                                            <input className={`form-control`}
                                                                type='text'
                                                                name="content"
                                                                value={item.content}
                                                                style={{ minWidth: '350px' }}
                                                                onChange={e => handleInputChange(e, index)}
                                                            />
                                                        </CFormGroup>
                                                    </CCol>
                                                );
                                            })}
                                        </CRow>
                                        {inputList.length < 10 &&
                                            < CRow >
                                                <CCol xs='12' lg='12' className='form-inline'>
                                                    <button onClick={handleAddClick} className='btn'>
                                                        <FontAwesomeIcon icon={allIcon.faPlusCircle} className='text-success' style={{ fontSize: '18x' }} />
                                                    </button>
                                                </CCol>
                                            </CRow>
                                        }
                                    </CFormGroup>
                                </CCardBody>
                            </CCard>

                            <CCard>
                                <CCardHeader className="">
                                    <span className='h5'>Thumbnail</span>
                                    <div className="float-right">
                                        <input type='file' id='file' ref={inputFile}
                                            onChange={onSelectedFile}
                                            accept="image/png, image/jpeg, image/svg, image/jpg"
                                            style={{ display: 'none' }} />
                                        <CButton type='link' onClick={onChangeImage} >Tải lên</CButton>
                                    </div>
                                </CCardHeader>
                                <CCardBody>
                                    <ImageInput name='thumbnail'
                                        label=''
                                        rawProps={{ style: { width: '100%' } }}
                                        field={thumbnail}
                                    />
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>
        </>
    );
}

export { LiveScheduleForm }