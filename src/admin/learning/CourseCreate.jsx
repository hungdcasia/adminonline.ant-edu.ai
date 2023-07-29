import CIcon from '@coreui/icons-react'
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
    CValidFeedback,
} from '@coreui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { courseService, categoryService, uploadService, donateAccountService, userService } from '../services'
import {
    history,
    string_to_slug,
    UrlHelpers,
    useForm,
    useFormField,
} from '../../helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons'
import {
    CheckboxInput,
    ImageInput,
    NumberInput,
    PageToolBar,
    SelectInput,
    TextAreaInput,
    TextInput,
} from '../shared'
import { alertActions, modalActions } from '../../actions'
import { Link } from 'react-router-dom'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import { useQuery } from 'react-query'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CourseCreate = (props) => {
    let [categories, setCategories] = useState([])
    let [course, setCourse] = useState({})
    let [name] = useFormField({
        value: '',
        rules: [{ rule: 'required', message: 'Please Input' }],
    })

    let [code] = useFormField({
        value: '',
        rules: [],
    })

    let [description, setDescription] = useState('')
    let [slug] = useFormField({
        value: '',
        rules: [{ rule: 'required', message: 'Please Input' }],
    })
    let [active] = useFormField({ value: true })
    let [thumb] = useFormField({ value: '' })
    let [introVideo] = useFormField({ value: '' })
    let [price] = useFormField({ value: 0 })
    let [originPrice] = useFormField({ value: 0 })
    let [featured] = useFormField({ value: false })
    let [categoryId] = useFormField({
        value: 0,
        rules: [{ rule: 'numeric|min:1,num', message: 'Please Select' }],
    })
    let [donateAccountId] = useFormField({ value: 0, rules: [] })
    let [manager] = useFormField({ value: 0, rules: [] })
    let [authorName] = useFormField({ value: '', rules: [] })
    let [form] = useForm([
        name,
        slug,
        active,
        thumb,
        introVideo,
        price,
        originPrice,
        featured,
        categoryId,
        donateAccountId,
        manager,
        authorName
    ])

    let [medalActive, setMedalActive] = useState(false)
    let [medal1Point] = useFormField({
        value: '', rules: [{ rule: 'required', message: 'Please Input' },
        { rule: 'numeric|min:1,num|max:1000000,num', message: 'Value not valid' }]
    })

    let [medal2Point] = useFormField({
        value: '', rules: [{ rule: 'required', message: 'Please Input' },
        { rule: 'numeric|min:1,num|max:1000000,num', message: 'Value not valid' }]
    })

    let [medal3Point] = useFormField({
        value: '', rules: [{ rule: 'required', message: 'Please Input' },
        { rule: 'numeric|min:1,num|max:1000000,num', message: 'Value not valid' }]
    })

    let [medalValidator] = useForm([medal1Point, medal2Point, medal3Point])

    let inputFile = useRef()

    const getCategories = () => {
        categoryService.getCategories().then((res) => {
            if (res.isSuccess) {
                res.data.forEach((item) => {
                    item.isGroup = item.level == 0
                })
                setCategories(res.data)
            }
        })
    }

    const { data: donateAccountsResult, isFetching } = useQuery(['donate-accounts'], () => { return donateAccountService.getAll() }, { staleTime: 600000 })
    let donateAccounts = donateAccountsResult?.data ?? []

    const { data: usersResult } = useQuery(['admin-users'], () => { return userService.getListAdmin() })
    let authors = (usersResult?.data ?? []).filter(r => r.roleCode == "TEACHER").map(r => { return { id: r.user.id, name: r.user.userName } })

    useEffect(() => {
        getCategories()
    }, [])

    const onNameChange = () => {
        slug.value = string_to_slug(name.value)
        slug.refresh?.call()
    }
    const onSubmitClicked = () => {
        if (form.valid()) {

            let medals = null;
            if (medalActive) {
                if (!medalValidator.valid()) return
                medals = [
                    { type: 'first', point: medal1Point.value },
                    { type: 'second', point: medal2Point.value },
                    { type: 'third', point: medal3Point.value },
                ]
            }

            let model = {
                id: 0,
                name: name.value,
                description: description,
                code: code.value,
                slug: slug.value,
                active: active.value,
                thumbnailImage: thumb.value,
                introVideo: introVideo.value,
                price: price.value,
                originPrice: originPrice.value,
                featured: featured.value,
                categoryId: categoryId.value,
                contents: course.getWillLearns().concat(course.getRequirements()),
                medals: medals,
                donateAccountId: donateAccountId.value,
                manager: manager.value,
                authorName: authorName.value
            }
            courseService.create(model).then((res) => {
                if (res.isSuccess) {
                    history.push('/admin/courses/' + res.data.id)
                }
            })
        }
    }

    const onChangeImage = () => {
        inputFile.current.click()
    }

    const onSelectThumFile = (event) => {
        event.stopPropagation()
        event.preventDefault()
        if (event.target.files && event.target.files.length > 0) {
            var file = event.target.files[0]
            uploadService
                .uploadImage(file)
                .then((res) => {
                    if (res.isSuccess) {
                        thumb.value = uploadService.getImageUrl(res.data)
                        thumb.refresh?.call()
                    }
                })
                .finally(() => {
                    event.target.value = ''
                })
        }
    }

    return (
        <>
            <CRow alignHorizontal="center">
                <CCol xs="12" lg="12">
                    <CRow>
                        <CCol xs="12" lg="12" className="h-100">
                            <PageToolBar>
                                <CButton
                                    className={'float-right mr-3'}
                                    color="success"
                                    onClick={onSubmitClicked}
                                >
                                    <FontAwesomeIcon icon={allIcon.faSave} /> Lưu
                                </CButton>
                            </PageToolBar>

                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="8">
                            <CCard>
                                <CCardHeader>
                                    <span className="h5">Thông tin cơ bản</span>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput
                                        name="name"
                                        label="Tên"
                                        required
                                        onBlur={onNameChange}
                                        field={name}
                                        rawProps={{}}
                                    />

                                    <TextInput
                                        name="code"
                                        label="Mã Khóa học"
                                        field={code}
                                        rawProps={{}}
                                    />

                                    <CFormGroup>
                                        <CLabel>Mô tả</CLabel>
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
                                            data={description}
                                            onReady={(editor) => { }}
                                            onChange={(event, editor) => {
                                                const data = editor.getData()
                                                setDescription(data)
                                            }}
                                            onBlur={(event, editor) => { }}
                                            onFocus={(event, editor) => { }}
                                        />
                                    </CFormGroup>
                                    <SelectInput name='donateAccounts'
                                        label='TK Ủng Hộ'
                                        field={donateAccountId}
                                        dataSource={donateAccounts}
                                    />

                                    <TextInput
                                        name="authorName"
                                        label="Tên giảng viên"
                                        field={authorName}
                                        rawProps={{}}
                                    />

                                    <SelectInput name='manager'
                                        label='Quản trị nội dung'
                                        field={manager}
                                        dataSource={authors}
                                    />
                                </CCardBody>
                            </CCard>

                            <CCard>
                                <CCardHeader className="container-fluid">
                                    <span className='h5'>Huy chương</span>
                                    <div className="float-right">
                                        <input type="checkbox"
                                            className="custom-control"
                                            name='medalActive'
                                            id='medalActive'
                                            checked={medalActive}
                                            onChange={(e) => setMedalActive(e.target.checked)} />
                                    </div>
                                </CCardHeader>
                                <CCardBody>
                                    {medalActive &&
                                        <>
                                            <NumberInput field={medal1Point}
                                                name='medal1Point'
                                                label='Huy chương tím'
                                                required />
                                            <NumberInput field={medal2Point}
                                                name='medal2Point'
                                                label='Huy chương vàng'
                                                required />
                                            <NumberInput field={medal3Point}
                                                name='medal3Point'
                                                label='Huy chương bạc'
                                                required />
                                        </>
                                    }
                                </CCardBody>
                            </CCard>

                            <CCard>
                                <CCardHeader className="container-fluid">
                                    <span className="h5">Ảnh đại diện</span>
                                    <div className="float-right">
                                        <input
                                            type="file"
                                            id="file"
                                            ref={inputFile}
                                            onChange={onSelectThumFile}
                                            accept="image/png, image/jpeg, image/svg, image/jpg"
                                            style={{ display: 'none' }}
                                        />
                                        <CButton type="link" onClick={onChangeImage}>
                                            Tải lên
                                        </CButton>
                                    </div>
                                </CCardHeader>
                                <CCardBody>
                                    <ImageInput
                                        name="thumb"
                                        label=""
                                        rawProps={{ style: { width: '100%' } }}
                                        field={thumb}
                                    />
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol xs="4">
                            <CCard>
                                <CCardHeader>
                                    <span className="h5">Trạng thái</span>
                                </CCardHeader>
                                <CCardBody>
                                    <CheckboxInput
                                        name="active"
                                        label="Hiển thị"
                                        rawProps={{}}
                                        required
                                        field={active}
                                    />

                                    <CheckboxInput
                                        name="originPrice"
                                        label="Nổi bật"
                                        rawProps={{}}
                                        required
                                        field={featured}
                                    />
                                </CCardBody>
                            </CCard>
                            <CCard>
                                <CCardHeader>
                                    <span className="h5">Thông tin giá</span>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput
                                        name="price"
                                        label="Giá bán"
                                        rawProps={{}}
                                        field={price}
                                    />

                                    <TextInput
                                        name="originPrice"
                                        label="Giá gốc"
                                        rawProps={{}}
                                        field={originPrice}
                                    />
                                </CCardBody>
                            </CCard>
                            <CCard>
                                {/* <CCardHeader>
                                    <span className='h5'>Nhóm danh mục</span>
                                </CCardHeader> */}
                                <CCardBody>
                                    <SelectInput
                                        name="category"
                                        label="Danh mục"
                                        rawProps={{}}
                                        required
                                        field={categoryId}
                                        dataSource={categories}
                                    />
                                </CCardBody>
                            </CCard>
                            <WillLearn course={course} />
                            <Requirement course={course} />
                            <CCard>
                                <CCardHeader className="container-fluid">
                                    <span className="h5">Video giới thiệu</span>
                                    <div className="float-right">
                                        <CButton
                                            type="link"
                                            onClick={() => window.open(introVideo.value)}
                                        >
                                            Xem
                                        </CButton>
                                    </div>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput
                                        name="introVideo"
                                        label=""
                                        field={introVideo}
                                        rawProps={{}}
                                    />
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>
        </>
    )
}

