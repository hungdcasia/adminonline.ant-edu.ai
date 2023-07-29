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
import { CategoriesList } from "./CategoriesList";
import { Category } from "./Category";
import { PostDetail } from "./PostDetail";
import { PostItem } from "./PostItem";
import { NoData } from "../shared";
import { AgeFilter, AgeListPage } from "./Age";
let bgPost = "/assets/images/book-banner.png"
const Blog = () => {
    const queryClient = useQueryClient()
    const { data: categoriesResult } = useQuery("blog-categories", () => postService.getCategories(), { staleTime: 600000 });
    useEffect(() => {
        return () => {
            queryClient.removeQueries('blog-categories')
        }
    }, [])

    useEffect(() => {
        document.body.classList.add('home');
        return () => {
            document.body.classList.remove('home');
        };
    }, [])

    return (
        <Switch>
            <Route path='/books' exact component={BlogMain} />
            <Route path='/books/post/:id/:slug' exact component={PostDetail} />
            <Route path='/books/cat/:id/:slug' exact component={Category} />
            <Route path='/books/age/:code' exact component={AgeFilter} />
        </Switch>
    )
}

const BlogMain = () => {
    const { data: categoriesResult } = useQuery("blog-categories", () => postService.getCategories(), { staleTime: 600000 });
    const categories = categoriesResult?.data ?? []

    const [page] = useQueryParam('page', withDefault(NumberParam, 1))
    const { data: postsResult } = useQuery(["posts", page], () => getPosts());
    const posts = postsResult?.data?.items ?? []
    const total = postsResult?.data?.total ?? 0

    let pageSize = 12
    let pageCount = Math.ceil(total / pageSize);
    const getPosts = () => {
        let pagingOptions = {
            page: page,
            pageSize: pageSize
        }

        let filterOptions = [{ field: 'active', operator: '==', value: 'true' }]
        let sortOptions = { sort: 'createdTime', direction: 'desc' }
        return postService.filter(pagingOptions, filterOptions, sortOptions)
    }

    return (
        <div id='blog'>
            <section className="section-1 position-relative">
                <img src={bgPost} className="w-100" alt='blog' />
                <div className='position-absolute w-100 h-100 top-0 bg-black opacity-30'></div>
                <div className='position-absolute w-100' style={{ top: '50%' }}>
                    <div className="container">
                        <div className="row text-white">
                            <h2 className="text-uppercase w-100">ĐỌC SÁCH</h2>
                            {/* <p className='h5 text-justify'>Chia sẻ kinh nghiệm và phát triển cá nhân</p> */}
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
                                <CPagination pages={pageCount}
                                    activePage={page}
                                    hidden={pageCount < 2}
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

export { Blog }