import { useQuery, useQueryClient } from "react-query";
import { postService } from "../services/post.service";
import { useQueryParam, NumberParam, StringParam, withDefault } from 'use-query-params';
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { Link, Route, Switch, useParams } from "react-router-dom";
import Moment from 'react-moment';
import moment from 'moment';
import { history, NumberHelpers } from "../helpers";
import { CPagination } from "@coreui/react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const PostItem = ({ post, category }) => {
    return (
        <div className='col-12 pt-2 px-0'>
            <div className='w-100 h-100 overflow-hidden rounded-lg row'>
                <div className='col-3 pl-0' style={{ height: '200px', borderBottom: '0px solid red' }}>
                    <img className='w-100 h-100' src={post.thumbnail} style={{ objectFit: 'contain' }} />
                </div>
                <div className='col-9 mt-0 px-0'>
                    <div className='w-100 pt-1' style={{ fontSize: '12px' }}>
                        <span className='text-white py-1 px-3 ml-0 rounded bg-orange'>
                            <Link className='blog-breadcum-link' to={`/books/cat/${post.categoryId}/${category?.slug}`}>{category?.name}</Link>
                        </span>
                    </div>
                    <div className='post-title mt-2'>
                        <Link to={`/books/post/${post.id}/${post.slug}`}>
                            <h5>{post.title}</h5>
                        </Link>
                    </div>
                    <div className='my-2'>
                        <span>{post.description}</span>
                    </div>
                    <div className='text-gray opacity-75' style={{ fontSize: '13px' }}>
                        {/* <span><FontAwesomeIcon icon={allIcon.faClock} /> <Moment unix format='DD-MM-yyyy'>{post.createdTime / 1000}</Moment></span> */}
                        <span className=''><FontAwesomeIcon icon={allIcon.faEye} /> {NumberHelpers.toDefautFormat(post.views ?? 0)} lượt xem</span>
                    </div>
                    <div className='post-title float-right'>
                        <Link to={`/books/post/${post.id}/${post.slug}`}>
                            <em><h6>Đọc tiếp &gt;&gt;&gt;</h6></em>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { PostItem }