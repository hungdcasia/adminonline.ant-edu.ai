import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import throttle from "lodash.throttle"

const reviewData = [
    { author: 'Mẹ Ngân Nguyễn', content: 'Trước đây mình khá stress vì nghĩ mình chưa có kiến thức dạy con, sợ rằng dạy con theo bản năng sẽ không ổn. Rất may vì học được những điều hay từ Thầy Quân, nên cũng dần dần hiểu và áp dụng, thấy tự tin rằng con đường mình đang đi là đúng, không còn lo lắng như trước nữa.' },
    { author: 'Mẹ Nga Tĩnh Lặng', content: 'Em chân thành cám ơn thầy Trần Việt Quân, Thầy Dương Quang Minh, và nhóm cộng sự BKE. Đã làm thay đổi một con người, đã đánh thức ý nghĩa cuộc đời em, em đã lan tỏa được ý nghĩa và giá trị khóa học dạy con từ nền tảng cốt lõi đến nhiều người.' },
    { author: 'Mẹ Bùi Hồng Phượng', content: 'Thật may là mình đã "vớ" được Thầy Quân thật đúng lúc. Nhờ thầy mà mình thấy mình mới chỉ dạy con thôi, còn rèn con thì vẫn chưa đủ. Mình cũng hiểu thật trọn vẹn câu "Mẹ phải thật hạnh phúc thì mới khiến con hạnh phúc được". Cảm ơn thầy rất nhiều' }
]

const HomeReview = () => {
    let container = useRef()
    let [itemWidth, setItemWidth] = useState(1400)
    let [position, setPosition] = useState(0)

    const nextClicked = () => {
        let toPosition = (position + 1) % reviewData.length
        setPosition(toPosition)
    }

    const prevClicked = () => {
        let toPosition = (position - 1 + reviewData.length) % reviewData.length
        setPosition(toPosition)
    }

    const onResize = () => {
        if (container) {
            setItemWidth(container.current.getBoundingClientRect().width)
        }
    }

    const throttleResize = throttle(onResize, 500)

    useEffect(() => {
        onResize()
        window.addEventListener("resize", throttleResize)
        return () => {
            window.removeEventListener("resize", throttleResize)
        }
    }, [])

    return (
        <section className="home-review">
            <div className='home-review-overlay'></div>
            <div className='row'>
                <section className="col-12" style={{ zIndex: 1 }}>
                    <div className='container'>
                        <div className="row">
                            <div className="col-12">
                                <div className='home-review-container' ref={container}>
                                    <h2 className='home-review-title'>Đánh giá của học viên</h2>
                                    <div className="home-review-underline"></div>
                                    <div className='home-review-slider'>
                                        <div className='home-review-content'>
                                            <div className='content-wrapper' style={{ width: reviewData.length * itemWidth, transform: `translate3d(-${position * itemWidth}px, 0px, 0px)` }}>
                                                {reviewData.map((item, index) => (
                                                    <div className='home-review-item text-center' key={index} style={{ width: itemWidth }}>
                                                        <div className='review-content'>{item.content}</div>
                                                        <div className='review-author'>{item.author}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className='home-review-control'>
                                            <div className='slider-btn btn-prev' onClick={prevClicked}><FontAwesomeIcon icon={allIcon.faAngleLeft} /></div>
                                            <div className='slider-btn btn-next' onClick={nextClicked}><FontAwesomeIcon icon={allIcon.faAngleRight} /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    )
}

export { HomeReview }