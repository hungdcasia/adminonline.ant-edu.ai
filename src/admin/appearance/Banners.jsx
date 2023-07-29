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
import { getStringOrDefault, string_to_slug, string_truncate } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { alertActions, modalActions } from '../../actions';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { bannerService } from '../services/banner.service';
import { Controller, useForm } from 'react-hook-form';
import { uploadService } from '../services';
import { ChromePicker, SketchPicker } from 'react-color';
import rgbHex from "rgb-hex";
import hexRgb from 'hex-rgb';
import { HomeBannerItem } from '../../home/HomeBanner';
import { NavigationBar } from '../../navigation-bar';

const { SearchBar, ClearSearchButton } = Search;

const createModel = (item) => {
    return {
        id: item?.id ?? 0,
        title: getStringOrDefault(item?.title, ''),
        description: getStringOrDefault(item?.description, ''),
        titleColor: getStringOrDefault(item?.titleColor, '#FFFFFF'),
        descriptionColor: getStringOrDefault(item?.descriptionColor, '#FFFFFF'),
        buttonTitle: item?.buttonTitle ?? '',
        buttonTitleColor: getStringOrDefault(item?.buttonTitleColor, '#FFFFFF'),
        buttonColor: getStringOrDefault(item?.buttonColor, '#5885e7'),
        image: item?.image ?? '',
        overlayColor: getStringOrDefault(item?.overlayColor, '#00000000'),
        link: item?.link ?? '',
        displayOrder: item?.displayOrder ?? 100,
        active: item?.active ?? true
    }
}

const getBadge = status => {
    switch (status) {
        case true: return 'success'
        case false: return 'secondary'
        default: return 'primary'
    }
}

