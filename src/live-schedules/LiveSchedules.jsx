
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom';
import React, { Component, Suspense } from 'react';
import { connect, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import Moment from 'react-moment';
import moment from 'moment';
import { MyLiveSchedules } from '.';
import { useState } from 'react';
import { useEffect } from 'react';
import { liveSchedulesService } from '../services';
import { NoData } from '../shared';
import Countdown from 'react-countdown';
import { FeaturedItem } from './FeaturedItem';
import { TimeCoundown } from './TimeCoundown';
import { CommonItem } from './CommonItem';
import { LiveSchedulesContext } from './LiveSchedulesContext';
import { CModal, CModalBody, CModalHeader } from '@coreui/react';
import { LiveScheduleDetail } from './LiveScheduleDetail';

const LiveSchedules = () => {
    const isMyTab = useRouteMatch("/live-schedules/my")?.isExact ?? false;
    const [showDetail, setShowDetail] = useState()
    const authentication = useSelector(r => r.authentication);
    const { loggedIn } = authentication


    const showDetailClick = (item) => {
        if (item == null) {
            setShowDetail(null)
            return
        }
        liveSchedulesService.getDetail(item.id)
            .then(res => {
                if (res.isSuccess) {
                    setShowDetail(res.data)
                }
            })
    }

    return (
        <LiveSchedulesContext.Provider value={{ showDetail, showDetailClick }}>
            <div className="App_wrapper">
                <div className="container-fluid App_appContainer">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="Tab_tabs">
                                <Link className={!isMyTab ? 'Tab_tab Tab_active' : 'Tab_tab'} to={'/live-schedules'}>Lịch trực tuyến</Link>
                                {loggedIn &&
                                    <Link className={isMyTab ? 'Tab_tab Tab_active' : 'Tab_tab'} to={'/live-schedules/my'}>Lịch của tôi</Link>
                                }
                            </div>
                        </div>
                    </div>
                    <Switch>
                        {loggedIn &&
                            <Route path='/live-schedules/my' component={MyLiveSchedules} />
                        }
                        <Route path='/live-schedules' component={LiveSchedulesList} />
                    </Switch>
                </div>
            </div>
            {showDetail &&
                <CModal scrollable={true} size='xl' onClose={() => showDetailClick(null)} show={showDetail != null} centered closeOnBackdrop={false}>
                    <CModalBody className='p-0 pb-2 boder rounded-lg overflow-auto'>
                        <LiveScheduleDetail item={showDetail} />
                    </CModalBody>
                </CModal>
            }
        </LiveSchedulesContext.Provider>
    )
}

const LiveSchedulesList = () => {
    let [schedules, setSchedules] = useState([])

    const getList = () => {
        liveSchedulesService.getList()
            .then(res => {
                if (res.isSuccess)
                    setSchedules(res.data)
            })
    }

    useEffect(() => {
        getList()
    }, [])

    if (schedules.length == 0) {
        return (
            <div className='row'>
                <NoData message='Chưa có lịch trực tiếp. Bạn vui lòng quay lại sau!' />
            </div>
        )
    }

    return (
        <>
            <div className='row'>
                <FeaturedItem item={schedules[0]} onCompleteCountdown={() => { getList() }} />
            </div>
            <div className='container'>
                <div className='row mt-5 d-flex'>
                    {schedules.filter((item, index) => index != 0).map(item => (
                        <div className='col-lg-4 align-self-stretch' key={item.id}>
                            <CommonItem item={item} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export { LiveSchedules }