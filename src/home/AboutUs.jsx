import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HomeFeatured, HomeBanner, HomeCallToAction, HomeShortFeature } from "./index";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

const founders = [
    {
        name: 'Nguyễn Thị Hường',
        avatar: 'assets/images/Huongnt.jpg'
    },
    {
        name: 'Nguyễn Thị Phương Thanh',
        avatar: 'assets/images/Thanhntp.jpg'
    },
    {
        name: 'Nguyễn Thế Phong',
        avatar: 'assets/images/Phongnt3.jpg'
    },
    {
        name: 'Phạm Chí Kiên',
        avatar: 'assets/images/Kienpc.png'
    },
    {
        name: 'Trần Dũng',
        avatar: 'assets/images/Tran Dung.jpg'
    }
]

const AboutUs = () => {

    useEffect(() => {
        document.body.classList.add('home');
        return () => {
            document.body.classList.remove('home');
        };
    }, [])

    window.gtag('event', 'page_view', {
        page_location: window.location
    })

    return (
        <div className=''>
            <div className="Home_wrapper ck-content" style={{ textAlign: 'justify' }}>
                <div className="Header_themeMenuWrapper" style={{ backgroundImage: "url('./assets/images/about-us-banner.jpg')" }}>
                    <div className="Header_infoWrapper">
                        <div className="Header_infoContent">
                            <section className="container">
                                <section className="row">
                                    <section className="col-12" >
                                        <h1 style={{ width: '100%', textAlign: 'center', color: '#ec00f9', margin: '0px', fontWeight: 900 }}>TRI THỨC LÀ ĐỂ CHO ĐI</h1>
                                        <p style={{ width: '100%', textAlign: 'center', color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>Online Ant được hình thành dựa trên niềm tin:<br />Chia sẻ tri thức để hiểu giá trị cuộc sống hạnh phúc</p>
                                    </section>
                                </section>
                            </section>
                        </div>
                    </div>
                    <div className="Header_overlay"></div>
                </div>
                <div className='su-menh-container container mt-5'>
                    <section className="row d-flex flex-row-reverse">
                        <section className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6" >
                            <h2><strong style={{ fontWeight: 900 }}>Sứ mệnh - Ant</strong></h2>
                            <p>Ant Edu là một dự án của công ty Newtak - doanh nghiệp phi lợi nhuận được thành lập với mục tiêu kết nối tri thức trên toàn thế giới. Ant Edu kỳ vọng sẽ góp phần trao thông tin và sự hiểu biết cho các bạn trẻ tại những vùng miền xa xôi chưa có nhiều cơ hội.</p>
                            <div className="highlight-bg" style={{ borderRadius: '20px', padding: '8px 12px 8px 12px' }}>
                                <div className='d-flex flex-row'>
                                    <i className="fas fa-angle-double-right fa-lg mr-2 text-warning"></i>
                                    <p>Ant Edu có sản phẩm chính là các khóa học online về ngôn ngữ, tâm lý với mong muốn giúp mọi người hiểu và tìm được giá trị bản thân. Các khóa học được xây dựng trên nền tảng ứng dụng mobile và website bởi các chuyên gia đào tạo nhiều kinh nghiệm. Trên 80% các khóa học của Ant Edu được tiếp cận với cộng đồng theo tâm nguyện trao đi trước, nhận lại sau, các học viên sau khi học xong sẽ đóng góp học phí tùy tâm.</p>
                                </div>
                                <div className='d-flex flex-row'>
                                    <i className="fas fa-angle-double-right fa-lg mr-2 text-warning"></i>
                                    <p>“Có hai thứ bạn phải cho đi, đó là tri thức và lòng tốt”, Ant Edu được hình thành dựa trên niềm tin đó, niềm tin về sự kết nối cộng đồng, chia sẻ tri thức trên mọi lĩnh vực để hiểu hơn về cuộc sống và con đường hạnh phúc.</p>
                                </div>
                            </div>
                        </section>
                    </section>
                </div>
                <div className='product-intro-container container container mt-5'>
                    <div className='row'>
                        <div className="col-12">
                            <h2 style={{ width: '100%', textAlign: 'center' }} className='text-uppercase font-weight-bolder'><span style={{ color: '#ec00f9' }}>Ant Edu </span><span style={{ color: '#00ebac' }}>english</span></h2>
                        </div>
                    </div>
                    <div className='row d-flex align-items-stretch'>
                        <div className='col-12 col-sm-6 col-lg-6 col-xl-3 p-3'>
                            <div className='9talk-english-card border shadow-lg p-3 h-100' style={{ borderRadius: '16px' }}>
                                <p className='text-uppercase h5'>Ant Edu English</p>
                                <p className='mb-0'>ANT EDU ENGLISH là chương trình dạy tiếng Anh giao tiếp 1 -1 được tài trợ bởi đội ngũ giáo viên Âu Mỹ N.G.O.</p>
                            </div>
                        </div>
                        <div className='col-12 col-sm-6 col-lg-6 col-xl-3 p-3'>
                            <div className='9talk-english-card border shadow-lg p-3 h-100' style={{ borderRadius: '16px' }}>
                                <p className='text-uppercase h5'>Ant Edu english</p>
                                <p className='mb-0'>Ant Edu English được thiết kế học online phù hợp với các bạn cần môi trường tiếng Anh giao tiếp với người nước ngoài, linh hoạt thời gian.</p>
                            </div>
                        </div>
                        <div className='col-12 col-sm-6 col-lg-6 col-xl-3 p-3'>
                            <div className='9talk-english-card border shadow-lg p-3 h-100' style={{ borderRadius: '16px' }}>
                                <p className='text-uppercase h5'>Ant Edu english</p>
                                <p className='mb-0'>Chương trình được xây dựng cho các bạn nhỏ trên 9 tuổi và người lớn dựa trên giáo trình chuẩn Cambridge</p>
                            </div>
                        </div>
                        <div className='col-12 col-sm-6 col-lg-6 col-xl-3 p-3'>
                            <div className='9talk-english-card border shadow-lg p-3 h-100' style={{ borderRadius: '16px' }}>
                                <p className='text-uppercase h5'>Ant Edu english</p>
                                <p className='mb-0'>Đặc biệt, với sự tài trợ của N.G.O, Microsoft và các tổ chức khác, học phí của chương trình không vượt quá 200k cho một giờ học cùng giảng viên Âu Mỹ</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='product-intro-container container container mt-5'>
                    <div className='row'>
                        <div className="col-12">
                            <h2 style={{ width: '100%', textAlign: 'center' }} className='text-uppercase font-weight-bolder'><span style={{ color: '#ec00f9' }}>Ant Edu </span><span style={{ color: '#00ebac' }}>calling</span></h2>
                        </div>
                    </div>
                    <div className='row d-flex align-items-stretch'>
                        <div className='col-12 col-sm-4 col-lg-4 p-3'>
                            <div className='9talk-calling-card border shadow-lg p-3 h-100' style={{ borderRadius: '16px' }}>
                                <p className='text-uppercase h5'>Ant Edu calling</p>
                                <p className='mb-0'>ANT EDU CALLING - Một dự án ra đời dành cho những ai từng đặt câu hỏi cho bản thân về giá trị cuộc đời: Tôi là ai? Tôi sinh ra để làm gì? Vì sao tôi có cảm xúc như vậy?</p>
                            </div>
                        </div>
                        <div className='col-12 col-sm-4 col-lg-4 p-3'>
                            <div className='9talk-calling-card border shadow-lg p-3 h-100' style={{ borderRadius: '16px' }}>
                                <p className='text-uppercase h5'>Ant Edu calling</p>
                                <p className='mb-0'>Ant Edu calling có sứ mệnh tìm kiếm kiến thức từ những học giả sẵn sàng chia sẻ giúp chúng ta phần nào trả lời những câu hỏi trên.</p>
                            </div>
                        </div>
                        <div className='col-12 col-sm-4 col-lg-4 p-3'>
                            <div className='9talk-calling-card border shadow-lg p-3 h-100' style={{ borderRadius: '16px' }}>
                                <p className='text-uppercase h5'>Ant Edu calling</p>
                                <p className='mb-0'>Ant Edu calling hướng tới 100% các khóa học đến với mọi người dưới hình thức HỌC PHÍ TÙY TÂM - Học trước trả tiền sau.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='teachers-intro-container container container mt-5'>
                    <div className='row'>
                        <div className="col-12">
                            <h2 style={{ width: '100%', textAlign: 'center' }} className='font-weight-bolder'><span style={{ color: '#ec00f9' }}>Giảng viên</span></h2>
                        </div>
                    </div>
                    <div className='row d-flex justify-content-center align-items-stretch'>
                        <div className='col-6 col-xl-3 col-sm-6 p-2'>
                            <div className='p-3 h-100' style={{ borderRadius: '16px' }}>
                                <div style={{ position: 'relative', width: '100%', content: '""', display: "block", paddingBottom: '100%' }}>
                                    <img src='/assets/images/Dương Quang Minh.png' width='100%' height='100%' style={{ position: 'absolute', objectFit: 'cover' }} />
                                </div>
                                <p className='text-capitalize font-weight-bold h5 mt-2'>Dương Quang Minh</p>
                                <p style={{ color: '#00ebac' }}>Diễn giả</p>
                                <p className='mb-0'>Thầy Dương Quang Minh - người sáng lập câu lạc bộ Dạy con trong hạnh phúc</p>
                            </div>
                        </div>

                        <div className='col-6 col-xl-3 col-sm-6 p-2'>
                            <div className='p-3 h-100' style={{ borderRadius: '16px' }}>
                                <div style={{ position: 'relative', width: '100%', content: '""', display: "block", paddingBottom: '100%' }}>
                                    <img src='/assets/images/Trần Việt Quân.jpg' width='100%' height='100%' style={{ position: 'absolute', objectFit: 'cover' }} />
                                </div>
                                <p className='text-capitalize font-weight-bold h5 mt-2'>Trần Việt Quân</p>
                                <p style={{ color: '#00ebac' }}>Diễn giả</p>
                                <p className='mb-0'>Thầy Trần Việt Quân - sáng lập và cố vấn chuyên môn hệ thống trường liên cấp Tuệ Đức. Người có hơn 20 năm nghiên cứu triết học Đông phương và triết học Phật giáo.</p>
                            </div>
                        </div>

                        <div className='col-6 col-xl-3 col-sm-6 p-2'>
                            <div className='p-3 h-100' style={{ borderRadius: '16px' }}>
                                <div style={{ position: 'relative', width: '100%', content: '""', display: "block", paddingBottom: '100%' }}>
                                    <img src='/assets/images/Andre.jpg' width='100%' height='100%' style={{ position: 'absolute', objectFit: 'cover' }} />
                                </div>
                                <p className='text-capitalize font-weight-bold h5 mt-2'>Andre</p>
                                <p style={{ color: '#00ebac' }}>English teacher</p>
                                <p className='mb-0'>I love sports, especially soccer, which I used to play when I was living in Brazil. I also like talking pictures and making movies... I have experience teaching offline in Vietnam. At the beginning of the year I came to Vietnam and I have been here ever since. I've taught kids from 8 to 16 years old. I enjoy helping students practicing their speaking skills.</p>
                            </div>
                        </div>

                        <div className='col-6 col-xl-3 col-sm-6 p-2'>
                            <div className='p-3 h-100' style={{ borderRadius: '16px' }}>
                                <div style={{ position: 'relative', width: '100%', content: '""', display: "block", paddingBottom: '100%' }}>
                                    <img src='/assets/images/Daniela.jpg' width='100%' height='100%' style={{ position: 'absolute', objectFit: 'cover' }} />
                                </div>
                                <p className='text-capitalize font-weight-bold h5 mt-2'>Daniela</p>
                                <p style={{ color: '#00ebac' }}>English teacher</p>
                                <p className='mb-0'>Originally from Mexico but have lived in the US for more than 9 years. Traveled to VietNam in 2019 and fell in love with the country. I have experience teaching offline and online to Vietnamese students. Love sharing my language skills and help others improve their English knowledge.</p>
                            </div>
                        </div>

                        <div className='col-6 col-xl-3 col-sm-6 p-2'>
                            <div className='p-3 h-100' style={{ borderRadius: '16px' }}>
                                <div style={{ position: 'relative', width: '100%', content: '""', display: "block", paddingBottom: '100%' }}>
                                    <img src='/assets/images/Rita.jpg' width='100%' height='100%' style={{ position: 'absolute', objectFit: 'cover' }} />
                                </div>
                                <p className='text-capitalize font-weight-bold h5 mt-2'>Rita</p>
                                <p style={{ color: '#00ebac' }}>English teacher</p>
                                <p className='mb-0'>Currently living in Belgium. I love traveling and exploring new countries. I also truly enjoy helping kids improve their English level as much as possible. It's very rewarding to see them develop and to be a part of that.</p>
                            </div>
                        </div>

                        <div className='col-6 col-xl-3 col-sm-6 p-2'>
                            <div className='p-3 h-100' style={{ borderRadius: '16px' }}>
                                <div style={{ position: 'relative', width: '100%', content: '""', display: "block", paddingBottom: '100%' }}>
                                    <img src='/assets/images/Nguyet Nguyen.jpg' width='100%' height='100%' style={{ position: 'absolute', objectFit: 'cover' }} />
                                </div>
                                <p className='text-capitalize font-weight-bold h5 mt-2'>Nguyễn Nguyệt</p>
                                <p style={{ color: '#00ebac' }}>English teacher</p>
                                <p className='mb-0'>My Vietnamese acquaintances call me Nguyet, but either Minh or Mariska is more familiar to my foreign friends. I have been pursuing a translation and editing career for over one and a half decade, and currently, I am working for Cactus Communications, specializing in editing research manuscripts in the field of public health for international publications. In the meantime, teaching English makes me complete as it provides me with opportunities to communicate with my students and develop my passion for planning creative English lessons</p>
                            </div>
                        </div>

                        <div className='col-6 col-xl-3 col-sm-6 p-2'>
                            <div className='p-3 h-100' style={{ borderRadius: '16px' }}>
                                <div style={{ position: 'relative', width: '100%', content: '""', display: "block", paddingBottom: '100%' }}>
                                    <img src='/assets/images/Phuong Quyen 1.jpg' width='100%' height='100%' style={{ position: 'absolute', objectFit: 'cover' }} />
                                </div>
                                <p className='text-capitalize font-weight-bold h5 mt-2'>Phương Quyên</p>
                                <p style={{ color: '#00ebac' }}>English teacher</p>
                                <p className='mb-0'>"Hi! I’m Phuong Quyen but you can call me Wing as well. Graduated from Can Tho university with English studies major, I felt so lucky because English is key to open the whole new world to me. Working with people around the world is very interesting, every country has lots of things to explore. I hope that I can inspire many others as the way I was inspired 10 years ago.
                                    "</p>
                            </div>
                        </div>

                        <div className='col-6 col-xl-3 col-sm-6 p-2'>
                            <div className='p-3 h-100' style={{ borderRadius: '16px' }}>
                                <div style={{ position: 'relative', width: '100%', content: '""', display: "block", paddingBottom: '100%' }}>
                                    <img src='/assets/images/Huong Nguyen teacher ENG.jpg' width='100%' height='100%' style={{ position: 'absolute', objectFit: 'cover' }} />
                                </div>
                                <p className='text-capitalize font-weight-bold h5 mt-2'>Nguyễn Hường</p>
                                <p style={{ color: '#00ebac' }}>English teacher</p>
                                <p className='mb-0'>My name is Huong Nguyen, you guys can call me Rosie. Graduated at Hanoi University, I got two bachelor degrees in English Studies and Finance and Banking. I used to work as English teacher at some English centers before working in the film industry for 4 years. I’m currently working as Director Assistant at the company in finance industry. I enjoy teaching English and helping others to improve their English a lot, that’s why I’m here with you.</p>
                            </div>
                        </div>

                    </div>
                </div>

                <div className='teachers-intro-container containere container mb-5  mt-5'>
                    <div className='row'>
                        <div className="col-12">
                            <h2 style={{ width: '100%', textAlign: 'center' }} className='font-weight-bolder'><span style={{ color: '#ec00f9' }}>Thành viên Ant Edu</span></h2>
                        </div>
                    </div>
                    <div className='row d-flex justify-content-around align-items-stretch'>
                        <div className='mt-2 highlight-bg' style={{ width: '300px', height: '300px', borderRadius: '45px' }}>
                            <div style={{ width: '240px', height: '40px', margin: 'auto', marginTop: '20px', backgroundColor: "#ee6ef5", borderRadius: '40px' }}></div>
                            <div style={{ width: '120px', height: '120px', backgroundColor: '#fff', margin: 'auto', marginTop: '-15px' }} className='p-1 rounded-circle'>
                                <img className='rounded-circle' src='/assets/images/Huongnt.jpg' style={{ width: '100%', height: '100%', position: 'relative', objectFit: 'cover' }} />
                            </div>
                            <p className='mx-auto h4 text-center mt-4 mb-1'>Nguyễn Thị Hường</p>
                            <p className='mx-auto text-center' >Founder - CEO</p>
                        </div>

                        <div className='mt-2 highlight-bg' style={{ width: '300px', height: '300px', borderRadius: '45px' }}>
                            <div style={{ width: '240px', height: '40px', margin: 'auto', marginTop: '20px', backgroundColor: "#ee6ef5", borderRadius: '40px' }}></div>
                            <div style={{ width: '120px', height: '120px', backgroundColor: '#fff', margin: 'auto', marginTop: '-15px' }} className='p-1 rounded-circle'>
                                <img className='rounded-circle' src='/assets/images/Phongnt3.jpg' style={{ width: '100%', height: '100%', position: 'relative', objectFit: 'cover' }} />
                            </div>
                            <p className='mx-auto h4 text-center mt-4 mb-1'>Nguyễn Thế Phong</p>
                            <p className='mx-auto text-center' >Co - Founder</p>
                        </div>

                        <div className='mt-2 highlight-bg' style={{ width: '300px', height: '300px', borderRadius: '45px' }}>
                            <div style={{ width: '240px', height: '40px', margin: 'auto', marginTop: '20px', backgroundColor: "#ee6ef5", borderRadius: '40px' }}></div>
                            <div style={{ width: '120px', height: '120px', backgroundColor: '#fff', margin: 'auto', marginTop: '-15px' }} className='p-1 rounded-circle'>
                                <img className='rounded-circle' src='/assets/images/Thanhntp.jpg' style={{ width: '100%', height: '100%', position: 'relative', objectFit: 'cover' }} />
                            </div>
                            <p className='mx-auto h4 text-center mt-4 mb-1'>Nguyễn Thị Phương Thanh</p>
                            <p className='mx-auto text-center' >Ant Edu Calling Leader</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { AboutUs }