import { CButton, CCol, CModal, CModalBody, CModalHeader, CRow } from "@coreui/react"
import { useState } from "react"

const ExportForm = (onSubmit, onClose, total, show) => {

    let [pageSize, setPageSize] = useState(10000)
    let maxPage = Math.max(1, Math.ceil(total / 10000))

    return (
        <CModal show={show} centered onClose={onClose}>
            <CModalHeader closeButton><span className='h3'>Thêm quản trị viên</span></CModalHeader>
            <CModalBody>
                <CRow>
                    <CCol xs='12' lg='12' sm='12'>
                        <form autocomplete='off' onSubmit={(e) => e.preventDefault()}>

                        </form>
                    </CCol>
                    <CCol cols='12' className='mt-4 pb-3'>
                        <CButton
                            color='primary'
                            onClick={onSubmit}
                            title='Export'>
                            Thêm
                        </CButton>
                    </CCol>
                </CRow>
            </CModalBody>
        </CModal>
    )
}

export default ExportForm