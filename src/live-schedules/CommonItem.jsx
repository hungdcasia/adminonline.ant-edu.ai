import moment from "moment"
import { useContext } from "react"
import { LiveSchedulesContext } from "./LiveSchedulesContext"

const CommonItem = ({ item }) => {
    let context = useContext(LiveSchedulesContext)
    return (
        <div className='live-schedule-item course-item-wrapper w-100 h-100'>
            <div className='w-100 h-100 d-flex flex-column'>
                <div className='w-100 item-thumbs overflow-hidden'>
                    <div style={{
                        backgroundImage: `url(${item.thumbnail})`,
                        backgroundSize: 'cover',
                        paddingBottom: '50%'
                    }}
                        className='w-100 position-relative'>
                        <div className='position-absolute w-100 h-100 bg-black opacity-25' style={{ top: 0 }}></div>
                    </div>
                    <div
                        className='position-absolute bg-orange rounded p-1 text-white'
                        style={{ top: 20, right: 30 }}>
                        {item.category?.name}
                    </div>
                    {item.restrictionCourseId > 0 &&
                        <div className="ribbon ribbon-holder text-white font-weight-bold text-warning text-uppercase shadow">For You!</div>
                    }
                </div>
                <div className='w-100 flex-grow-1 d-flex flex-column px-2 pt-2'>
                    <div className='h4 font-weight-bold'>{item.title}</div>
                    <div className='font-italic opacity-75'>{item.presenter}</div>
                    <div dangerouslySetInnerHTML={{ __html: item.summary }} className='mt-3 text-justify'></div>
                    <div className='mt-auto pt-2 w-100'>
                        <div className='d-inline-block h5 pt-2'>
                            {moment(item.startTime).local().format('HH:mm')} - {moment(item.endTime).local().locale('vi').format('HH:mm dddd, DD/MM/yyyy')}
                        </div>
                        <div className='float-right btn btn-link h5' onClick={() => { context.showDetailClick(item); }}><u>Xem chi tiết</u></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { CommonItem }