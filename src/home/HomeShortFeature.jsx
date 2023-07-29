import { useState, useEffect } from "react";
import { CourseGridItem } from "../courses";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
// import feature1 from "../assets/images/feature-1.png";
// import feature2 from "../assets/images/feature-2.png";
// import feature3 from "../assets/images/feature-3.png";

const HomeShortFeature = (props) => {

    return (
        <section className="container">
            <section className="row ShortFeature_wrapper">
                <section className="col-md-12 col-lg-4 ShortFeature_column">
                    <img src="../assets/images/feature-1.png" alt="" />
                    <h3 className="mycv-typography_headline3 mycv-typography_headline">Trên 37.206 học viên</h3>
                </section>
                <section className="col-md-12 col-lg-4 ShortFeature_column">
                    <img src="../assets/images/feature-2.png" alt="" />
                    <h3 className="mycv-typography_headline3 mycv-typography_headline">12+ khóa học dành cho bạn</h3>
                </section>
                <section className="col-md-12 col-lg-4 ShortFeature_column">
                    <img src="../assets/images/feature-3.png" alt="" />
                    <h3 className="mycv-typography_headline3 mycv-typography_headline">Học bất cứ lúc nào, bất cứ nơi đâu</h3>
                </section>
            </section>
        </section>
    )
}
function mapState(state) {
    return { loggedIn: state.authentication.loggedIn };
}

const actionCreators = {
};

export { HomeShortFeature };