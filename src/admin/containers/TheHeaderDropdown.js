import React from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar } from '../../shared/avatar'
import { userConstants } from '../../constants'

const TheHeaderDropdown = () => {
  let authentication = useSelector(state => state.authentication)
  let dispatch = useDispatch()
  const onLogoutClicked = () => {
    localStorage.removeItem('userToken');
    dispatch({ type: userConstants.LOGOUT })
  }

  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <Avatar url={authentication.userInfomation?.avatar} className='h-100 rounded-circle' />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick={onLogoutClicked}>
          Đăng xuất
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
