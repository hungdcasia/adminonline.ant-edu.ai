import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { BackButton } from "./BackButton";
import { userService } from "../services";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { alertActions } from "../actions";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';

const SettingAccount = props => {
    window.gtag('event', 'page_view', {
        page_location: window.location
    })
    let authentication = useSelector(r => r.authentication);
    let { userInfomation } = authentication
    let [gender, setGender] = useState(userInfomation?.gender);
    let [displayName, setDisplayName] = useState(userInfomation?.displayName);
    let [dob, setDOB] = useState(null);
    let [phone, setPhone] = useState(userInfomation?.phoneNumber ?? '');
    // let [website, setWebSite] = useState();

    useEffect(() => {
        setGender(userInfomation.gender);
        setDisplayName(userInfomation.displayName);
        setPhone(userInfomation.phoneNumber ?? '');

        var parsed = moment(userInfomation.dob, 'DD/MM/YYYY');
        if (parsed.isValid()) {
            setDOB(parsed.toDate());
        }

    }, [userInfomation]);

    const onSubmit = () => {
        let model = {
            displayName: displayName,
            gender: gender,
            dob: dob == null ? null : moment(dob).format("DD/MM/YYYY"),
            phoneNumber: phone,
            avatar: userInfomation.avatar
        };
        userService.updateInfomation(model)
            .then(res => {
                if (res.isSuccess) {
                    alertActions.success("Cập nhật thành công");
                }
            })
            .finally(() => {

            });
    };

    return (
        <section className="">
            <section className="">
                {/* <BackButton /> */}
                <section className="">
                    <h1 className="">Thông tin cá nhân</h1>
                </section>
                <section className="">
                    <section className="RadioGroup_radioGroup">
                        <label className="RadioGroup_groupLabel RadioGroup_mobileGroupLabel Label_label">Giới tính</label>
                        <label className="RadioGroup_horizontal RadioGroup_mobile RadioGroup_radioButton">
                            <input type="checkbox"
                                name="gender"
                                className="RadioGroup_radio"
                                value="1"
                                onChange={() => setGender(1)}
                                checked={gender == 1} />
                            <span className="RadioGroup_text">Nam</span>
                        </label>
                        <label className="RadioGroup_horizontal RadioGroup_mobile RadioGroup_radioButton">
                            <input type="checkbox"
                                name="gender"
                                className="RadioGroup_radio"
                                value="2"
                                onChange={() => setGender(2)}
                                checked={gender == 2} />
                            <span className="RadioGroup_text">Nữ</span>
                        </label>
                    </section>
                    <div className="TextInput_container">
                        <label className="Label_label">Họ và tên</label>
                        <div className="Input_inputWrap">
                            <input placeholder="eg. Đặng Ngọc Sơn"
                                name="fullname"
                                maxLength="50"
                                className="Input_input Input_m"
                                onChange={(e) => setDisplayName(e.target.value)}
                                value={displayName} />
                        </div>
                    </div>
                    <span className="ChangeUserInfo_spacer"></span>
                    <div className="TextInput_container" >
                        <label className="Label_label">Ngày sinh</label>
                        <div className="Input_inputWrap">
                            <DatePicker selected={dob}
                                onChange={date => setDOB(date)}
                                className="Input_input Input_m"
                                placeholderText="ngày/tháng/năm (vd. 02/12/1990)"
                                dateFormat="dd/MM/yyyy"
                                name="birth"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                maxDate={new Date()}
                            />
                        </div>
                    </div>
                    <span className="ChangeUserInfo_spacer"></span>
                    <div className="TextInput_container">
                        <label className="Label_label">Số điện thoại</label>
                        <div className="Input_inputWrap">
                            <input placeholder="eg. 0912345678"
                                name="phone"
                                maxLength="11"
                                className="Input_input Input_m"
                                onChange={(e) => setPhone(e.target.value)}
                                value={phone} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="btn btn-default border-0 float-right"
                            onClick={onSubmit}>Cập nhật
                        </div>
                    </div>
                   
                </section>
            </section>
            <div style={{ marginBottom: '30px' }}></div>
        </section>
    )
}

export { SettingAccount };