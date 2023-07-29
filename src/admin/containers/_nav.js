import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav = [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
    roles: ['ADMIN', 'OPERATOR', 'TEACHER']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý khóa học',
    route: '/admin/courses',
    icon: 'cil-puzzle',
    roles: ['ADMIN', 'OPERATOR', 'TEACHER'],
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Danh sách khóa học',
        to: '/admin/courses',
        roles: ['ADMIN', 'OPERATOR', 'TEACHER'],
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Nhóm danh mục',
        to: '/admin/courses/category-groups',
        roles: ['ADMIN', 'OPERATOR'],
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Danh mục khóa học',
        to: '/admin/courses/categories',
        roles: ['ADMIN', 'OPERATOR'],
      }
    ],
  },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Đơn hàng',
  //   route: '/admin/orders',
  //   icon: 'cil-puzzle',
  //   roles: ['ADMIN', 'OPERATOR'],
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Đơn hàng đang chờ',
  //       to: '/admin/orders/pending',
  //       roles: ['ADMIN', 'OPERATOR'],
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Đơn hàng đã hoàn thành',
  //       to: '/admin/orders/completed',
  //       roles: ['ADMIN', 'OPERATOR'],
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Tất cả đơn hàng',
  //       to: '/admin/orders',
  //       roles: ['ADMIN', 'OPERATOR'],
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Đơn hàng đã hủy',
  //       to: '/admin/orders/cancelled',
  //       roles: ['ADMIN', 'OPERATOR'],
  //     }
  //   ],
  // },
  {
    _tag: 'CSidebarNavItem',
    name: 'Lịch trực tiếp',
    to: '/admin/live-schedules',
    icon: 'cil-puzzle',
    roles: ['ADMIN', 'OPERATOR'],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Review sách',
    route: '/admin/blog',
    icon: 'cil-puzzle',
    roles: ['ADMIN', 'OPERATOR'],
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Quản lý danh mục',
        to: '/admin/blog-categories',
        roles: ['ADMIN', 'OPERATOR'],
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Quản lý bài viết',
        to: '/admin/posts',
        roles: ['ADMIN', 'OPERATOR'],
      },
    ],
  },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Surveys',
  //   to: '/admin/surveys',
  //   icon: 'cil-puzzle',
  //   roles: ['ADMIN', 'OPERATOR'],
  // },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Người dùng',
    route: '/admin/users',
    icon: 'cil-puzzle',
    roles: ['ADMIN', 'OPERATOR'],
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Danh sách người dùng',
        to: '/admin/users',
        roles: ['ADMIN', 'OPERATOR'],
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Quản trị viên',
        to: '/admin/users/managers',
        roles: ['ADMIN'],
      }
    ],
  },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Quiz',
  //   route: '/admin/quiz',
  //   icon: 'cil-puzzle',
  //   roles: ['ADMIN', 'OPERATOR'],
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       roles: ['ADMIN', 'OPERATOR'],
  //       name: 'Cấu hình Quiz',
  //       to: '/admin/quiz',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       roles: ['ADMIN', 'OPERATOR'],
  //       name: 'Kết quả Quiz',
  //       to: '/admin/quiz-results',
  //     }
  //   ],
  // },
  {
    _tag: 'CSidebarNavDropdown',
    roles: ['ADMIN', 'OPERATOR'],
    name: 'Nội dung',
    route: '/admin/content-pages',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        roles: ['ADMIN', 'OPERATOR'],
        name: 'Danh sách trang nội dung',
        to: '/admin/content-pages',
      }
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    roles: ['ADMIN', 'OPERATOR'],
    name: 'Giao diện',
    route: '/admin/appearance',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        roles: ['ADMIN', 'OPERATOR'],
        name: 'Banner',
        to: '/admin/appearance/banners',
      }
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Tiện ích',
    route: '/admin/tools',
    roles: ['ADMIN', 'OPERATOR'],
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Nhập học viên',
        roles: ['ADMIN', 'OPERATOR'],
        to: '/admin/tools/import',
      }
    ],
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'TK Ủng Hộ',
    to: '/admin/donate-accounts',
    icon: 'cil-puzzle',
    roles: ['ADMIN', 'OPERATOR'],
  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2',
    roles: [],
  },
]

export default _nav