export const WillLearn = (props) => {
    let { editing, course } = props;

    const [inputList, setInputList] = useState([])

    course.getWillLearns = () => {
        return inputList.filter(r => r.content != '').map(r => { return { type: 'willlearn', content: r.content } });
    }

    useEffect(() => {
        if (course.contents != null)
            setInputList(course.contents.filter(r => r.type == 'willlearn'))
    }, [editing])

    const handleInputChange = (e, index) => {
        const { name, value } = e.target
        const list = [...inputList]
        list[index][name] = value
        list[index]['error'] = ''
        setInputList(list)
    }

    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        const list = [...inputList]
        list.splice(index, 1)
        setInputList(list)
    }

    // handle click event of the Add button
    const handleAddClick = () => {
        if (inputList.length == 5) return
        setInputList([...inputList, { content: '' }])
    }

    return (
        <CCard>
            <CCardHeader className="container-fluid">
                <span className="h5">Bạn sẽ được gì?</span>
                <div className="float-right"></div>
            </CCardHeader>
            <CCardBody>
                <CFormGroup>
                    <CRow>
                        {inputList.map((answer, index) => {
                            return (
                                <Fragment key={index}>
                                    <CCol xs="12" lg="12" className="form-inline mb-1">
                                        <button
                                            disabled={!editing}
                                            className=" btn mr-3"
                                            onClick={() => handleRemoveClick(index)}
                                        >
                                            <FontAwesomeIcon
                                                icon={allIcon.faMinusCircle}
                                                className="text-danger"
                                                style={{ fontSize: '18x' }}
                                            />
                                        </button>
                                        <CFormGroup>
                                            <input
                                                disabled={!editing}
                                                className={`form-control`}
                                                type="text"
                                                name="content"
                                                value={answer.content}
                                                style={{ minWidth: '350px' }}
                                                onChange={(e) => handleInputChange(e, index)}
                                            />
                                        </CFormGroup>
                                    </CCol>
                                </Fragment>
                            )
                        })}
                    </CRow>
                    {inputList.length < 5 && (
                        <CRow>
                            <CCol xs="12" lg="12" className="form-inline">
                                <button onClick={handleAddClick} className="btn" disabled={!editing}>
                                    <FontAwesomeIcon
                                        icon={allIcon.faPlusCircle}
                                        className="text-success"
                                        style={{ fontSize: '18x' }}
                                    />
                                </button>
                            </CCol>
                        </CRow>
                    )}
                </CFormGroup>
            </CCardBody>
        </CCard>
    )
}

