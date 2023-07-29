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

const CategoriesList = () => {

    let { id, slug } = useParams();

    const { data: categoriesResult } = useQuery("blog-categories", () => postService.getCategories(), { staleTime: 600000 });
    const categories = categoriesResult?.data ?? []
    return (
        <div className='row mt-4'>
            <div className='w-100 pt-3 pb-1 px-2 border-bottom'>
                <h4><FontAwesomeIcon className='text-orange' icon={allIcon.faList} /> Thể loại sách</h4>
            </div>
            <div className='col-12 mt-1'>
                {categories.map(r =>
                    <div className='row overflow-hidden' style={{ minHeight: '40px' }}>
                        <CatItem category={r} key={r.id} currentId={id} />
                    </div>
                )}
            </div>
        </div>
    )
}

const CatItem = ({ category, currentId }) => {
    return (
        <div style={{ height: '40px' }} className={`cat-item w-100`}>
            <Link className={`h-100 d-block`} to={`/books/cat/${category.id}/${category?.slug}`}>
                <span className={`cat-item-link text-left px-2 d-block h-100 pt-2 ${category.id == currentId ? "active" : ""}`} style={{ height: '40px' }}>{category?.name}</span>
            </Link>
        </div>
    )
}

export { CategoriesList }