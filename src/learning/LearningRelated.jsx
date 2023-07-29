import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import * as allIconBrand from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { NumberHelpers } from "../helpers/index";
import { courseService } from "../services";
import Moment from 'react-moment';
import moment from 'moment';

class LearningRelated extends Component {
    constructor(props) {
        super(props);
        let { courseData, courseId, lessonId } = this.props;
        this.state = {
        };
    }

    render() {
        return (
            <div className="Learning_notRelatedMsg">Chưa có nội dung liên quan cho bài học này. <span>Đề xuất giúp Ant Edu!</span></div>
        )
    }
}

export { LearningRelated }