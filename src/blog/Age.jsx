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

let bgPost = "/assets/images/book-banner.png"

const AgeList = [
    { code: '0-18th', name: '0 - 18 tháng' },
    { code: '18th-3', name: '18 tháng - 3 tuổi' },
    { code: '3-6', name: '3 - 6 tuổi' },
    { code: '6-9', name: '6 - 9 tuổi' },
    { code: '9-12', name: '9 - 12 tuổi' },
    { code: '12-16', name: '12 - 16 tuổi' },
    { code: '16+', name: 'Trên 16 tuổi' },
]

const AgeFilter = ({ }) => {
    let { code, slug } = useParams();
    const { data: categoriesResult } = useQuery("blog-categories", () => postService.getCategories(), { staleTime: 600000 });
    const categories = categoriesResult?.data ?? []

    const [page] = useQueryParam('page', withDefault(NumberParam, 1))
    const { data: postsResult } = useQuery(["posts", page, code], () => getPosts());
    const posts = postsResult?.data?.items ?? []
    const total = postsResult?.data?.total ?? 0

    let pageSize = 12
    let pageCount = Math.ceil(total / pageSize);
    const getPosts = () => {
        let pagingOptions = {
            page: page,
            pageSize: pageSize
        }

        let filterOptions = [{ field: 'active', operator: '==', value: 'true' }, { field: 'age', operator: '==', value: code }]
        let sortOptions = { sort: 'createdTime', direction: 'desc' }
        return postService.filter(pagingOptions, filterOptions, sortOptions)
    }

    return (
        <div id='blog'>
            <section className="section-1 position-relative">
                <img src={bgPost} className="w-100" />
                <div className='position-absolute w-100 h-100 top-0 bg-black opacity-30'></div>
                <div className='position-absolute w-100' style={{ top: '50%' }}>
                    <div className="container">
                        <div className="row text-white">
                            <h2 className="text-uppercase w-100">ĐỌC SÁCH</h2>
                            <div className="w-100 mt-2 text-white" style={{ fontSize: '14px' }}>
                                <span className=''><Link className='blog-breadcum-link' to='/books/'>Sách</Link></span>
                                <span className='ml-4'><FontAwesomeIcon icon={allIcon.faAngleDoubleRight} /></span>
                                <span className='ml-4'><Link className='blog-breadcum-link' to={`/books/age/${code}`}>{AgeList.find(r => r.code == code)?.name}</Link></span>
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

const AgeListPage = () => {
    let { code, slug } = useParams();
    return (
        <div className='row mt-4'>
            <div className='w-100 pt-3 pb-1 px-2 border-bottom'>
                <h4><FontAwesomeIcon className='text-orange' icon={allIcon.faList} /> Độ tuổi</h4>
            </div>
            <div className='col-12 mt-1'>
                {AgeList.map(r =>
                    <div className='row overflow-hidden' style={{ minHeight: '40px' }}>
                        <CatItem item={r} key={r.code} currentCode={code} />
                    </div>
                )}
            </div>
        </div>
    )
}

const CatItem = ({ item, currentCode }) => {
    return (
        <div style={{ height: '40px' }} className={`cat-item w-100`}>
            <Link className={`h-100 d-block`} to={`/books/age/${item.code}`}>
                <span className={`cat-item-link text-left px-2 d-block h-100 pt-2 ${item.code == currentCode ? "active" : ""}`} style={{ height: '40px' }}>{item?.name}</span>
            </Link>
        </div>
    )
}

export { AgeListPage, AgeFilter }