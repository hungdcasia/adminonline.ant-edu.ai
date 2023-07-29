import { Router, Switch, Route, Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
const BackButton = props => {
    return (
        <section className="Setting_topbar">
            <Link className="Setting_backLink" to="/settings">
                <FontAwesomeIcon icon={allIcon.faChevronLeft} className="Setting_icon" />
                Cài đặt</Link>
        </section>
    )
}

export { BackButton }