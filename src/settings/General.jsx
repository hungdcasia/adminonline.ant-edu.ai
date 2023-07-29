import { connect, useSelector } from "react-redux";
import { BackButton } from "./BackButton";
import { settingKeysConstant, themeConst } from "../constants";
import { useState } from "react";
import { useTheme } from "../helpers/theme.helpers";

const General = props => {
    window.gtag('event', 'page_view', {
        page_location: window.location
    })
    let theme = useSelector(state => state.themeState)
    let [toogleTheme] = useTheme();

    let [autoPlay, setAutoPlay] = useState(localStorage.getItem(settingKeysConstant.AUTO_PLAY) != "false");
    let [autoNext, setAutoNext] = useState(localStorage.getItem(settingKeysConstant.AUTO_NEXT_LESSON) != "false");

    const autoPlayChange = (e) => {
        setAutoPlay(e.target.checked);
        localStorage.setItem(settingKeysConstant.AUTO_PLAY, e.target.checked);
    }

    const autoNextChange = (e) => {
        setAutoNext(e.target.checked);
        localStorage.setItem(settingKeysConstant.AUTO_NEXT_LESSON, e.target.checked);
    }

    return (
        <section className="">
            <section className="">
                {/* <BackButton /> */}
                <section className="">
                    <section>
                        <h1 className="">Cài Đặt Chung</h1>
                    </section>
                </section>
                <section className='ChangeUserInfo_wrapper'>
                    <section className="NavItem_wrapper NavItem_withIllustration">
                        <section className="RadioGroup_radioGroup">
                            <h2 className="RadioGroup_groupLabel RadioGroup_mobileGroupLabel Label_label">Tự động phát video</h2>
                            <label className="switch">
                                <input type="checkbox" id="togBtn" checked={autoPlay} onChange={autoPlayChange} />
                                <div className="slider round"></div>
                            </label>
                        </section>
                    </section>
                    <section className="NavItem_wrapper NavItem_withIllustration">
                        <section className="RadioGroup_radioGroup">
                            <h2 className="RadioGroup_groupLabel RadioGroup_mobileGroupLabel Label_label">Tự động chuyển bài học</h2>
                            <label className="switch">
                                <input type="checkbox" id="togBtn" checked={autoNext} onChange={autoNextChange} />
                                <div className="slider round"></div>
                            </label>
                        </section>
                    </section>
                    <section className="NavItem_wrapper NavItem_withIllustration">
                        <section className="RadioGroup_radioGroup">
                            <h2 className="RadioGroup_groupLabel RadioGroup_mobileGroupLabel Label_label">Giao diện</h2>
                            <div className="theme-switch-wrapper">
                                <input type="checkbox"
                                    className="theme-switch"
                                    onClick={toogleTheme}
                                    checked={theme.name == themeConst.light} 
                                    onChange={() => { }} />
                            </div>
                        </section>
                    </section>
                </section>
            </section>
        </section>
    )
}

function mapState(state) {
    return { authentication: state.authentication };
}

const actionCreators = {
};

const connectedPage = connect(mapState, actionCreators)(General);
export { connectedPage as General };