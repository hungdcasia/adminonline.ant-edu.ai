import React, { Component } from 'react';
import { Link, Switch, Route } from "react-router-dom";
import configs from "../configs.json";
let logo = "/assets/images/logo-ant-edu.png";
export default class Footer extends Component {

    constructor(props) {
        super(props)
    }

    //function which is called the first time the component loads
    componentDidMount() {
    }



    render() {
        return (
            <Switch>
                <Route path='/learning'>
                </Route>
                <Route path='/assessment' />
                <AppFooter />
            </Switch>
        )
    }

}

function AppFooter(props) {
    return (
        <footer id="footer-id" className="Footer_wrapper">
            <div className='text-center'>
                <span>Copyright by <span className='font-weight-bold'>Ant-edu.vn 2023</span> ©</span>
            </div>
            {/* <section className="container Footer_container">
                <section className="row">
                    <section className="col-sm-12 col-md-6 col-lg-3 Footer_column">
                        <div className="Footer_footerLogo">
                            <Link to="/"><img src={logo} alt="Online Ant Logo" /></Link>
                            <p className='Footer_caption'>{configs.caption}</p>
                            <p>Online Ant hướng đến mục tiêu tất cả các khóa đều là Học trước trả tiền sau với mức học phí tùy tâm.</p>
                            <br />
                            <p>© 2019 Online Ant JSC. All rights reserved.</p>
                        </div>
                    </section>
                    <section className="col-sm-12 col-md-3 col-lg-2 Footer_column">
                        <h6>Online Ant</h6>
                        <ul>
                            <li><Link to="/about-us">Giới thiệu</Link></li>
                            <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
                            <li><Link to="/contact">Liên hệ</Link></li>
                        </ul>
                    </section>
                    <section className="col-sm-12 col-md-3 col-lg-2 Footer_column">
                        <h6>Liên kết</h6>
                        <ul>
                            <li><a target="_blank" rel="noopener noreferrer" href="https://cchd-vietnam.org/">CCHD-Vietnam</a></li>
                            <li><a target="_blank" href="http://udemyvietnam.vn/">Udemy VietNam</a></li>
                        </ul>
                    </section>
                    <section className="col-sm-12 col-md-3 col-lg-2 Footer_column">
                        <h6>Hỗ trợ</h6>
                        <ul>
                            <li><Link to="/donation"
                                onClick={() => {
                                    window.gtag('event', 'donate_click', {
                                        position: 'footer'
                                    })
                                }}
                            >Đóng góp</Link></li>
                            <li><Link to="/terms">Điều khoản sử dụng dịch vụ</Link></li>
                            <li><Link to="/secure-policy">Chính sách bảo mật</Link></li>
                            <li><Link to="/refund-policy">Chính sách hoàn tiền</Link></li>
                        </ul>
                    </section>
                    <section className="col-sm-12 col-md-6 col-lg-3 Footer_footerSubscribe Footer_column">
                        <h6>Theo dõi chúng tôi</h6>
                        <p>Nhập email để đăng ký nhận những thông tin hữu ích về học tập từ Online Ant</p>
                        <input type="text" placeholder="Email của bạn..." defaultValue="" /><button className="Footer_subscribeBtn">Đăng ký</button>
                    </section>
                </section>
            </section> */}
        </footer>)
}