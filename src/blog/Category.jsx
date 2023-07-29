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
import { PostItem } from "./PostItem";
import { PostDaily } from "./PostDaily";
import { CategoriesList } from "./CategoriesList";
import { NoData } from "../shared";
import { AgeListPage } from "./Age";
let bgPost = "/assets/images/book-banner.png"
const Category = ({ }) => {
    let { id, slug } = useParams();
    const { data: categoriesResult } = useQuery("blog-categories", () => postService.getCategories(), { staleTime: 600000 });
    const categories = categoriesResult?.data ?? []
    let category = categories.find(r => r.id == id)

    const [page] = useQueryParam('page', withDefault(NumberParam, 1))
    const { data: postsResult } = useQuery(["posts", page, id], () => getPosts());
    const posts = postsResult?.data?.items ?? []
    const total = postsResult?.data?.total ?? 0

    let pageSize = 12
    let pageCount = Math.ceil(total / pageSize);
    const getPosts = () => {
        let pagingOptions = {
            page: page,
            pageSize: pageSize
        }

        let filterOptions = [{ field: 'active', operator: '==', value: 'true' }, { field: 'categoryId', operator: '==', value: id }]
        let sortOptions = { sort: 'createdTime', direction: 'desc' }
        return postService.filter(pagingOptions, filterOptions, sortOptions)
    }

    return (
        <div id='blog'>
            <section className="section-1 position-relative">
                <img src={bgPost} className="w-100" alt={category?.name} />
                <div className='position-absolute w-100 h-100 top-0 bg-black opacity-30'></div>
                <div className='position-absolute w-100' style={{ top: '50%' }}>
                    <div className="container">
                        <div className="row text-white">
                            <h2 className="text-uppercase w-100">{category?.name}</h2>
                            <div className="w-100 mt-2 text-white" style={{ fontSize: '14px' }}>
                                <span className=''><Link className='blog-breadcum-link' to='/books/'>Sách</Link></span>
                                <span className='ml-4'><FontAwesomeIcon icon={allIcon.faAngleDoubleRight} /></span>
                                <span className='ml-4'><Link className='blog-breadcum-link' to={`/books/cat/${id}/${category?.slug}`}>{category?.name}</Link></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='section-2'>
                <div className='container pb-5'>
                    {/* <CategoriesList /> */}
                    <div className='row mt-2'>

                        <div className='col-8'>
                            <div className='row mt-3 d-flex flex-wrap'>
                                {posts.length == 0 &&
                                    <NoData message='Chưa có bài viết. Bạn vui lòng quay lại sau.' />
                                }

                                {posts.map(post => (
                                    <PostItem key={post.id} post={post} category={categories.find(r => r.id == post.categoryId)} />
                                ))}
                            </div>
                            <div className='row d-flex justify-content-center mt-3'>
                                <CPagination pages={pageCount} activePage={page} hidden={pageCount < 2}
                                    onActivePageChange={(page) => {
                                        if (page == 0) return
                                        history.push(`?page=${page > 1 ? page : 1}`);
                                    }}></CPagination>
                            </div>
                        </div>

                        <div className='col-4 d-flex flex-column'>
                            <PostDaily />
                            <CategoriesList />
                            <AgeListPage />
                        </div>

                    </div>
                </div>
            </section>
        </div>
    )
}

export { Category }