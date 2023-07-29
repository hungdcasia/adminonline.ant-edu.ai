import { Textarea } from "react-inputs-validation";
import { HomeFeatured, HomeBanner, HomeCallToAction, HomeShortFeature } from "./index";

const Contact = () => {
    window.gtag('event', 'page_view', {
        page_location: window.location
    })
    return (
        <div>
            <div className="Home_wrapper">
                {/* <div className="Header_themeMenuWrapper">
                    <div className="Header_infoWrapper">
                        <div className="Header_infoContent"> */}
                            <HomeBanner />
                        {/* </div>
                    </div>
                    <div className="Header_overlay"></div>
                </div> */}
                <div id="about-us" className="container">
                    <h1>LIÊN HỆ</h1>
                    <div className="row">
                        <div className="col-md-12 col-lg-4">
                            <div className="contact-wrapper text-center">
                                <div className="contact-title">
                                    <p>
                                        Địa chỉ:
                                    </p>
                                </div>
                                <div className="contact-info">
                                    Số 3 Nguyễn Quý Đức, Thanh Xuân, Hà Nội
                                </div>
                            </div>
                            <div className="contact-wrapper text-center">
                                <div className="contact-title">
                                    <p>
                                        Số điện thoại:
                                    </p>
                                </div>
                                <div className="contact-info">
                                    <a href="tel:0983611477">0983611477</a>
                                </div>
                            </div>
                            <div className="contact-wrapper text-center">
                                <div className="contact-title">
                                    <p>
                                        Email:
                                    </p>
                                </div>
                                <div className="contact-info">
                                    <a href="mailto:info@online-ant.edu.vn">info@online-ant.edu.vn</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-4">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.0447557464963!2d105.79794441424465!3d20.990842994449107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acb92338b945%3A0x2747b641d86ebb92!2zMyBOZ3V54buFbiBRdcO9IMSQ4bupYywgVGhhbmggWHXDom4gQuG6r2MsIFRoYW5oIFh1w6JuLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1614046651007!5m2!1svi!2s"
                                width="100%"
                                height="450"
                                style={{ "border": "0" }}
                                // allowFullScreen
                                loading="lazy" />
                        </div>
                        <div className="col-md-12 col-lg-4">
                            <div className="Auth_form Auth_box">
                                <div className="contact-title">
                                    <p style={{ marginTop: '0px' }}>Form liên hệ:</p>
                                </div>
                                <div className="TextInput_container">
                                    <div className="Input_inputWrap">
                                        <input placeholder="Họ tên của bạn"
                                            type="text"
                                            name="displayName"
                                            maxLength="50"
                                            className={`Input_input Input_m`}
                                        //    value={this.state.displayName.value}
                                        //    onChange={this.handleInputChange}
                                        //    onBlur={this.handleInputLoseFocus} 
                                        />
                                    </div>
                                </div>
                                <div className="TextInput_container">
                                    <div className="Input_inputWrap">
                                        <input placeholder="Địa chỉ email của bạn"
                                            type="text"
                                            name="displayName"
                                            maxLength="50"
                                            className={`Input_input Input_m`}
                                        //    value={this.state.displayName.value}
                                        //    onChange={this.handleInputChange}
                                        //    onBlur={this.handleInputLoseFocus} 
                                        />
                                    </div>
                                </div>
                                <div className="TextInput_container">
                                    <div className="Input_inputWrap">
                                        <input placeholder="Số điện thoại của bạn"
                                            type="text"
                                            name="displayName"
                                            maxLength="50"
                                            className={`Input_input Input_m`}
                                        //    value={this.state.displayName.value}
                                        //    onChange={this.handleInputChange}
                                        //    onBlur={this.handleInputLoseFocus} 
                                        />
                                    </div>
                                </div>
                                <div className="TextInput_container">
                                    <div className="Input_inputWrap">
                                        <textarea placeholder="Nội dung"
                                            type="text"
                                            name="displayName"
                                            style={{ height: "100px" }}
                                            className={`Input_input Input_m`}
                                        //    value={this.state.displayName.value}
                                        //    onChange={this.handleInputChange}
                                        //    onBlur={this.handleInputLoseFocus} 
                                        />
                                    </div>
                                </div>
                                <button className="Auth_btn Auth_btnSubmit" data-qa="submit">Gửi</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: 80 }}></div>
                <HomeCallToAction />
            </div>
        </div>
    )
}

export { Contact }