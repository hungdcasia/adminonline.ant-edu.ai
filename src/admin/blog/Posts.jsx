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
import { string_to_slug, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, ImageInput, SelectInput, TextInput, PasswordInput, FilterComponent, MyUploadAdapter } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { uploadService, postService } from '../services';
import Moment from 'react-moment';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Avatar } from '../../shared';
import moment from 'moment';
import { exportHelpers } from '../helpers';
import { blogCategoryService } from '../services/blog-category.service';
import { useQuery } from 'react-query';
import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AgeList = [
    { code: '0-18th', name: '0 - 18 tháng' },
    { code: '18th-3', name: '18 tháng - 3 tuổi' },
    { code: '3-6', name: '3 - 6 tuổi' },
    { code: '6-9', name: '6 - 9 tuổi' },
    { code: '9-12', name: '9 - 12 tuổi' },
    { code: '12-16', name: '12 - 16 tuổi' },
    { code: '16+', name: 'Trên 16 tuổi' },
]

const createModel = () => {
    return {
        id: 0,
        title: '',
        description: '',
        content: '',
        author: '',
        categoryId: 0,
        keywords: '',
        slug: '',
        thumbnail: '',
        active: true,
        featured: false,
        hot: false,
    }
}

const Posts = props => {
    let [groups, setGroups] = useState([]);
    let [editing, setEditing] = useState();
    let [posts, setPosts] = useState([]);

    let [paging, setPaging] = useState({
        page: 1,
        pageSize: 20,
        total: 0
    })

    const getGroups = () => {
        blogCategoryService.getCategories()
            .then((res) => {
                if (res.isSuccess) {
                    setGroups(res.data);
                    reloadData()
                }
            });
    };

    let [filters, setFilters] = useState([]);

    let [sort, setSort] = useState({
        sort: 'modifiedTime', direction: 'desc'
    })

    const reloadData = () => {
        handleTableChange('sort', {
            page: paging.page,
            sizePerPage: paging.pageSize,
            sortField: sort.sort,
            sortOrder: sort.direction
        })
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
            text: 'Tên hiển thị',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => (
                <span><Avatar url={row.avatar} className='rounded-circle w-30px h-30px' /> {cellContent}</span>
            )
        },
        {
            dataField: 'description',
            text: 'Mô tả',
            sort: false,
            canFilter: false,
            type: 'string',
            style: { maxWidth: '200px' }
        },
        {
            dataField: 'active',
            text: 'Hiển thị',
            canFilter: true,
            type: 'bool',
            formatter: (cellContent, row) => (
                <CBadge color={cellContent ? 'success' : 'secondary'}>
                    {cellContent ? "Hiện" : "ẩn"}
                </CBadge>
            )
        },
        {
            dataField: 'modifiedTime',
            text: 'Sửa lần cuối',
            sort: true,
            type: 'date',
            canFilter: true,
            formatter: (cellContent, row) => (
                <Moment date={cellContent} format="DD/MM/YYYY HH:mm:ss" />
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
                        className='mx-1'
                        title='cập nhật thông tin'
                        onClick={() => setEditing(item)}
                    >
                        <FontAwesomeIcon icon={allIcon.faPencilAlt} />
                    </CButton>

                    <CButton
                        className='mx-1'
                        color="light"
                        size="sm"
                        onClick={() => { deleteClicked(item) }}
                        title="xóa tài khoản"
                    >
                        <FontAwesomeIcon icon={allIcon.faTrash} />
                    </CButton>
                </div>
            )
        },
        {
            dataField: 'categoryId',
            text: 'Danh mục',
            type: 'number',
            canFilter: true,
            hidden: true,
            operators: ['=='],
            customInput: (value, onChange) => {
                return (
                    <select className="custom-select mr-2" value={value} onChange={(e) => onChange(e.target.value)}>
                        {groups.map(r => (
                            <option value={r.id}>{r.name}</option>
                        ))}
                    </select>
                )
            }
        },
        {
            dataField: 'featured',
            text: 'Nổi bật',
            type: 'bool',
            canFilter: true,
            hidden: true
        },
        {
            dataField: 'hot',
            text: 'Hot',
            type: 'bool',
            canFilter: true,
            hidden: true
        },
    ]

    useEffect(() => {
        getGroups()

        let pagingOptions = {
            page: paging.page,
            pageSize: paging.pageSize,
            total: 0
        }

        setPaging(pagingOptions)
    }, [])

    useEffect(() => {
        reloadData();
    }, [filters])

    const handleTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {

        let pagingOptions = {
            page: page == 0 ? 1 : page,
            pageSize: sizePerPage
        }

        let filterOptions = [].concat(filters)
        let sortOptions = { sort: sortField, direction: sortOrder }
        setSort(sortOptions)

        if (type == 'pagination') {
        } else if (type = 'sort') {
            pagingOptions.page = 1
        }

        postService.filter(pagingOptions, filterOptions, sortOptions)
            .then(res => {
                if (res.isSuccess) {
                    let data = res.data
                    setPaging({
                        page: data.page,
                        pageSize: data.pageSize,
                        total: data.total
                    })
                    setPosts(res.data.items)
                }
            })
    }

    const onFilter = (items) => {
        setFilters(items);
    }

    const onCreateClick = () => {
        setEditing(createModel())
    }

    const deleteItem = (item) => {
        postService.remove(item.id).then(res => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                reloadData();
            }
        });
    }

    const deleteClicked = item => {
        modalActions.show({
            title: `Bạn chắc chắn muốn xóa bài viết này?`,
            ok: 'Chắc chắn',
            cancel: "Không",
            onCancel: () => {

            },
            onOk: () => {
                deleteItem(item);
            }
        });
    }

    return (
        <>
            <CRow className={editing ? 'd-none' : ''}>
                <CCol sm='12'>
                    <FilterComponent onFilter={onFilter} filterConfigs={columns.filter(r => r.canFilter)} />
                </CCol>
                <CCol xs="12" lg="12" className='h-100'>
                    <CCard>
                        <CCardHeader>
                            <span className='h3'>Danh sách bài viết</span>
                            <div className="card-header-actions">
                                <CButton
                                    onClick={onCreateClick}
                                    title='Create'>
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
                                        data={posts}
                                        columns={columns}
                                        onTableChange={handleTableChange}
                                        pagination={paginationFactory({
                                            page: paging.page,
                                            sizePerPage: paging.pageSize,
                                            totalSize: paging.total,
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

            {editing &&
                <PostForm onCancel={() => { setEditing(false) }} post={editing} onSuccess={() => { setEditing(false); reloadData(); }} />
            }
        </>
    )
}

const PostForm = ({ post, onCancel, onSuccess }) => {
    let inputFile = useRef()

    const { data: categoriesResult } = useQuery("blog-categories", () => blogCategoryService.getCategories());
    const categories = categoriesResult?.data ?? []

    let [title] = useFormField({ value: post?.title, rules: [{ rule: 'required', message: 'Please Input' }] })
    let [content, setContent] = useState(post.content)
    let [description] = useFormField({ value: post?.description ?? '' })
    let [thumbnail] = useFormField({ value: post.thumbnail ?? '' })
    let [author] = useFormField({ value: post.author })
    let [slug] = useFormField({ value: post?.slug ?? '', rules: [] })
    let [categoryId] = useFormField({ value: post?.categoryId, rules: [] })
    let [keywords] = useFormField({ value: post?.keywords, rules: [] })
    let [active] = useFormField({ value: post.active })
    let [featured] = useFormField({ value: post.featured })
    let [age] = useFormField({ value: post.age })
    let [hot] = useFormField({ value: post.hot })
    let [form] = useForm([title, description, active, categoryId])

    useEffect(() => {
        if (post.id > 0)
            postService.detail(post.id).then(res => {
                if (res.isSuccess)
                    setContent(res.data.content)
            })
    }, [])

    const onSubmit = () => {
        if (!form.valid()) {
            return
        }

        let model = {
            id: post.id,
            title: title.value,
            description: description.value,
            thumbnail: thumbnail.value,
            author: author.value,
            slug: slug.value,
            categoryId: categoryId.value,
            active: active.value,
            age: age.value,
            featured: featured.value,
            hot: hot.value,
            content: content,
            keywords: keywords.value
        }
        let promise = model.id == 0 ? postService.create(model) : postService.update(model);
        promise.then(res => {
            if (res.isSuccess) {
                alertActions.successUpdate('')
                onSuccess();
            } else {
                if (res.errors && res.errors.length > 0 && res.errors[0].message)
                    alertActions.error(res.errors[0].message)
            }
        });
    }

    const onNameChange = () => {
        slug.value = string_to_slug(title.value);
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
                        thumbnail.value = uploadService.getImageUrl(res.data)
                        thumbnail.refresh?.call()
                    }
                })
                .finally(() => {
                    event.target.value = ''
                })
        }
    }

    return (
        <>
            <CRow alignHorizontal='center'>
                <CCol xs='12'>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <span className="navbar-brand h4">{post.id == 0 ? 'Thêm' : 'Sửa'} bài viết</span>
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
                                    onClick={() => onCancel?.call()}>
                                    <FontAwesomeIcon icon={allIcon.faTrashAlt} /> Hủy
                                </CButton>
                            </div>
                        </div>
                    </nav>
                    <CRow>
                        <CCol xs="8" lg="8" >
                            <CCard>
                                <CCardHeader>
                                    <span className='h5'>Thông tin cơ bản</span>
                                </CCardHeader>
                                <CCardBody>
                                    <TextInput name='title'
                                        label='Tiêu đề'
                                        required
                                        onBlur={onNameChange}
                                        field={title}
                                    />
                                    <TextInput name='description'
                                        label='Mô tả'
                                        field={description}
                                    />
                                    {/* <TextInput name='slug'
                                        label='slug'
                                        required
                                        field={slug}
                                    /> */}
                                    <TextInput name='author'
                                        label='Tác giả'
                                        field={author}
                                    />

                                    <TextInput name='keywords'
                                        label='Từ khóa'
                                        field={keywords}
                                    />
                                    <CFormGroup className=''>
                                        <CLabel>Nội dung</CLabel>
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
                                                image: {
                                                    toolbar: [
                                                        'imageStyle:alignLeft',
                                                        'imageStyle:alignCenter',
                                                        'imageStyle:alignRight',
                                                        '|',
                                                        'resizeImage',
                                                    ],

                                                    // The default value.
                                                    styles: [
                                                        'full',
                                                        'side',
                                                        'alignLeft', 'alignCenter', 'alignRight', 'resizeImage', 'uploadImage'
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
                                                    'insertTable', '|',
                                                    'htmlEmbed', 'blockQuote', '|',
                                                    'imageInsert', 'uploadImage', 'resizeImage', 'mediaEmbed', '|',
                                                    'undo', 'redo', '|',
                                                    'highlight',
                                                ]
                                            }}
                                            onReady={editor => {
                                                editor.plugins.get("FileRepository").createUploadAdapter = function (loader) {
                                                    return new MyUploadAdapter(loader);
                                                };
                                                editor.editing.view.change((writer) => {
                                                    writer.setStyle(
                                                        "height",
                                                        "500px",
                                                        editor.editing.view.document.getRoot()
                                                    );
                                                });
                                            }}
                                            data={content}
                                            onChange={(event, editor) => {
                                                const data = editor.getData()
                                                setContent(data)
                                            }}
                                            onBlur={(event, editor) => { }}
                                            onFocus={(event, editor) => { }}
                                            style={{ height: '500px' }}
                                        />
                                    </CFormGroup>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol xs='4' lg='4'>

                            <CCard>
                                <CCardHeader>
                                    <span className="h5">Danh mục và độ tuổi</span>
                                </CCardHeader>
                                <CCardBody>
                                    <SelectInput
                                        name="category"
                                        label="Danh mục"
                                        rawProps={{}}
                                        field={categoryId}
                                        dataSource={categories}
                                        required
                                    />

                                    <SelectInput
                                        name="age"
                                        label="Độ tuổi"
                                        rawProps={{}}
                                        field={age}
                                        dataSource={AgeList.map(r => { return { id: r.code, name: r.name } })}
                                    />
                                </CCardBody>
                            </CCard>

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
                                        name="featured"
                                        label="Nổi bật"
                                        rawProps={{}}
                                        required
                                        field={featured}
                                    />

                                    <CheckboxInput
                                        name="hot"
                                        label="Hot"
                                        rawProps={{}}
                                        required
                                        field={hot}
                                    />
                                </CCardBody>
                            </CCard>
                            <CCard>
                                <CCardHeader className="">
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
                                            Thay đổi
                                        </CButton>
                                    </div>
                                </CCardHeader>
                                <CCardBody>
                                    <ImageInput
                                        name="thumb"
                                        label=""
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
    )
}

export default Posts