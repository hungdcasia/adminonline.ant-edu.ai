import { useState, useEffect } from "react";
import { CourseGridItem } from "../courses";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import configs from "../configs.json";
import { useSelector } from "react-redux";
import { bannerService } from "../services";
import { useQuery } from "react-query";
import { Carousel } from "react-responsive-carousel";
import { UrlHelpers } from "../helpers";

const HomeBanner = (props) => {
    let authentication = useSelector(r => r.authentication)
    let { loggedIn } = authentication;

    const { data: bannersResult, isFetching } = useQuery(['banners'], () => { return bannerService.getAll() }, { staleTime: 60000000 })
    let banners = bannersResult?.data ?? [];

    useEffect(() => {
        document.body.classList.add('home');
        return () => {
            document.body.classList.remove('home');
        };
    }, [])

    if (banners.filter(r => r.active).length == 0) {
        return (
            <section className="Header_themeMenuWrapper">
                <div className="Header_overlay"></div>
                <div className="Header_infoWrapper">
                    <div className="Header_infoContent">
                        <section className="container">
                            <section className="row">
                                <section className="col-md-12 col-lg-8 text-left">
                                    <h1 className="text-uppercase d-none d-sm-block">{configs.caption}</h1>
                                    <div className="h2 text-uppercase font-weight-bold d-block d-sm-none">{configs.caption}</div>
                                    <div className="Header_btnWrapper">
                                        <Link to="/courses" className='btn btn-default border-0 rounded-pill h3 text-uppercase px-4' style={{ minWidth: '240px' }}>
                                            Khóa học
                                        </Link>
                                        <div className='w-10px d-none d-sm-inline-block'></div>
                                        {!loggedIn &&
                                            <Link to="/login" className='px-4 btn btn-default border-0 rounded-pill h3 text-uppercase' style={{ minWidth: '240px' }}>Tham gia ngay</Link>
                                        }
                                    </div>
                                </section>
                            </section>
                        </section>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <Carousel showArrows={true} showThumbs={false} showIndicators={true} showStatus={false} autoPlay={true} infiniteLoop>
            {banners.filter(r => r.active).map(item => (
                <HomeBannerItem banner={item} />
            ))}
        </Carousel>
    )
}

const HomeBannerItem = ({ banner, blockClick }) => {
    return (
        <section className="Header_themeMenuWrapper" style={{ backgroundImage: `url(${banner.image})` }}>
            <div className="Header_overlay" style={{ background: banner.overlayColor }}></div>
            <div className="Header_infoWrapper">
                <div className="Header_infoContent">
                    <section className="container">
                        <section className="row">
                            <section className="col-md-12 col-lg-8 text-left">
                                <h1 className="text-uppercase d-none d-sm-block mb-1" style={{ color: banner.titleColor }}>{banner.title}</h1>
                                <div className="h2 text-uppercase font-weight-bold d-none d-sm-block" style={{ color: banner.descriptionColor }}>{banner.description}</div>
                                <div className="Header_btnWrapper">
                                    {UrlHelpers.isAbsoluteUrl(banner.link) ?
                                        <a href={banner.link}
                                            className={`btn btn-default border-0 rounded-pill h3 text-uppercase px-4 ${blockClick && 'pointer-events-none'}`}
                                            style={{ minWidth: '240px', background: banner.buttonColor, color: banner.buttonTitleColor }}>{banner.buttonTitle}</a> :
                                        <Link to={banner.link}
                                            className={`btn btn-default border-0 rounded-pill h3 text-uppercase px-4 ${blockClick && 'pointer-events-none'}`}
                                            style={{ minWidth: '240px', background: banner.buttonColor, color: banner.buttonTitleColor }}>
                                            {banner.buttonTitle}
                                        </Link>
                                    }
                                    <div className='w-10px d-none d-sm-inline-block'></div>
                                </div>
                            </section>
                        </section>
                    </section>
                </div>
            </div>
        </section>)
}
export { HomeBanner, HomeBannerItem };