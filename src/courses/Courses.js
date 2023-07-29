import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink, useParams } from "react-router-dom";
import { NoData } from "../shared";
import { CourseGridItem, CourseGridItem2 } from './CourseGridItem';
import { courseService } from "../services/index";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { connect } from 'react-redux';
import { history } from '../helpers';

const FILTER_TYPE = {
    NEWEST: 'all',
    FEATURED: 'featured',
    HOT: 'hot',
    CATEGORY: 'categories',
    TEACHER: 'teacher',
    SEARCH: 'search'
}

const SHORT_TYPE = {
    Default: "default",
    Name: "name",
    Newest: "newest",
    PriceASC: "price-asc",
    PriceDESC: "price-desc",
}

const SHORT_FUNC = {
    "default": (a, b) => { return 1; },
    "name": (a, b) => { return a.name.localeCompare(b.name); },
    "newest": (a, b) => { return -a.id + b.id; },
    "price-asc": (a, b) => { return a.price - b.price; },
    "price-desc": (a, b) => { return -a.price + b.price; },
}

const Courses = () => {
    let { filterType, id: catId, name } = useParams()
    let [courses, setCourses] = useState([])
    let [categories, setCategories] = useState([])
    let [teachers, setTeachers] = useState([])
    let [sortType, setSortType] = useState(SHORT_TYPE.default)

    filterType = filterType ?? 'all'

    const sortTypeChanged = (e) => {
        setSortType(e.target.value);
    }

    const getCourses = () => {
        let promise;
        switch (filterType) {
            case FILTER_TYPE.NEWEST:
                promise = courseService.getCoursesNewest();
                break;
            case FILTER_TYPE.HOT:
                promise = courseService.getCoursesHot();
                break;
            case FILTER_TYPE.FEATURED:
                promise = courseService.getCoursesFeatured();
                break;
            case FILTER_TYPE.CATEGORY:
                promise = courseService.getCoursesByCategory(catId);
                break;
            case FILTER_TYPE.TEACHER:
                promise = courseService.getCoursesByTeacher(name);
                break;
            case FILTER_TYPE.SEARCH:
                promise = courseService.getCoursesByKeyword(name);
                break;
        }

        promise
            .then(
                res => {
                    setCourses(res.data);
                },
                error => {
                }
            );
    }

    const getCategories = () => {
        courseService.getCategories()
            .then(res => {
                setCategories(res.data)
            })
    }

    const getTeachers = () => {
        courseService.getTeachers()
            .then(res => {
                setTeachers(res.data)
            })
    }

    useEffect(getCategories, [])
    useEffect(getTeachers, [])

    useEffect(() => {
        getCourses()
    }, [filterType, catId, name])

    let sortedCourses = [...courses].sort(SHORT_FUNC[sortType]);

    return (
        <section className="App_wrapper">
            <section className="container App_appContainer">
                <section className="row" style={{ marginTop: 15 }}>
                    <section className="col-lg-3 CourseSideBar_wrapper">
                        <div className="CourseSideBar_courseSidebarList mb-3">
                            {/* <Search /> */}
                        </div>

                        <div className="CourseSideBar_courseSidebarList">
                            <h6 className={filterType == FILTER_TYPE.NEWEST ? "CourseMenu_active" : ''}
                                style={{ cursor: 'pointer' }}
                                onClick={() => history.push('/courses')}>
                                Tất cả
                            </h6>
                        </div>
                        <div className="CourseSideBar_courseSidebarList">
                            <h6 className={filterType == FILTER_TYPE.HOT ? "CourseMenu_active" : ''}
                                style={{ cursor: 'pointer' }}
                                onClick={() => history.push('/courses/hot')}>
                                Hot
                            </h6>
                        </div>
                        <div className="CourseSideBar_courseSidebarList">
                            <h6 className={filterType == FILTER_TYPE.FEATURED ? "CourseMenu_active" : ''}
                                style={{ cursor: 'pointer' }}
                                onClick={() => history.push('/courses/featured')}>
                                Nổi bật
                            </h6>
                        </div>

                        {categories.filter(r => r.level == 0).map(item =>
                            <CategoryGroup key={item.id}
                                item={item}
                                categories={categories.filter(r => r.parent == item.id)}
                                currentCatId={catId}
                            />
                        )}

                        {teachers.length > 0 &&
                            <div className="CourseSideBar_courseSidebarList">
                                <h6>Giảng viên</h6>
                                <ul>
                                    {teachers.map(item =>
                                        <li>
                                            <Link
                                                className={item == name ? 'CourseSideBar_active' : ''}
                                                to={"/courses/teacher/" + item}>{item}</Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        }

                    </section>
                    <section className="col-lg-9 p-0">
                        <div className="CourseMenu_wrapper row mb-3">
                            <div className='col-12'>
                                <div className='col-lg-6 p-0'>
                                    <Search />
                                </div>
                                {/* <ul className="visibleDesktop">
                                    <li><Link aria-current={filterType == FILTER_TYPE.NEWEST && 'page'} to="/courses" className={filterType == FILTER_TYPE.NEWEST ? "CourseMenu_active" : ''}>Tất cả</Link></li>
                                    <li><Link aria-current={filterType == FILTER_TYPE.HOT && 'page'} to="/courses/hot" className={filterType == FILTER_TYPE.HOT ? "CourseMenu_active" : ''}>Hot</Link></li>
                                    <li><Link aria-current={filterType == FILTER_TYPE.FEATURED && 'page'} className={filterType == FILTER_TYPE.FEATURED ? "CourseMenu_active" : ''} to="/courses/featured">Nổi bật</Link></li>
                                </ul> */}
                                <div className="visibleDesktop CourseMenu_Sort pr-3">
                                    <label className="select" for="slct">
                                        <select value={sortType} onChange={sortTypeChanged}>
                                            <option value="default">Sắp xếp</option>
                                            <option value="name">A-Z</option>
                                            <option value="newest">Mới nhất</option>
                                            <option value="price-asc">Giá thấp - cao</option>
                                            <option value="price-desc">Giá cao - thấp</option>
                                        </select>
                                        <FontAwesomeIcon icon={allIcon.faChevronDown} className='sprites' transform={{ size: 11 }} />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <section className="row">
                            {sortedCourses.length == 0 &&
                                <NoData message='Hiện chưa có khóa học. Bạn vui lòng quay lại sau.' />
                            }
                            {sortedCourses.map(item =>
                                <section key={item.id} className="col-sm-12 col-md-6 col-lg-4 Category_courseItem">
                                    <CourseGridItem2 data={item} />
                                </section>
                            )}
                        </section>
                    </section>
                </section>
            </section>
        </section>
    )
}

const CategoryGroup = props => {
    return (
        <div className="CourseSideBar_courseSidebarList">
            <h6>{props.item.name}</h6>
            {props.categories.length > 0 &&
                <ul>
                    {props.categories.map(item =>
                        <CategoryItem key={item.id}
                            item={item}
                            currentCatId={props.currentCatId}
                        />
                    )}
                </ul>
            }
        </div>
    );
}

const CategoryItem = props => {
    let item = props.item;
    let className = 'CourseSideBar_active'
    return (
        <li>
            <Link
                className={props.currentCatId == item.id ? className : ''}
                to={"/courses/categories/" + item.slug + "/" + item.id}>{item.name}</Link>
        </li>
    );
}

const Search = ({ }) => {

    let { filterType, id: catId, name } = useParams()
    let [keyword, setKeyword] = useState("")

    const onSearchClick = () => {
        history.push('/courses/search/' + keyword.trim())
    }

    const handleEnter = (event) => {
        if (event.key.toLowerCase() === "enter") {
            onSearchClick()
            event.preventDefault();
        }
    };

    return (
        <div className="position-relative">
            <input type="text" className="form-control" placeholder="Nhập tên giáo viên hoặc khóa học bạn cần tìm"
                onKeyDown={handleEnter}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)} />
            <btn className="btn btn-outline-dark border-0 position-absolute pr-3 py-2 top-0 right-0" onClick={onSearchClick}>
                <FontAwesomeIcon icon={allIcon.faSearch} />
            </btn>
        </div>
    )
}

export { Courses }