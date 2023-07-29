import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import * as allIcon from '@fortawesome/free-solid-svg-icons';

const CourseWillLearn = ({ course }) => {

    let { contents } = course;
    return (
        <div className="CourseDetail_topicList">
            {(contents && contents.filter((item) => { return item.type == 'willlearn'; }).length > 0) &&
                <>
                    <h3>Bạn sẽ học được gì</h3>
                    <section className="row">
                        <section className="col-md-12 col-lg-12">
                            <ul className="CourseDetail_list undefined">
                                {contents && contents.filter((item) => { return item.type == 'willlearn'; }).map(item =>
                                    <li key={item.id}>
                                        <FontAwesomeIcon icon={allIcon.faCheck} className="fa-w-16 CourseDetail_icon" />
                                        <span>{item.content}</span>
                                    </li>
                                )}
                            </ul>
                        </section>
                    </section>
                </>
            }
        </div>
    )
}

export { CourseWillLearn };