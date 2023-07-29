import { useState, useEffect, useRef } from "react";
import { CourseGridItem } from "../courses";
import { Link } from "react-router-dom";
import Particles from 'react-particles';
import { connect, useSelector } from 'react-redux';
import { isMobile } from "react-device-detect";

const HomeCallToAction = (props) => {
    let authentication = useSelector(r => r.authentication)
    let { loggedIn } = authentication;

    return (
        <section className="row">
            <section className="col-12 CallToAction_particlesWrapper">
                <div className='CallToAction_bg'>
                </div>
                <div className="CallToAction_opacity">
                    <div className="CallToAction_container">
                        <h2>37.402+ người khác đã học. Còn bạn?</h2>
                        <p>Kiến thức là một thứ mà bạn sẽ có được bằng cách cho đi - Ivan Sutherland</p>
                        <Link to={loggedIn ? '/courses' : '/login'}>
                            <div className="CallToAction_ctaBtn">
                                {loggedIn ? 'Học ngay' : 'Tham gia ngay'}
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </section>
    )
}
export { HomeCallToAction };