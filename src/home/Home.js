import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

import { CourseGridItem } from '../courses';
import { courseService } from "../services/index";
import { HomeFeatured, HomeBanner, HomeCallToAction, HomeShortFeature, HomeIntro } from "./index";
import { HomeReview } from './HomeReview';
import { Redirect } from 'react-router-dom/cjs/react-router-dom';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            featuredCourses: []
        };
    }

    //function which is called the first time the component loads
    componentDidMount() {
    }

    render() {
        const { loggedIn } = this.props.authentication;
        if(!loggedIn){
            return <Redirect to="/login" />
        } else {
            return <Redirect to="/user/courses" />
        }
        // eslint-disable-next-line no-unreachable
        return (
            <div>
                <div className="Home_wrapper">
                    {/* <section className="Header_themeMenuWrapper">
                        <div className="Header_overlay"></div>
                        <div className="Header_infoWrapper">
                            <div className="Header_infoContent"> */}
                                <HomeBanner />
                            {/* </div>
                        </div>
                    </section> */}
                    <div style={{ marginTop: 80 }}></div>
                    <HomeIntro />

                    <HomeShortFeature />

                    <HomeFeatured />
                    <div style={{ marginTop: 80 }}></div>
                    <HomeReview />
                    <HomeCallToAction />
                </div>
            </div>
        )
    }
}

function mapState(state) {
    return { authentication: state.authentication };
}

const actionCreators = {
};

const connectedPage = connect(mapState, actionCreators)(Home);
export { connectedPage as Home };