import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import moment from "moment"
import { LiveSchedulesContext } from "./LiveSchedulesContext";
import { useContext } from "react";
import Countdown from "react-countdown";
import { TimeCoundown } from "./TimeCoundown";
import { LiveSchedules } from ".";
import { useSelector } from "react-redux";
import { alertActions, modalActions } from "../actions";
import { history } from "../helpers";
import { liveSchedulesService } from "../services";
import { Link } from "react-router-dom";
import { Avatar } from "../shared";

const LiveScheduleDetail = ({ item }) => {
    const authentication = useSelector(r => r.authentication)
    const { loggedIn } = authentication;
    let { liveSchedule, register } = item;
    let context = useContext(LiveSchedulesContext)

    const registerClicked = () => {
        if (!loggedIn) {
            modalActions.show({
                title: 'Vui lòng đăng nhập để đăng ký.',
                ok: 'Đăng nhập',
                onOk: () => {
                    history.login();
                }
            });
            return;
        }

        liveSchedulesService.register(liveSchedule.id)
            .then(res => {
                if (res.isSuccess) {
                    context.showDetailClick(liveSchedule)
                    alertActions.success('Đăng ký thành công!');
                }
            });
    }

    const cancelRegisterClicked = () => {
        liveSchedulesService.cancelRegister(liveSchedule.id)
            .then(res => {
                if (res.isSuccess) {
                    context.showDetailClick(liveSchedule)
                    alertActions.success('Hủy đăng ký thành công!');
                }
            });
    }

    const joinRoomClicked = () => {
        if (liveSchedule.joinRoomLink != null) {
            window.open(liveSchedule.joinRoomLink)
        }
    }

    let startTime = moment(liveSchedule.startTime, 'x').local().toDate();
    let endTime = moment(liveSchedule.endTime, 'x').local().toDate();
    let now = new Date()
    let isWaiting = startTime > now;
    let isBeing = startTime <= now && now < endTime
    let ended = now > endTime
    let registered = register != null

    let hasSlot = liveSchedule.maxParticipants - liveSchedule.registeredCount > 0;
    let canShowRegister = !registered && isWaiting
    let canShowCancelRegister = registered && isWaiting

    return (
        <div className='row live-schedule-item w-100 pb-0'>
            <div className={`${liveSchedule.agenda.length > 0 ? 'col-lg-8' : 'col-lg-12'} px-3 pt-2`}>
                <div className='w-100 flex-grow-1 d-flex flex-column text-dark'>
                    <div className='h4 font-weight-bold'>{liveSchedule.title}</div>
                    <div className='font-italic opacity-75'>{liveSchedule.presenter}</div>
                    <div className='d-inline-block h5 pt-2'>
                        {moment(liveSchedule.startTime).local().format('HH:mm')} - {moment(liveSchedule.endTime).local().locale('vi').format('HH:mm dddd, DD/MM/yyyy')}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: liveSchedule.description }} className='mt-3'></div>

                    <Countdown date={moment(liveSchedule.startTime, 'x').local().toDate()}
                        onComplete={() => context.showDetailClick(liveSchedule)}
                        renderer={(props) => {
                            if (props.completed && isBeing) {
                                return (
                                    <div className="countdown">
                                        <div className='countdown-card'>
                                            <div className="countdown-value px-3">
                                                <svg height="50" width="50" className="blinking">
                                                    <circle cx="25" cy="25" r="10" fill="red" />
                                                </svg>
                                                <span>Đang trực tiếp</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return (
                                <div className='d-none'>
                                    <TimeCoundown {...props} />
                                </div>
                            )
                        }} />

                    <div className='row d-flex justify-content-around pb-2'>
                        <div className='col-md-4 text-center d-flex flex-column'>
                            <p className='text-center h5'>Nền tảng</p>
                            <div className='mx-auto py-3 h4 font-weight-bold w-75 d-flex flex-column'
                                style={{ border: '3px solid var(--primary-color)', flex: 1 }}>
                                <span className='m-auto'>{liveSchedule.platform}</span>
                            </div>
                        </div>

                        <div className='col-md-4 text-center d-flex flex-column'>
                            <p className='text-center h5'>Người tham gia</p>
                            <div className='mx-auto py-3 h4 font-weight-bold w-75 d-flex flex-column'
                                style={{ border: '3px solid var(--primary-color)', flex: 1 }}>
                                <span className='m-auto'>{liveSchedule.maxParticipants}</span>
                            </div>
                        </div>

                        <div className='col-md-4 text-center d-flex flex-column'>
                            <p className='text-center h5'>Giới hạn</p>
                            <div className='mx-auto w-75 h6 font-weight-bold text-justify d-flex flex-column'
                                style={{ border: '3px solid var(--primary-color)', flex: 1 }}>
                                <span className='m-auto px-1 py-2'>{liveSchedule.restrictionCourseId == 0 ? 'Không giới hạn' : `Chỉ dành cho học viên khóa ${liveSchedule.course?.name}`}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {liveSchedule.agenda.length > 0 &&
                <div className='col-lg-4 pt-2 text-dark'>
                    <h5>Thời lượng chương trình</h5>
                    <ul className="timeline">
                        {liveSchedule.agenda.map((ele, index) => (
                            <li key={index}>
                                <p className='mt-5'>{ele.content}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            }

            <div className='col-12 mt-2 mb-2'>
                <div className='mt-auto pt-4 w-100 d-flex flex-column justify-content-center'>
                    {(registered && isWaiting && liveSchedule.facebookEventLink != null && liveSchedule.facebookEventLink != '') &&
                        <div className='d-inline-block h-100 pt-4 text-center'><a href={liveSchedule.facebookEventLink} target='_blank'>Nhận thông báo sự kiện qua Facebook</a></div>
                    }
                    <div className='text-center'>
                        {/* <div className='mb-1 w-100 text-center'>Còn {liveSchedule.maxParticipants - liveSchedule.registeredCount} suất đăng ký</div> */}
                        {canShowRegister &&
                            <button className='btn btn-default rounded-pill shadow h4 border-0' onClick={registerClicked} disabled={!hasSlot}>Đăng ký ngay</button>
                        }
                        {canShowCancelRegister &&
                            <button className='btn btn-default rounded-pill shadow h4 border-0' onClick={cancelRegisterClicked} disabled={!hasSlot}>Hủy đăng ký</button>
                        }
                        {(isBeing && registered) &&
                            <button className='btn btn-default rounded-pill shadow h4 border-0' onClick={joinRoomClicked} disabled={!hasSlot}>Vào phòng ngay</button>
                        }
                    </div>


                </div>
            </div>
            <div className='col-12 border-top h-40px bg-light flex-row d-flex'>
                <div className='text-dark pt-2 h-100 flex-shrink-0'>{liveSchedule.registeredCount} đã đăng ký</div>
                <div className='ml-2 h-40px py-1 d-flex overflow-hidden'>
                    {item.registers.map(user => (
                        <Avatar url={user.avatar} className='h-100 rounded-circle' rawProps={{ title: user.displayName }} />
                    ))}
                </div>
            </div>
            <div className='btn btn-light position-absolute' style={{ top: 10, right: 10 }} onClick={() => context.showDetailClick(null)}><FontAwesomeIcon icon={allIcon.faTimes} /></div>
        </div >
    )
}

export { LiveScheduleDetail }