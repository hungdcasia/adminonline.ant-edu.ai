import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { NumberHelpers, UrlHelpers, string_isNullOrEmpty } from "../helpers/index";
// import noAvatar from "../assets/images/no-avatar.png";
import { connect } from 'react-redux';

let noAvatar = "/assets/images/no-avatar.png";

class CourseGridItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseItem: props.data
        };

        this.getThumbImage = this.getThumbImage.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            courseItem: nextProps.data
        });
    }

    getThumbImage() {
        var { introVideo, thumbnailImage } = this.state.courseItem;
        return thumbnailImage;
    }

    render() {
        let { courseItem } = this.state;
        const courseDetailPath = UrlHelpers.createCourseDetailUrl(courseItem.slug, courseItem.id);
        let discount = courseItem.originPrice - courseItem.price;
        return (
            <div className="CourseItemGrid_wrapper CourseItemGrid_tranding CourseItemGrid_showProgress"
                style={{ '--progress': `${courseItem.progress ?? 0}%` }}
                onClick={this.props.CourseClick}>
                <div className="CourseItemGrid_imageWrapper">
                    <Link to={courseDetailPath}>
                        <div className="CourseItemGrid_image" style={{ backgroundImage: `url('${this.getThumbImage()}')` }}></div>
                    </Link>
                </div>
                <div className="CourseItemGrid_text">
                    <h6><Link to={courseDetailPath}>{courseItem.name}</Link></h6>
                    <p dangerouslySetInnerHTML={{ __html: courseItem.description }}></p>
                    <ul className="CourseItemGrid_infoWrapper">
                        <li className="CourseItemGrid_author"><div className="CourseItemGrid_authorLink"><img src={noAvatar} />Admin</div></li>
                        <li className="CourseItemGrid_registed">
                            <FontAwesomeIcon className="fa-w-20 CourseItemGrid_icon" icon={faUser} />
                            {NumberHelpers.toDefautFormat(courseItem.registered)}
                        </li>

                        <li style={{ position: 'relative' }}>
                            {(!courseItem.isRegistered && discount > 0) &&
                                <div className='CourseItemGrid_discount'>{NumberHelpers.toDefautFormat(courseItem.originPrice) + ' đ'}</div>
                            }
                            {courseItem.isRegistered &&
                                <Link className="ninetalk-btn CourseItemGrid_joinBtn CourseItemGrid_free"
                                    to={UrlHelpers.createLearningUrl(courseItem.slug, courseItem.id)}>{'Học tiếp'}</Link>
                            }
                            {!courseItem.isRegistered &&
                                // <Link className="ninetalk-btn CourseItemGrid_joinBtn CourseItemGrid_free" to={courseDetailPath}>{'Tùy tâm'}</Link>
                                <Link className="ninetalk-btn CourseItemGrid_joinBtn CourseItemGrid_free" to={courseDetailPath}>{courseItem.price ? `${NumberHelpers.toDefautFormat(courseItem.price)} đ` : 'Tùy tâm'}</Link>
                            }
                        </li>
                    </ul>
                    <div className="CourseItemGrid_progressBar"></div>
                </div>
            </div>
        );
    }
}

class CourseGridItem2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseItem: props.data
        };

        this.getThumbImage = this.getThumbImage.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            courseItem: nextProps.data
        });
    }

    getThumbImage() {
        var { introVideo, thumbnailImage } = this.state.courseItem;
        return thumbnailImage;
    }

    render() {
        let { courseItem } = this.state;
        const courseDetailPath = UrlHelpers.createCourseDetailUrl(courseItem.slug, courseItem.id);
        let discount = courseItem.originPrice - courseItem.price;
        return (
            <div className='course-item-wrapper mb-3'>
                <div className='thumb'>
                    <img src={courseItem.thumbnailImage} alt={courseItem.name} className='thumb-img' />
                    <div className='thumb-overlay'>
                        <div className='thumb-overlay-tag'>
                            {courseItem.category?.name}
                        </div>
                        <Link to={courseDetailPath} className='tc_preview_course'>Preview Course</Link>
                    </div>
                </div>
                <div className='course-item-detail'>
                    <div className='course-item-detail-wrapper'>
                        <p className='mb-1'>{courseItem.category?.name}</p>
                        <Link to={courseDetailPath}>
                            <h5 className='course-item-title'>
                                {courseItem.name}
                            </h5>
                        </Link>
                        {!string_isNullOrEmpty(courseItem.authorName) &&
                            <p className='mb-1'><em>Tác giả: {courseItem.authorName}</em></p>
                        }
                        <p className='course-item-description' dangerouslySetInnerHTML={{ __html: courseItem.description }}>
                        </p>
                    </div>
                </div>
                <div className='course-item-footer'>
                    <ul>
                        <li>
                            <FontAwesomeIcon icon={allIcon.faUserAlt} />
                        </li>
                        <li>
                            {courseItem.registered}
                        </li>
                        {courseItem.totalRate > 0 &&
                            <li><FontAwesomeIcon icon={allIcon.faStar} style={{ color: 'gold' }} /> {Math.round(courseItem.totalStar / courseItem.totalRate * 10) / 10} ({NumberHelpers.toDefautFormat(courseItem.totalRate)} đánh giá)</li>
                        }
                    </ul>
                    <div>
                    </div>
                </div>
            </div>
        );
    }
}

export { CourseGridItem, CourseGridItem2 };
