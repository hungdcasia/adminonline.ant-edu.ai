import { useRouteMatch } from "react-router"
import classNames from 'classnames'
import { Link } from "react-router-dom"

const Tab = ({ children, className }) => {
    return (
        <div className={classNames('Tab_tabs', className)}>
            {children}
        </div>
    )
}

const TabLinkItem = ({ label, to, className, rawProps }) => {
    var match = useRouteMatch(to)
    return (
        <Link replace className={classNames(`Tab_tab ${match != null && match.isExact ? 'Tab_active' : ''}`, className)} to={to} {...rawProps}>{label}</Link>
    )
}

export { Tab, TabLinkItem }