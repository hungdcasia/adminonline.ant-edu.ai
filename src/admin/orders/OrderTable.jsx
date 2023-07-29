import { useEffect, useState } from 'react'
import { orderService } from '../services/order.service';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

const OrderTable = ({ filters, columns }) => {
    let [paging, setPaging] = useState({
        page: 1,
        pageSize: 20,
        total: 0
    })

    let [sort, setSort] = useState({
        sort: 'createdDateTime', direction: 'desc'
    })

    let [dataSource, setDataSource] = useState([])

    const reloadData = () => {
        handleTableChange('sort', {
            page: paging.page,
            sizePerPage: paging.pageSize,
            sortField: sort.sort,
            sortOrder: sort.direction
        })
    }

    useEffect(() => {
        reloadData();
    }, [filters])

    const handleTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
        let pagingOptions = {
            page: page == 0 ? 1 : page,
            pageSize: sizePerPage
        }

        let filterOptions = filters
        let sortOptions = { sort: sortField, direction: sortOrder }
        setSort(sortOptions)

        if (type == 'pagination') {
        } else if (type = 'sort') {
            pagingOptions.page = 1
        }
        
        orderService.getOrders(pagingOptions, filterOptions, sortOptions)
            .then(res => {
                if (res.isSuccess) {
                    let data = res.data
                    setPaging({
                        page: data.page,
                        pageSize: data.pageSize,
                        total: data.total
                    })
                    setDataSource(res.data.items)
                }
            })
    }

    return (
        <>
            <BootstrapTable
                striped
                hover
                remote={{ sort: true, pagination: true }}
                keyField="id"
                data={dataSource}
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
        </>
    )
}

export { OrderTable }