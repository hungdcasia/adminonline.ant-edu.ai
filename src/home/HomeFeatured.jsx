import { useState, useEffect } from "react";
import { CourseGridItem, CourseGridItem2 } from "../courses";
import { Link } from "react-router-dom";
import { courseService } from "../services";
import { connect } from "react-redux";

const HomeFeatured = (props) => {
    let [courses, setCourses] = useState([]);

    useEffect(() => {
        courseService.getCoursesFeatured()
            .then(res => {

                let { myCourses } = props;
                let userCourses = myCourses?.courses;
                let courses = res.data;
                if (userCourses) {
                    courses.forEach(element => {
                        let userCourse = userCourses.find(item => item.course.id == element.id);
                        element.isRegistered = userCourse != null;
                        element.progress = userCourse?.userCourse.progress;
                    });
                }
                setCourses(res.data);
            });
    }, []);
    return (
        <section className="container">
            <section className="row FeaturedCourses_headingWrapper">
                <section className="col-12">
                    <h2 className="mycv-typography_headline2 mycv-typography_headline">Khóa học nổi bật</h2>
                    <p className="mycv-typography_paragraph2 FeaturedCourses_subHeading">Những khóa học có số lượng học viên theo học nhiều nhất và có phản hồi tích cực nhất</p>
                </section>
            </section>
            <section className="row">
                {courses.map(item =>
                    <section key={item.id} className="col-sm-12 col-md-6 col-lg-4 FeaturedCourses_courseItem">
                        <CourseGridItem2 data={item} />
                    </section>
                )}
            </section>
            <section className="row FeaturedCourses_moreWrapper">
                <Link to="/courses" className="ranks_primary base_button sizes_l FeaturedCourses_btnViewCourses tooltip_tooltip" type="button">
                    <div className="base_inner sizes_inner"><span className="base_text">Tất cả khóa học</span></div>
                </Link>
            </section>
        </section>
    )
}
function mapStateToProps(state) {
    const { myCourses } = state;
    return { myCourses };
}

const actionCreators = {
};

const connectedPage = connect(mapStateToProps, actionCreators)(HomeFeatured);

export { connectedPage as HomeFeatured };