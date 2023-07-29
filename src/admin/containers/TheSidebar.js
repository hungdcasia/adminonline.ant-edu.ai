import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
// sidebar nav config
import navigation from './_nav'
let logo = "/assets/images/logo-ant-edu.png";

const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.adminState)
  let authentication = useSelector(state => state.authentication)
  let roles = authentication.userInfomation?.roles ?? []
  let navItems = JSON.parse(JSON.stringify(navigation))
  let availableNavigation = roles.length == 0 ? [] : navItems.filter(r => r.roles.length > 0 && r.roles.includes(roles[0]))
  availableNavigation = availableNavigation.map(r => {

    if (!r._children) return r;

    if (r._children.length > 0) {
      r._children = r._children.filter(c => r.roles.length > 0 && c.roles.includes(roles[0]));
    }

    if (r._children.length == 0) return {}
    return r
  })
  return (
    <CSidebar
      show={show.sidebarShow}
      onShowChange={(val) => dispatch({ type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        {/* <CIcon
          className="c-sidebar-brand-full"
          name="logo-negative"
          height={35}
        />
        <CIcon
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
        /> */}
        <img src={logo}
          alt="logo"
          className='lms-menu-logo'
          style={{ height: '35px', width: 'auto' }} />
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={availableNavigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
