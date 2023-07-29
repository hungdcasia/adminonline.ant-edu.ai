import { Link } from "react-router-dom";
import accountIcon from "../assets/images/setting-account-icon.svg";

const SettingHome = props => {
    return (
        <section className="">
            <section className="">
                <section className="">
                    <section>
                        <h1 className="">Cài đặt</h1>
                    </section>
                </section>
                <section className="NavItem_wrapper NavItem_withIllustration">
                    <Link to="/settings/account" className="NavItem_container NavItem_withIllustration">
                        <section className="NavItem_illustration">
                        </section>
                        <section className="NavItem_content"><span className="NavItem_name">Thông tin cá nhân</span>
                            <span className="NavItem_description NavItem_isCategory">Tên hiển thị, ngày sinh, giới tính...</span>
                        </section>
                        <svg className="NavItem_icon" width="16" height="16" viewBox="0 0 16 16">
                            <path fill="currentColor" d="M5.879 1.636l5.657 5.657a1.02 1.02 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414L9.415 8l-4.95-4.95a.999.999 0 1 1 1.414-1.414z"></path>
                        </svg>
                    </Link>
                    <Link to="/settings/change-password" className="NavItem_container NavItem_withIllustration">
                        <section className="NavItem_illustration">
                        </section>
                        <section className="NavItem_content"><span className="NavItem_name">Bảo mật</span>
                            <span className="NavItem_description NavItem_isCategory">Đổi mật khẩu đăng nhập</span>
                        </section>
                        <svg className="NavItem_icon" width="16" height="16" viewBox="0 0 16 16">
                            <path fill="currentColor" d="M5.879 1.636l5.657 5.657a1.02 1.02 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414L9.415 8l-4.95-4.95a.999.999 0 1 1 1.414-1.414z"></path>
                        </svg>
                    </Link>
                    <Link to="/settings/general" className="NavItem_container NavItem_withIllustration">
                        <section className="NavItem_illustration">
                        </section>
                        <section className="NavItem_content"><span className="NavItem_name">Chung</span>
                            <span className="NavItem_description NavItem_isCategory">Giao diện, ngôn ngữ, video...</span>
                        </section>
                        <svg className="NavItem_icon" width="16" height="16" viewBox="0 0 16 16">
                            <path fill="currentColor" d="M5.879 1.636l5.657 5.657a1.02 1.02 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414L9.415 8l-4.95-4.95a.999.999 0 1 1 1.414-1.414z"></path>
                        </svg>
                    </Link>
                </section>
            </section>
        </section>
    )
}

export { SettingHome }