import * as allIcon from "@fortawesome/free-solid-svg-icons";

const fields = [
    { key: "name", label: "Tên" },
    { key: "code", label: "Mã KH" },
    // { key: "description", label: "Mô tả", _style: { width: '30%' } },
    { key: "price", label: "Giá", _style: { width: '10%' } },
    { key: "category", label: "Nhóm", _style: { width: '20%' } },
    { key: "active", label: "Trạng thái", _style: { width: '10%' } },
    { key: "registered", label: "Học viên", _style: { width: '10%' } },
    { key: "action", label: "", _style: { width: '10%' } }
];
const getBadge = status => {
    switch (status) {
        case true: return 'success'
        case false: return 'secondary'
        default: return 'primary'
    }
}
const CourseTable = ({courses }) => {
    return (
        <CDataTable
            items={courses}
            fields={fields}
            striped
            hover
            border
            itemsPerPage={20}
            pagination
            responsive
            scopedSlots={{
                'name': (item) => {
                    return (
                        <td style={{ minWidth: '150px' }}>
                            <img width='40' src={item.thumbnailImage} className='mr-2' />
                            <Link to={`/admin/courses/${item.id}`}>{item.name}</Link>
                        </td>
                    )
                },
                'code': (item) => {
                    return (<td>{item.code ?? ''}</td>)
                },
                'active': (item) => (
                    <td>
                        <CBadge color={getBadge(item.active)}>
                            {item.active ? "Hiện" : "ẩn"}
                        </CBadge>
                        {/* {item.featured &&
                                                <CBadge color='success'>
                                                    'Nổi bật'
                                                </CBadge>
                                            } */}
                    </td>
                ),
                'description': (item) => {
                    return (
                        <td style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                            {item.description}
                        </td>
                    )
                },
                'category': (item) => {
                    var category = categories.find(ele => ele.id == item.categoryId);
                    return (
                        <td>
                            {category == null ?
                                <span className='font-italic'><del>Bị xóa</del></span> :
                                <span>{category.name}</span>
                            }
                        </td>
                    )
                },
                'registered': (item) => (
                    <td>
                        <Link to={'/admin/courses/' + item.id + '/students'}>{item.registered}</Link>
                    </td>
                ),
                'action': (item, index) => (
                    <td >
                        <div className="py-2 d-flex justify-content-center">
                            <CButton
                                color="light"
                                size="sm"
                                title='Nhân bản'
                                onClick={() => { dupplicateClicked(item) }}
                            >
                                <FontAwesomeIcon icon={allIcon.faClone} />
                            </CButton>
                            <CButton
                                className='ml-3'
                                color="light"
                                size="sm"
                                title='Cấu hình bài học'
                                onClick={() => { history.push('/admin/courses/' + item.id + '/lessons') }}
                            >
                                <FontAwesomeIcon icon={allIcon.faCog} />
                            </CButton>
                            <CButton
                                className='ml-3'
                                color="light"
                                size="sm"
                                title='Quản lý học viên'
                                onClick={() => { history.push('/admin/courses/' + item.id + '/students') }}
                            >
                                <FontAwesomeIcon icon={allIcon.faUsers} />
                            </CButton>
                            <CButton
                                className='ml-3'
                                color="light"
                                size="sm"
                                title='Xóa'
                                onClick={() => { deleteClicked(item, index) }}
                            >
                                <FontAwesomeIcon icon={allIcon.faTrashAlt} />
                            </CButton>


                        </div>
                    </td>
                )
            }}
        />
    )
}