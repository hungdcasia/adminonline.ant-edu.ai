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

const PostDaily = ({ }) => {

    const { data: categoriesResult } = useQuery("blog-categories", () => postService.getCategories(), { staleTime: 600000 });
    const categories = categoriesResult?.data ?? []

    let page = 1
    const { data: postsResult } = useQuery(["posts-daily", page], () => getPosts());
    const posts = postsResult?.data?.items ?? []
    const total = postsResult?.data?.total ?? 0

    let pageSize = 15

    const getPosts = () => {
        let pagingOptions = {
            page: 1,
            pageSize: pageSize
        }

        let filterOptions = [{ field: 'active', operator: '==', value: 'true' }, { field: 'hot', operator: '==', value: 'true' }]
        let sortOptions = { sort: 'createdTime', direction: 'desc' }
        return postService.filter(pagingOptions, filterOptions, sortOptions)
    }

    return (
        <div className='row w-100'>
            <div className='w-100 pt-3 pb-1 px-2 border-bottom'>
                <h4><FontAwesomeIcon className='text-orange' icon={allIcon.faCoffee} /> Đọc gì hôm nay</h4>
            </div>
            <div className='w-100'>
                <div className='position-relative overflow-auto w-100 list-post'>
                    {posts.map(post => {
                        return (
                            <div key={post.id} className='w-100 px-2 py-1' style={{ minHeight: '90px' }}>
                                <div className='position-relative'>
                                    <div style={{ width: '80px', height: '80px' }} className='position-absolute top-0'>
                                        <img height='80' width='80' src={post.thumbnail} className='overflow-hidden rounded-lg' style={{ objectFit: 'contain' }} />
                                    </div>
                                    <div className='pl-1 post-title' style={{ marginLeft: '80px' }}>
                                        <Link to={`/books/post/${post.id}/${post.slug}`}>
                                            <h5>{post.title}</h5>
                                        </Link>
                                        <span style={{ fontSize: '13px' }} className='text-dark d-block'><FontAwesomeIcon className='text-orange' icon={allIcon.faEye} /> {NumberHelpers.toDefautFormat(post.views ?? 0)} lượt xem</span>
                                        <span style={{ fontSize: '13px' }} className='text-dark'><FontAwesomeIcon icon={allIcon.faClock} /> <Moment unix format='DD-MM-yyyy'>{post.createdTime / 1000}</Moment></span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div >
    )
}

export { PostDaily }