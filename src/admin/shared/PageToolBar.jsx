import { history } from "../../helpers";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CButton } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PageToolBar = ({ children, onBackClicked, hideBackButton }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                {!hideBackButton &&
                    <CButton onClick={onBackClicked ?? history.goBack}
                        type='link'>
                        <FontAwesomeIcon icon={allIcon.faChevronLeft} /> Quay lại</CButton>
                }
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                </ul>
                <div className="form-inline my-2 my-lg-0">
                    {children}
                </div>
            </div>
        </nav>
    )
}

export { PageToolBar }