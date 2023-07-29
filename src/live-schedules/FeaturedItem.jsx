import moment from "moment"
import { useContext } from "react"
import Countdown from "react-countdown"
import { useForceUpdate } from "../helpers/useForceUpdate"
import { LiveSchedulesContext } from "./LiveSchedulesContext"
import { TimeCoundown } from "./TimeCoundown"

const FeaturedItem = ({ item, onCompleteCountdown }) => {
    const forceUpdate = useForceUpdate();
    let context = useContext(LiveSchedulesContext)
    let startTime = moment(item.startTime, 'x').local().toDate();
    let endTime = moment(item.endTime, 'x').local().toDate();
    let now = new Date()
    let isWaiting = startTime > now;
    let isBeing = startTime <= now && now < endTime
    let ended = now > endTime
    return (
        <div className='live-schedule-item w-100'>
            <div className='row'>
                <div className='item-thumbs overflow-hidden col-lg-6'>
                    <div className='position-relative overflow-hidden rounded'>
                        <div style={{
                            backgroundImage: `url(${item.thumbnail})`,
                            backgroundSize: 'cover',
                            paddingBottom: '50%'
                        }}
                            className='w-100 h-100 rounded border position-relative'>
                            <div className='position-absolute h-100 w-100 bg-black opacity-25' style={{ top: 0 }}></div>
                        </div>
                        <div
                            className='position-absolute bg-orange rounded p-1 text-white'
                            style={{ top: 20, right: 30 }}>
                            {item.category?.name}
                        </div>
                        <div className='position-absolute h-100 d-flex justify-content-center flex-column' style={{ top: 0, left: 0, right: 0 }}>
                            <Countdown date={moment(item.startTime, 'x').local().toDate()}
                                onComplete={() => { forceUpdate(); onCompleteCountdown?.call() }}
                                renderer={(props) => {
                                    if (props.completed && isBeing) {
                                        return (
                                            <div className="countdown">
                                                <div className='countdown-card'>
                                                    <div className="countdown-value px-3">
                                                        <svg height="50" width="50" className="blinking">
                                                            <circle cx="25" cy="25" r="10" fill="red" />
                                                        </svg>
                                                        <span> Đang trực tiếp</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return (
                                        <TimeCoundown {...props} />
                                    )
                                }} />
                        </div>
                        {item.restrictionCourseId > 0 &&
                            <div className="ribbon ribbon-holder text-white font-weight-bold text-warning shadow">For You!</div>
                        }
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className='h2 font-weight-bold'>{item.title}</div>
                    <div className='font-italic opacity-75 h5'>{item.presenter}</div>
                    <div dangerouslySetInnerHTML={{ __html: item.summary }} className='mt-3 h5 text-justify'></div>
                    <div className='pt-2'>
                        <div className='d-inline-block h5 pt-2'>
                            {moment(item.startTime).local().format('HH:mm')} - {moment(item.endTime).local().locale('vi').format('HH:mm dddd, DD/MM/yyyy')}
                        </div>
                        <div className='float-right btn btn-link h5' onClick={() => context.showDetailClick(item)}><u>Xem chi tiết</u></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { FeaturedItem }