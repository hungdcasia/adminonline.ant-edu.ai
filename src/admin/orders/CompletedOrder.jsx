import {
    CBadge,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react'
import { useState } from 'react'
import { NumberHelpers } from "../../helpers";
import { FilterComponent } from '../shared';
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import { OrderTable } from './OrderTable';
import { Avatar } from '../../shared';

const getBadge = status => {
    switch (status) {
        case 'PENDING': return 'warning'
        case 'CANCELLED': return 'danger'
        case 'COMPLETED': return 'success'
        default: return 'primary'
    }
}

const orderStatusDS = {
    'PENDING': 'Chờ thanh toán',
    'CANCELLED': 'Đã hủy',
    'COMPLETED': 'Thành công',
}

const CompletedOrder = props => {
    const defaultFilters = [{ field: 'status', value: 'COMPLETED', operator: '==' }]
    let [filters, setFilters] = useState([]);
    const columns = [
        {
            dataField: '#',
            text: '#',
            type: 'number',
            style: {
                width: '70px',
            },
            formatter: (cellContent, row) => (
                <span>{row.id}</span>
            )
        },
        {
            dataField: 'id',
            text: 'Mã ĐH',
            sort: true,
            canFilter: true,
            type: 'number',
            formatter: (cellContent, row) => (
                <Link to={`/admin/orders/${cellContent}`}>KH000{cellContent}</Link>
            )
        },
        {
            dataField: 'price',
            text: 'price',
            sort: true,
            canFilter: true,
            type: 'number',
            formatter: (cellContent, row) => (
                <span>{NumberHelpers.toDefautFormat(cellContent)}</span>
            )
        },
        {
            dataField: 'user',
            text: 'User',
            sort: false,
            canFilter: false,
            type: 'string',
            formatter: (cellContent, item) => (
                <span><Avatar url={item.user?.avatar} className='rounded-circle w-30px h-30px' /> {item.user?.userName}</span>
            )
        },
        {
            dataField: 'contact',
            text: 'Contact',
            type: 'string',
            formatter: (cellContent, item) => (
                <span>{item.contactName}<br />{item.contactEmail}<br />{item.contactPhone}</span>
            )
        },
        {
            dataField: 'contactName',
            text: 'Contact Name',
            type: 'string',
            hidden: true,
            canFilter: true,
        },
        {
            dataField: 'contactEmail',
            text: 'Contact Email',
            type: 'string',
            hidden: true,
            canFilter: true,
        },
        {
            dataField: 'contactPhone',
            text: 'Contact Phone',
            type: 'string',
            hidden: true,
            canFilter: true,
        },
        {
            dataField: 'status',
            text: 'status',
            canFilter: false,
            type: 'string',
            formatter: (cellContent, row) => (
                <CBadge color={getBadge(cellContent)}>
                    {orderStatusDS[cellContent]}
                </CBadge>
            )
        },
        {
            dataField: 'createdDateTime',
            text: 'Ngày tạo',
            canFilter: true,
            sort: true,
            type: 'date',
            formatter: (cellContent, row) => (
                <Moment date={cellContent} format="YYYY/MM/DD HH:mm" />
            )
        },
    ]
    const onFilter = (items) => {
        setFilters(items);
    }

    return (
        <>
            <CRow>
                <CCol sm='12'>
                    <FilterComponent onFilter={onFilter} filterConfigs={columns.filter(r => r.canFilter)} />
                </CCol>
                <CCol xs="12" lg="12" className='h-100'>
                    <CCard>
                        <CCardHeader>
                            <span className='h3'>Tất cả đơn hàng</span>
                            <div className="card-header-actions">
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            {filters.length > 0 &&
                                <div className='mb-2'>
                                    <span className='mr-2'><i className="fas fa-filter text-dark"></i></span>
                                    {filters.map((item, index) => (
                                        <CBadge color='secondary' key={index} className='py-1 px-2 mx-1'>{columns.filter(r => r.canFilter).find(r => r.dataField == item.field).text} {item.operator.toLowerCase()} {item.value}</CBadge>
                                    ))}

                                    <div className='btn btn-sm' onClick={() => onFilter([])}>clear</div>
                                </div>
                            }
                            <OrderTable filters={defaultFilters.concat(filters)} columns={columns} />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}
export default CompletedOrder