const Banners = props => {
    let [groups, setGroups] = useState([]);
    let [editing, setEditing] = useState();

    const getGroups = () => {
        bannerService.getAll()
            .then((res) => {
                if (res.isSuccess) {
                    setGroups(res.data);
                }
            });
    };

    const onCreateClick = () => {
        setEditing(createModel());
    }

    useEffect(() => {
        getGroups();
    }, []);

    const editClicked = item => {
        setEditing(createModel(item))
    }

    const deleteItem = (item) => {
        bannerService.remove(item.id).then(res => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                getGroups();
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
            dataField: 'image',
            text: 'Image',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => {
                return (
                    <div style={{ width: "150px" }} className=''><img src={cellContent} className="d-block w-100" style={{ objectFit: 'cover' }} /></div>
                )
            }
        },
        {
            dataField: 'title',
            text: 'Tiêu đề',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => cellContent
        },
        {
            dataField: 'description',
            text: 'Slogan',
            sort: true,
            canFilter: true,
            type: 'string',
            formatter: (cellContent, row) => string_truncate(cellContent, 50, false)
        },
        {
            dataField: 'buttonTitle',
            text: 'Tiêu đề nút',
            sort: true,
            canFilter: true,
            type: 'string',
        },
        {
            dataField: 'link',
            text: 'link',
            sort: true,
            canFilter: true,
            type: 'string',
        },
        {
            dataField: 'displayOrder',
            text: 'Sắp xếp',
            canFilter: true,
            type: 'number',
        },
        {
            dataField: 'active',
            text: 'Trạng thái',
            canFilter: true,
            type: 'bool',
            formatter: (cellContent, row) => (
                <CBadge color={getBadge(cellContent)}>
                    {cellContent ? "Hiện" : "ẩn"}
                </CBadge>
            )
        },
        {
            dataField: 'action',
            text: '',
            style: {
                width: '10%',
            },
            formatter: (cellContent, item) => (
                <div className="d-flex justify-content-center">
                    <CButton className='mx-1'
                        color="light"
                        size="sm"
                        onClick={() => { editClicked(item) }}
                    >
                        <FontAwesomeIcon icon={allIcon.faPencilAlt} />
                    </CButton>
                    <CButton
                        className='mx-1'
                        color="light"
                        size="sm"
                        onClick={() => { deleteClicked(item) }}
                    >
                        <FontAwesomeIcon icon={allIcon.faTrashAlt} />
                    </CButton>
                </div>
            )
        }
    ]

    return (
        <>
            <CRow className={editing ? 'd-none' : ''}>
                <CCol xs="12" lg="12" className='h-100'>
                    <CCard>
                        <CCardHeader>
                            <span className='h3'>Quản lý banners</span>
                            <div className="card-header-actions">
                                <CButton className={'float-right mb-0'}
                                    onClick={onCreateClick}
                                    title='Create'>
                                    <FontAwesomeIcon icon={allIcon.faPlus} /> Thêm
                                </CButton>
                            </div>
                        </CCardHeader>
                        <CCardBody>

                            <ToolkitProvider
                                keyField="id"
                                data={groups}
                                columns={columns}
                                search={{ searchFormatted: true }}
                            >
                                {
                                    props => (
                                        <div>
                                            <SearchBar {...props.searchProps} placeholder='Nhập để tìm kiếm' />
                                            {/* <hr /> */}
                                            <BootstrapTable striped
                                                hover
                                                {...props.baseProps}
                                                pagination={paginationFactory({
                                                    // page: paging.page,
                                                    sizePerPage: 20,
                                                    // totalSize: paging.total,
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
                                        </div>
                                    )
                                }
                            </ToolkitProvider>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            {editing &&
                <EditForm onCancel={() => { setEditing(false) }} item={editing} onSuccess={() => { getGroups(); setEditing(false); }} />
            }
        </>
    )
}

const EditForm = ({ item, onSuccess, onCancel }) => {
    const { register, handleSubmit, formState: { errors }, control, getValues } = useForm({
        defaultValues: {
            title: item.title,
            description: item.description,
            titleColor: item.titleColor,
            descriptionColor: item.descriptionColor,
            buttonTitle: item.buttonTitle,
            buttonTitleColor: item.buttonTitleColor,
            buttonColor: item.buttonColor,
            image: item.image,
            overlayColor: item.overlayColor,
            link: item.link,
            displayOrder: item.displayOrder,
            active: item.active
        }
    });

    const onSubmit = e => {
        var model = {
            id: item.id,
            title: e.title,
            description: e.description,
            titleColor: e.titleColor,
            descriptionColor: e.descriptionColor,
            buttonTitle: e.buttonTitle,
            buttonTitleColor: e.buttonTitleColor,
            buttonColor: e.buttonColor ?? "#5885e7",
            image: image,
            overlayColor: item.overlayColor,
            link: e.link,
            displayOrder: e.displayOrder,
            active: e.active
        };
        let promise = null;
        if (item.id == 0) {
            promise = bannerService.create(model);
        } else {
            promise = bannerService.update(model);
        }

        promise.then((res) => {
            if (res.isSuccess) {
                alertActions.successUpdate();
                onSuccess(res.data);
            }
        });
    }

    let [preview, setPreview] = useState(false)
    let [image, setImage] = useState(item.image)
    let inputFile = useRef()

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
                        let imgLink = uploadService.getImageUrl(res.data);
                        setImage(imgLink)
                    }
                }).finally(() => {
                    // event.target.value = '';
                });
        }
    }

    return (
        <>
            <CRow alignHorizontal='center'>
                <CCol xs='12'>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <span className="navbar-brand h4">{item.id == 0 ? 'Thêm' : 'Sửa'} banner</span>
                            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            </ul>
                            <div className="form-inline my-2 my-lg-0">
                                <CButton className={'float-right mr-3'}
                                    color="success"
                                    onClick={() => setPreview(true)}>
                                    <FontAwesomeIcon icon={allIcon.faEye} /> Xem trước
                                </CButton>
                                <CButton className={'float-right mr-3'}
                                    color="success"
                                    onClick={handleSubmit(onSubmit)}>
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
                        <CCol xs="12" lg="12" >
                            <CCard>
                                <CCardHeader>
                                    <span className='h5'>Thông tin banner</span>
                                </CCardHeader>
                                <CCardBody>

                                    <CFormGroup>
                                        <CLabel htmlFor='title'>Ảnh</CLabel>
                                        <input type='file' id='file' ref={inputFile}
                                            onChange={onSelectedFile}
                                            accept="image/png, image/jpeg, image/svg, image/jpg"
                                            className='form-control'
                                            style={{ display: 'none' }}
                                        />
                                        {/* <CButton className='form-control' type='link' onClick={onChangeImage} >Tải lên</CButton> */}
                                        <div className='w-100 position-relative' style={{ minHeight: '200px' }}>
                                            <img src={image} className='d-block w-100' style={{ height: '200px', objectFit: 'scale-down', objectPosition: 'left' }} />
                                            <CButton className='position-absolute top-0 btn-link right-0' onClick={onChangeImage} ><FontAwesomeIcon icon={allIcon.faEdit} /></CButton>
                                        </div>
                                    </CFormGroup>

                                    <CFormGroup>
                                        <CLabel htmlFor='buttonTitle'>Màu sắc Overlay</CLabel>

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <Controller
                                                        name="overlayColor"
                                                        control={control}
                                                        render={({ field }) => {
                                                            return (
                                                                <>
                                                                    <ButtonColorPicker value={field.value} onChange={field.onChange} />
                                                                </>
                                                            )
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CFormGroup>

                                    <CFormGroup>
                                        <CLabel htmlFor='title'>Tiêu đề</CLabel>

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <Controller
                                                        name="titleColor"
                                                        control={control}
                                                        render={({ field }) => {
                                                            return (
                                                                <>
                                                                    <ButtonColorPicker value={field.value} onChange={field.onChange} />
                                                                </>
                                                            )
                                                        }}
                                                    />


                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                className={`form-control`}
                                                name={'title'}
                                                {...register('title')}
                                            />
                                        </div>
                                    </CFormGroup>

                                    <CFormGroup>
                                        <CLabel htmlFor='description'>Slogan</CLabel>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <Controller
                                                        name="descriptionColor"
                                                        control={control}
                                                        render={({ field }) => {
                                                            return (
                                                                <>
                                                                    <ButtonColorPicker value={field.value} onChange={field.onChange} />
                                                                </>
                                                            )
                                                        }}
                                                    />


                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                className={`form-control`}
                                                name={'description'}
                                                {...register('description')}
                                            />
                                        </div>
                                    </CFormGroup>

                                    <CFormGroup>
                                        <CLabel htmlFor='buttonTitle'>Tiêu đề button</CLabel>

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <Controller
                                                        name="buttonTitleColor"
                                                        control={control}
                                                        render={({ field }) => {
                                                            return (
                                                                <>
                                                                    <ButtonColorPicker value={field.value} onChange={field.onChange} />
                                                                </>
                                                            )
                                                        }}
                                                    />


                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                className={`form-control`}
                                                name={'buttonTitle'}
                                                {...register('buttonTitle')}
                                            />
                                        </div>

                                    </CFormGroup>

                                    <CFormGroup>
                                        <CLabel htmlFor='buttonTitle'>Màu sắc button</CLabel>

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <Controller
                                                        name="buttonColor"
                                                        control={control}
                                                        render={({ field }) => {
                                                            return (
                                                                <>
                                                                    <ButtonColorPicker value={field.value} onChange={field.onChange} />
                                                                </>
                                                            )
                                                        }}
                                                    />


                                                </div>
                                            </div>
                                        </div>
                                    </CFormGroup>


                                    <CFormGroup>
                                        <CLabel htmlFor='link'>Link</CLabel>
                                        <input
                                            type="text"
                                            className={`form-control`}
                                            name={'link'}
                                            {...register('link')}
                                        />
                                    </CFormGroup>

                                    <CFormGroup>
                                        <CLabel htmlFor='displayOrder'>Thứ tự</CLabel>
                                        <input
                                            type="number"
                                            className={`form-control`}
                                            name={'displayOrder'}
                                            {...register('displayOrder')}
                                        />
                                    </CFormGroup>

                                    <CFormGroup>
                                        <div className="custom-control custom-checkbox">
                                            <Controller
                                                name="active"
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        <input type="checkbox"
                                                            className="custom-control-input"
                                                            name='active'
                                                            onChange={(e) => { field.onChange(e.target.checked) }}
                                                            checked={field.value} />
                                                        <label className="custom-control-label"
                                                            htmlFor='active'
                                                            onClick={(e) => { field.onChange(!field.value) }}>Hiển thị</label>
                                                    </>
                                                )}
                                            />

                                        </div>
                                    </CFormGroup>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CCol>
            </CRow>
            {preview &&
                <PreviewItem item={{
                    title: getValues("title"),
                    description: getValues("description"),
                    titleColor: getValues("titleColor"),
                    descriptionColor: getValues("descriptionColor"),
                    buttonTitle: getValues("buttonTitle"),
                    buttonTitleColor: getValues("buttonTitleColor"),
                    buttonColor: getValues("buttonColor"),
                    image: getValues("image"),
                    overlayColor: getValues("overlayColor"),
                    link: getValues("link"),
                    displayOrder: getValues("displayOrder"),
                    active: getValues("active")
                }}
                    onClose={() => setPreview(false)}
                />
            }
        </>
    );
}

