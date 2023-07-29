import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { BackButton } from "./BackButton";
import { courseService, userService } from "../services";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { alertActions, userActions } from "../actions";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import { NumberHelpers, UrlHelpers } from "../helpers";
import { Link } from "react-router-dom";
import { CModal, CModalBody, CModalHeader } from "@coreui/react";
import { useQuery } from "react-query";
import Moment from "react-moment";

const MyCertificatesPage = props => {
    window.gtag('event', 'page_view', {
        page_location: window.location
    })

    const { data: userresult } = useQuery(['user-certificates'], () => courseService.getUserCertificates())
    let userCertificates = userresult?.data ?? []

    useEffect(() => {
        userActions.getMyCourses();
    }, []);

    return (
        <div className="">
            <div className='row'>
                <span className='h1'>Chứng chỉ của tôi</span>
            </div>
            {userCertificates != null &&
                <>
                    {userCertificates.map((item, index) => {
                        return (
                            <div className='row border rounded shadow my-3 position-relative' key={index}>
                                <div className='col-4 pl-0'>
                                    <div className='w-100 h-100' style={{ backgroundImage: `url('${item.certificate.icon}')`, backgroundSize: 'cover' }}>
                                    </div>
                                </div>
                                <div className='col-8 pl-0 pt-2 pb-3'>
                                    <div className='h4 font-weight-bold'>{item.certificate.name}</div>
                                    <div className='pt-2 h6 text-warning'>{moment(item.createdTime, 'x').local().format("yyyy/MM/DD HH:mm:ss")}</div>
                                    <div className="h6">
                                        {item.certificate.description}
                                    </div>
                                    <div className='pt-3'>
                                    </div>
                                </div>

                            </div>
                        )
                    })}
                </>
            }
        </div>
    )
}


export { MyCertificatesPage };