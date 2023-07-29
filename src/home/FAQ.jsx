import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import closeIcon from "../assets/images/close-black.svg";
import { useState, useEffect, useRef } from "react";
const FAQ = (props) => {
    window.gtag('event', 'page_view', {
        page_location: window.location
    })
    let [isBriefOpen, setBriefOpen] = useState(true);
    let question1 = useRef();
    let question2 = useRef();
    let question3 = useRef();
    let question4 = useRef();

    const scrollTo = (ref) => {
        ref.current.scrollIntoView();
    }
    return (
        <section className="App_wrapper">
            <section className="container App_appContainer">
                <section className="row">
                    <section className={`col-md-12 ${isBriefOpen ? 'col-lg-8' : 'col-lg-12'}`}>
                        <div className="Faq_wrapper">
                            {!isBriefOpen &&
                                <button className="Faq_minimumBtn" onClick={() => setBriefOpen(true)}>
                                    <FontAwesomeIcon icon={allIcon.faArrowLeft} className='fa-w-14 Faq_icon' />
                                    <span>Danh sách câu hỏi</span>
                                </button>
                            }
                            <h1 style={{ marginBottom: "0px" }}>FAQs</h1>
                            <div ref={question1} className="QuestionWrapper_wrapper QuestionWrapper_separate">
                                <div className="Question_wrapper">
                                    <div className="Question_iconWrapper"><strong>Q</strong></div>
                                    <div className="Question_textWrapper">
                                        <h2>1. ANT EDU ĐANG CÓ NHỮNG KHÓA HỌC NÀO?</h2>
                                    </div>
                                </div>
                                <div className="Answer_wrapper">
                                    <div className="Answer_iconWrapper"><strong>A</strong></div>
                                    <div className="Answer_textWrapper">
                                        <div>
                                            Hiện tại Ant Edu đang có: các khóa học Tiếng Anh giao tiếp có trả phí và miễn phí; Các khóa học hiểu về bản thân, dạy con trưởng thành theo triết lý Phật giáo.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div ref={question2} className="QuestionWrapper_wrapper QuestionWrapper_separate">
                                <div className="Question_wrapper">
                                    <div className="Question_iconWrapper"><strong>Q</strong></div>
                                    <div className="Question_textWrapper">
                                        <h2>2. BÀI KIỂM TRA ĐẦU VÀO CÓ YÊU CẦU PHÍ KHÔNG?</h2>
                                    </div>
                                </div>
                                <div className="Answer_wrapper">
                                    <div className="Answer_iconWrapper"><strong>A</strong></div>
                                    <div className="Answer_textWrapper">
                                        <div> Không, hoàn toàn miễn phí. </div>
                                    </div>
                                </div>
                            </div>
                            <div ref={question3} className="QuestionWrapper_wrapper QuestionWrapper_separate">
                                <div className="Question_wrapper">
                                    <div className="Question_iconWrapper"><strong>Q</strong></div>
                                    <div className="Question_textWrapper">
                                        <h2>3. CÁC KHÓA HỌC VỀ DẠY CON CỦA THẦY TRẦN VIỆT QUÂN LÀ CÁC VIDEO GIẢNG DẠY ĐÃ THU SẴN PHẢI KHÔNG?</h2>
                                    </div>
                                </div>
                                <div className="Answer_wrapper">
                                    <div className="Answer_iconWrapper"><strong>A</strong></div>
                                    <div className="Answer_textWrapper">
                                        <div>
                                            Đúng. Thầy Trần Việt Quân đã quay sẵn các video bài giảng để truyền tải đến cha mẹ. Trong quá trình học tập, cha mẹ có thể trao đổi câu hỏi với nhau ngay trên hệ thống, tham gia group 600 bố mẹ đang theo học khóa học và được livestream giải đáp thắc mắc với thầy 2 lần.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div ref={question4} className="QuestionWrapper_wrapper">
                                <div className="Question_wrapper">
                                    <div className="Question_iconWrapper"><strong>Q</strong></div>
                                    <div className="Question_textWrapper">
                                        <h2>4. ANT EDU THƯỜNG CÓ NHỮNG HOẠT ĐỘNG NGOẠI KHÓA NÀO?</h2>
                                    </div>
                                </div>
                                <div className="Answer_wrapper">
                                    <div className="Answer_iconWrapper"><strong>A</strong></div>
                                    <div className="Answer_textWrapper">
                                        <div>
                                            Ant Edu thường xuyên có các hoạt động từ thiện, cộng đồng, phối hợp với cộng đồng GNH và các tổ chức xã hội khác.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className={`${isBriefOpen ? 'col-lg-4' : 'col-lg-0'}`}>
                        <div id="faqs-list-id" className="QuestionList_wrapper">
                            <button className="QuestionList_closeBtn"
                                onClick={() => setBriefOpen(false)}>
                                <img src={closeIcon} alt="Close button" />
                            </button>
                            <h2 className='mx-0 pl-2'>Câu hỏi thường gặp (FAQs)</h2>
                            <ul className='px-0 pl-2 mt-3'>
                                <li onClick={() => scrollTo(question1)}>1. ANT EDU ĐANG CÓ NHỮNG KHÓA HỌC NÀO?</li>
                                <li onClick={() => scrollTo(question2)}>2. BÀI KIỂM TRA ĐẦU VÀO CÓ YÊU CẦU PHÍ KHÔNG?</li>
                                <li onClick={() => scrollTo(question3)}>3. CÁC KHÓA HỌC VỀ DẠY CON CỦA THẦY TRẦN VIỆT QUÂN LÀ CÁC VIDEO GIẢNG DẠY ĐÃ THU SẴN PHẢI KHÔNG?</li>
                                <li onClick={() => scrollTo(question4)}>4. ANT EDU THƯỜNG CÓ NHỮNG HOẠT ĐỘNG NGOẠI KHÓA NÀO?</li>
                            </ul>
                        </div>
                    </section>
                </section>
            </section>
        </section>
    );
}

export { FAQ }