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
// import bgPost from "../assets/images/book-banner.png";
import { PostDaily } from "./PostDaily";
import { PostRelate } from "./PostRelate";

let bgPost = "/assets/images/book-banner.png"
const PostDetail = ({ }) => {
    let { id, slug } = useParams();
    const { data: categoriesResult } = useQuery("blog-categories", () => postService.getCategories(), { staleTime: 600000 });
    const categories = categoriesResult?.data ?? []

    const { data: postDetailResult, isSuccess } = useQuery(["post-detail", id], () => postService.detail(id));
    const post = postDetailResult?.data ?? {}

    let category = categories.find(r => r.id == post?.categoryId)

    return (
        <div id='post'>
            <section className="section-1 position-relative">
                <img src={bgPost} className="w-100" alt={post.title} />
                <div className='position-absolute w-100 h-100 top-0 bg-black opacity-30'></div>
                <div className='position-absolute w-100' style={{ top: '50%' }}>
                    <div className="container">
                        <div className="row text-white">
                            <h2 className="text-uppercase w-100">{post.title}</h2>
                            <div className="w-100 mt-2">
                                <span><FontAwesomeIcon icon={allIcon.faClock} /> <Moment unix format='DD-MM-yyyy'>{post.createdTime / 1000}</Moment></span>
                                <span className='ml-5'><FontAwesomeIcon icon={allIcon.faEye} /> {NumberHelpers.toDefautFormat(post.views ?? 0)} lượt xem</span>
                            </div>
                            <div className="w-100 mt-2 text-white" style={{ fontSize: '14px' }}>
                                <span className=''><Link className='blog-breadcum-link' to='/books/'>Sách</Link></span>
                                <span className='ml-4'><FontAwesomeIcon icon={allIcon.faAngleDoubleRight} /></span>
                                <span className='ml-4'><Link className='blog-breadcum-link' to={`/books/cat/${post?.categoryId}/${category?.slug}`}>{category?.name}</Link></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='section-2'>
                <div className='container pb-5'>
                    <div className='row mt-2'>
                        <div className='col-8 pl-0'>
                            <div className='row py-3 px-3 rounded-lg'>
                                <div className='ck-content' dangerouslySetInnerHTML={{ __html: post.content }}>

                                </div>
                                <div className='text-right font-italic'>
                                    Tác giả: {post.author}
                                </div>
                            </div>
                        </div>
                        <div className='col-4'>
                            <PostDaily />
                        </div>
                    </div>

                    <div className='row mt-2'>
                        <div className='col-12 pl-0'>
                            {isSuccess &&
                                <PostRelate post={post} />
                            }
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export { PostDetail }