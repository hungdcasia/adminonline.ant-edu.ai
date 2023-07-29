import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import * as allIconBrand from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { NumberHelpers } from "../helpers/index";
import { courseService } from "../services";
import Moment from 'react-moment';
import moment from 'moment';

class LessonNote extends Component {
    constructor(props) {
        super(props);
        let { courseData, courseId, lessonId } = this.props;
        this.state = {
        };
    }

    render() {
        return (
            <React.Fragment>
                
                    <div id="create-note-zone">
                        <div className="Note_create">
                            <div className="Note_createBtn">Tạo ghi chú tại 00:00</div>
                        </div>
                    </div>
                    <div className="Note_separator"></div>
                    <ul className="Note_list">
                        <select className="Note_selectable">
                            <option value="all">Trong tất cả bài học</option>
                            <option value="lesson">Trong bài học này</option>
                            <option value="chapter">Trong phần này  (Giới thiệu)</option>
                        </select>
                        <li className="Note_item">
                            <div className="Note_itemHead">
                                <div className="Note_itemTime">00:00</div>
                                <div className="Note_titleWrap">
                                    <div className="Note_itemTitle">Làm được gì sau khóa học?</div>
                                    <div className="Note_itemDesc">Giới thiệu</div>
                                </div>
                                <div className="Note_itemCtrl">
                                    <div className="Note_itemCtrlBtn">
                                        <FontAwesomeIcon icon={allIcon.faTrash} className="fa-w-14" />
                                    </div>
                                </div>
                            </div>
                            <div className="Note_itemContent">
                                <p>fffe</p>
                            </div>
                        </li>
                    </ul>
            </React.Fragment>
        )
    }
}

export { LessonNote }