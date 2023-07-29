import { useState } from "react";
import { useEffect } from "react";
import { contentPageService } from "../services";
import { HomeFeatured, HomeBanner, HomeCallToAction, HomeShortFeature } from "./index";

const ContentPage = ({ id }) => {
    window.gtag('event', 'page_view', {
        page_location: window.location
    })

    let [pageData, setPageData] = useState()

    useEffect(() => {
        contentPageService.getPage(id)
            .then(res => {
                if (res.isSuccess) {
                    setPageData(res.data)
                }
            })
    }, [])

    useEffect(() => {
        document.body.classList.add('home');
        return () => {
            document.body.classList.remove('home');
        };
    }, [])

    return (
        <div>
            {pageData?.openNew ?
                <div className="Home_wrapper ck-content" dangerouslySetInnerHTML={{ __html: pageData?.content }}>
                </div> :
                <div className="Home_wrapper">
                    {/* <div className="Header_themeMenuWrapper">
                        <div className="Header_infoWrapper">
                            <div className="Header_infoContent"> */}
                                <HomeBanner />
                            {/* </div>
                        </div>
                        <div className="Header_overlay"></div>
                    </div> */}
                    <div id="content-page" className="container ck-content" dangerouslySetInnerHTML={{ __html: pageData?.content }}>
                    </div>
                </div>
            }
        </div>
    )
}

export { ContentPage }