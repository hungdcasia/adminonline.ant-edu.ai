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
import { courseService, categoryService, uploadService, donateAccountService, userService } from "../services";
import { history, string_to_slug, UrlHelpers, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, ImageInput, PageToolBar, SelectInput, TextAreaInput, TextInput, NumberInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { Link } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Requirement, WillLearn } from './CourseCreate';
import { useQuery } from 'react-query';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CourseDetail = props => {

    let { id } = props.match.params;
    // let { id } = props;
    let [categories, setCategories] = useState([]);
    let [course, setCourse] = useState();
    let [editing, setEditing] = useState(false);

    let [name] = useFormField({ value: '', rules: [{ rule: 'required', message: 'Please Input' }] })
    // let [description] = useFormField({ value: '' })
    let [description, setDescription] = useState('');
    let [code] = useFormField({
        value: '',
        rules: [],
    })
    let [slug] = useFormField({ value: '', rules: [{ rule: 'required', message: 'Please Input' }] })
    let [active] = useFormField({ value: true })
    let [thumb] = useFormField({ value: '' })
    let [introVideo] = useFormField({ value: '' })
    let [price] = useFormField({ value: 0 })
    let [originPrice] = useFormField({ value: 0 })
    let [featured] = useFormField({ value: false })
    let [categoryId] = useFormField({ value: 0, rules: [{ rule: 'numeric|min:1,num', message: 'Please Select' }] })
    let [donateAccountId] = useFormField({ value: 0, rules: [] })
    let [manager] = useFormField({ value: 0, rules: [] })
    let [authorName] = useFormField({ value: '', rules: [] })
    let [form] = useForm([name, slug, active, thumb, introVideo, price, originPrice, featured, categoryId, donateAccountId])

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

    let inputFile = useRef();

    const getCategories = () => {
        categoryService.getCategories()
            .then((res) => {
                if (res.isSuccess) {
                    res.data.forEach(item => { item.isGroup = item.level == 0 });
                    setCategories(res.data);
                }
            });
    }

    const { data: donateAccountsResult, isFetching } = useQuery(['donate-accounts'], () => { return donateAccountService.getAll() }, { staleTime: 600000 })
    let donateAccounts = donateAccountsResult?.data ?? []

    const { data: usersResult } = useQuery(['admin-users'], () => { return userService.getListAdmin() })
    let authors = (usersResult?.data ?? []).filter(r => r.roleCode == "TEACHER").map(r => { return { id: r.user.id, name: r.user.userName } })

    const getCourse = () => {
        if (id > 0)
            courseService.getDetail(id)
                .then((res) => {
                    if (res.isSuccess) {
                        let data = res.data.course;
                        name.value = data.name
                        code.value = data.code
                        setDescription(data.description)
                        slug.value = data.slug
                        thumb.value = data.thumbnailImage
                        introVideo.value = data.introVideo
                        active.value = data.active
                        categoryId.value = data.categoryId
                        donateAccountId.value = data.donateAccountId
                        manager.value = data.manager
                        authorName.value = data.authorName
                        featured.value = data.featured
                        price.value = data.price
                        originPrice.value = data.originPrice
                        if (data.medals && data.medals.length === 3) {
                            setMedalActive(true)
                            medal1Point.value = data.medals[0].point
                            medal2Point.value = data.medals[1].point
                            medal3Point.value = data.medals[2].point
                        }

                        setCourse(res.data.course);
                    }
                });
    };

    useEffect(() => {
        getCategories();
        getCourse();
    }, []);

    const onNameChange = () => {
        slug.value = string_to_slug(name.value);
        slug.refresh?.call();
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
                id: id,
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
                donateAccountId: donateAccountId.value,
                contents: course.getWillLearns().concat(course.getRequirements()),
                medals: medals,
                manager: manager.value,
                authorName: authorName.value
            };
            courseService.update(model)
                .then(res => {
                    if (res.isSuccess) {
                        setCourse(res.data);
                        setEditing(false);
                    }
                });
        }
    }

    const onCancelClicked = () => {
        let data = course;
        name.value = data.name
        code.value = data.code
        setDescription(data.description)
        slug.value = data.slug
        thumb.value = data.thumbnailImage
        introVideo.value = data.introVideo
        active.value = data.active
        categoryId.value = data.categoryId
        donateAccountId.value = data.donateAccountId
        manager.value = data.manager
        authorName.value = data.authorName
        featured.value = data.featured
        price.value = data.price
        originPrice.value = data.originPrice

        if (data.medals && data.medals.length === 3) {
            setMedalActive(true)
            medal1Point.value = data.medals[0].point
            medal2Point.value = data.medals[1].point
            medal3Point.value = data.medals[2].point
        } else {
            setMedalActive(false)
        }

        setEditing(false);
        form.fields.forEach(item => item.refresh?.call());
    }

    const onChangeImage = () => {
        inputFile.current.click();
    }

    const onSelectThumFile = (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (event.target.files && event.target.files.length > 0) {
            var file = event.target.files[0];
            uploadService.uploadImage(file)
                .then(res => {
                    if (res.isSuccess) {
                        thumb.value = uploadService.getImageUrl(res.data);
                        thumb.refresh?.call()
                    }
                }).finally(() => {
                    event.target.value = '';
                });
        }
    }

    if (course == null) {
        return (<></>);
    }
    return (
        <>
            <CRow alignHorizontal='center'>
                <CCol xs='12' lg="12">
                    <CRow>
                        <CCol xs="12" lg="12" className='h-100'>
                            <PageToolBar hideBackButton>
                                {editing ?
                                    <>
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
                                    </> :
                                    < CButton className={'float-right mr-3'}
                                        color="success"
                                        onClick={() => setEditing(true)}>
                                        <FontAwesomeIcon icon={allIcon.faPencilAlt} /> Sửa
                                    </CButton>
                                }
                            </PageToolBar>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs='8' >
                            <CCard>
                                <CCardHeader>
                                    <span className='h5'>Thông tin cơ bản</span>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput name='name'
                                        label='Tên'
                                        required
                                        onBlur={onNameChange}
                                        field={name}
                                        rawProps={{ disabled: !editing }}
                                    />
                                    <TextInput
                                        name="code"
                                        label="Mã Khóa học"
                                        field={code}
                                        rawProps={{ disabled: !editing }}
                                    />
                                    <CFormGroup>
                                        <CLabel >Mô tả</CLabel>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            config={{
                                                toolbar: ['heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote']
                                            }}
                                            data={description}
                                            onReady={editor => {
                                            }}
                                            disabled={!editing}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                setDescription(data)
                                            }}
                                            onBlur={(event, editor) => {
                                            }}
                                            onFocus={(event, editor) => {
                                            }}
                                        />

                                    </CFormGroup>
                                    <SelectInput name='donateAccounts'
                                        label='TK Ủng Hộ'
                                        rawProps={{ disabled: !editing }}
                                        field={donateAccountId}
                                        dataSource={donateAccounts}
                                    />

                                    <TextInput
                                        name="authorName"
                                        label="Tên giảng viên"
                                        field={authorName}
                                        rawProps={{ disabled: !editing }}
                                    />

                                    <SelectInput name='manager'
                                        label='Quản trị nội dung'
                                        rawProps={{ disabled: !editing }}
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
                                            disabled={!editing}
                                            onChange={(e) => setMedalActive(e.target.checked)} />
                                    </div>
                                </CCardHeader>
                                <CCardBody>
                                    {medalActive &&
                                        <>
                                            <NumberInput field={medal1Point}
                                                name='medal1Point'
                                                label='Huy chương tím'
                                                rawProps={{ disabled: !editing }}
                                                required />
                                            <NumberInput field={medal2Point}
                                                name='medal2Point'
                                                label='Huy chương vàng'
                                                rawProps={{ disabled: !editing }}
                                                required />
                                            <NumberInput field={medal3Point}
                                                name='medal3Point'
                                                label='Huy chương bạc'
                                                rawProps={{ disabled: !editing }}
                                                required />
                                        </>
                                    }
                                </CCardBody>
                            </CCard>

                            <CCard>
                                <CCardHeader className="container-fluid">
                                    <span className='h5'>Ảnh đại diện</span>
                                    <div className="float-right">
                                        <input type='file' id='file' ref={inputFile}
                                            onChange={onSelectThumFile}
                                            accept="image/png, image/jpeg, image/svg, image/jpg"
                                            style={{ display: 'none' }} />
                                        <CButton type='link' onClick={onChangeImage} disabled={!editing}>Tải lên</CButton>
                                        {/* <CDropdown className="mt-2">
                                            <CDropdownToggle caret color="info">
                                                Dropdown button
                                            </CDropdownToggle>
                                            <CDropdownMenu>
                                                <CDropdownItem header>Header</CDropdownItem>
                                                <CDropdownItem disabled>Action Disabled</CDropdownItem>
                                            </CDropdownMenu>
                                        </CDropdown> */}
                                    </div>
                                </CCardHeader>
                                <CCardBody>
                                    <ImageInput name='thumb'
                                        label=''
                                        rawProps={{ disabled: !editing, style: { width: '100%' } }}
                                        field={thumb}
                                    />


                                </CCardBody>
                            </CCard>

                        </CCol>
                        <CCol xs='4' >

                            <CCard>
                                <CCardHeader>
                                    <span className='h5'>Trạng thái</span>
                                </CCardHeader>
                                <CCardBody>
                                    <CheckboxInput name='active'
                                        label='Hiển thị'
                                        rawProps={{ disabled: !editing }}
                                        required
                                        field={active}
                                    />

                                    <CheckboxInput name='originPrice'
                                        label='Nổi bật'
                                        rawProps={{ disabled: !editing }}
                                        required
                                        field={featured}
                                    />
                                </CCardBody>
                            </CCard>
                            <CCard>
                                <CCardHeader>
                                    <span className='h5'>Thông tin giá</span>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput name='price'
                                        label='Giá bán'
                                        rawProps={{ disabled: !editing }}
                                        field={price}
                                    />

                                    <TextInput name='originPrice'
                                        label='Giá gốc'
                                        rawProps={{ disabled: !editing }}
                                        field={originPrice}
                                    />
                                </CCardBody>
                            </CCard>
                            <CCard>
                                {/* <CCardHeader>
                                    <span className='h5'>Nhóm danh mục</span>
                                </CCardHeader> */}
                                <CCardBody>
                                    <SelectInput name='category'
                                        label='Danh mục'
                                        rawProps={{ disabled: !editing }}
                                        required
                                        field={categoryId}
                                        dataSource={categories}
                                    />
                                </CCardBody>
                            </CCard>
                            <WillLearn editing={editing} course={course} />
                            <Requirement editing={editing} course={course} />
                            <CCard>
                                <CCardHeader className="container-fluid">
                                    <span className='h5'>Video giới thiệu</span>
                                    <div className="float-right">
                                        <CButton type='link' onClick={() => window.open(introVideo.value)}>Xem</CButton>
                                    </div>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput name='introVideo'
                                        label=''
                                        field={introVideo}
                                        rawProps={{ disabled: !editing }}
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


export default CourseDetail