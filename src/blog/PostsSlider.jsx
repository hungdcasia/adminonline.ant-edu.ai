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

const PostsSlider = ({ }) => {
    const { data: categoriesResult } = useQuery("blog-categories", () => postService.getCategories(), { staleTime: 600000 });
    const categories = categoriesResult?.data ?? []

    let page = 1
    const { data: postsResult } = useQuery(["posts-slider", page], () => getPosts());
    const posts = postsResult?.data?.items ?? []
    const total = postsResult?.data?.total ?? 0

    let pageSize = 5

    const getPosts = () => {
        let pagingOptions = {
            page: 1,
            pageSize: pageSize
        }

        let filterOptions = [{ field: 'active', operator: '==', value: 'true' }]
        let sortOptions = { sort: 'createdTime', direction: 'desc' }
        return postService.filter(pagingOptions, filterOptions, sortOptions)
    }

    return (
        <div className='post-slider w-100' >
            <div className='w-100'>
                <Carousel showArrows={true} showThumbs={false} showIndicators={false} showStatus={false}>
                    {posts.map(post => {
                        let category = categories.find(r => r.id == post.categoryId)
                        return (
                            <div key={post.id} className='overflow-hidden'>
                                <img src={post.thumbnail} height='400' />
                                <div className='w-100 position-relative' style={{ marginTop: '-100px', height: '100px' }}>
                                    <div className='position-absolute top-0 w-100 h-100 bg-black opacity-50'></div>
                                    <div className='position-absolute top-0 w-100 h-100 text-white text-left px-3 pt-2'>
                                        <div className='post-title'>
                                            <Link to={`/books/post/${post.id}/${post.slug}`}>
                                                <h4>{post.title}</h4>
                                            </Link>
                                        </div>
                                        <div className='text-gray opacity-75' style={{ fontSize: '13px' }}>
                                            <span><FontAwesomeIcon icon={allIcon.faClock} /> <Moment unix format='DD-MM-yyyy'>{post.createdTime / 1000}</Moment></span>
                                            <br />
                                            <span><FontAwesomeIcon icon={allIcon.faFolder} /> <Link className='blog-breadcum-link' to={`/books/cat/${post.categoryId}/${category?.slug}`}>{category?.name}</Link></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    }
                </Carousel>
            </div>
        </div>
    )
}

export { PostsSlider }