const ButtonColorPicker = ({ value, onChange }) => {
    let [openPicker, setOpen] = useState(false)
    let [color, setColor] = useState(value)

    const popover = {
        position: 'absolute',
        zIndex: '2',
    }
    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    }

    const handleClose = () => {
        setOpen(false)
        onChange(color)
    }

    const onValueChange = (color, event) => {
        // setColor(color.hex)
        setColor("#" + rgbHex(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a))
    }

    const hexToRGBA = (str) => {
        let rgba = hexRgb(str);
        return {
            r: rgba.red,
            g: rgba.green,
            b: rgba.blue,
            a: rgba.alpha
        }
    }

    return (
        <>
            <button className='w-30px h-20px border rounded'
                onClick={() => setOpen(true)}
                style={{ backgroundColor: color }}></button>
            {openPicker ?
                <div style={popover}>
                    <div style={cover} onClick={handleClose} />
                    <SketchPicker color={hexToRGBA(color)} onChange={onValueChange} />
                </div> : null
            }
        </>
    )
}

const PreviewItem = ({ item, onClose }) => {
    let [dark, setDark] = useState(false)

    return (
        <div className={`${dark ? 'body-theme-dark' : 'bg-white'} position-fixed top-0 left-0 w-100 h-100`}
            style={{ zIndex: 10000 }}>
            <div>
                <NavigationBar />
                <div className='home-wrapper'>
                    <HomeBannerItem banner={item} blockClick />
                </div>
            </div>
            <div>
                <btn className='btn btn-light position-absolute border-0 top-0 pr-3 py-2' onClick={() => setDark(!dark)} style={{ zIndex: 1000, right: '80px' }}>
                    <FontAwesomeIcon icon={dark ? allIcon.faMoon : allIcon.faSun} />
                </btn>

                <btn className='btn btn-light position-absolute border-0 top-0 right-0 pr-3 py-2' onClick={onClose} style={{ zIndex: 1000 }}>
                    <FontAwesomeIcon icon={allIcon.faTimes} /> đóng
                </btn>
            </div>
        </div>
    )
}

export { Banners }