export const Requirement = (props) => {
    let { editing, course } = props;

    const [inputList, setInputList] = useState([])

    course.getRequirements = () => {
        return inputList.filter(r => r.content != '').map(r => { return { type: 'requirement', content: r.content } });
    }

    useEffect(() => {
        if (course.contents != null)
            setInputList(course.contents.filter(r => r.type == 'requirement'))
    }, [editing])

    const handleInputChange = (e, index) => {
        const { name, value } = e.target
        const list = [...inputList]
        list[index][name] = value
        list[index]['error'] = ''
        setInputList(list)
    }

    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        const list = [...inputList]
        list.splice(index, 1)
        setInputList(list)
    }

    // handle click event of the Add button
    const handleAddClick = () => {
        if (inputList.length == 5) return
        setInputList([...inputList, { content: '' }])
    }

    return (
        <CCard>
            <CCardHeader className="container-fluid">
                <span className="h5">Yêu cầu?</span>
                <div className="float-right"></div>
            </CCardHeader>
            <CCardBody>
                <CFormGroup>
                    <CRow>
                        {inputList.map((answer, index) => {
                            return (
                                <Fragment key={index}>
                                    <CCol xs="12" lg="12" className="form-inline mb-1">
                                        <button
                                            disabled={!editing}
                                            className=" btn mr-3"
                                            onClick={() => handleRemoveClick(index)}
                                        >
                                            <FontAwesomeIcon
                                                icon={allIcon.faMinusCircle}
                                                className="text-danger"
                                                style={{ fontSize: '18x' }}
                                            />
                                        </button>
                                        <CFormGroup>
                                            <input
                                                disabled={!editing}
                                                className={`form-control`}
                                                type="text"
                                                name="content"
                                                value={answer.content}
                                                style={{ minWidth: '350px' }}
                                                onChange={(e) => handleInputChange(e, index)}
                                            />
                                        </CFormGroup>
                                    </CCol>
                                </Fragment>
                            )
                        })}
                    </CRow>
                    {inputList.length < 5 && (
                        <CRow>
                            <CCol xs="12" lg="12" className="form-inline">
                                <button onClick={handleAddClick} className="btn" disabled={!editing}>
                                    <FontAwesomeIcon
                                        icon={allIcon.faPlusCircle}
                                        className="text-success"
                                        style={{ fontSize: '18x' }}
                                    />
                                </button>
                            </CCol>
                        </CRow>
                    )}
                </CFormGroup>
            </CCardBody>
        </CCard>
    )
}

export default CourseCreate
