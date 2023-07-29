import React from 'react';
import { ContentPageList } from './contentpages/ContentPages';
import { DashBoard } from './dashboard/DashBoard';
import CategoryGroups from './learning/CategoryGroups';
import CourseCreate from './learning/CourseCreate';
import CourseDetail from './learning/CourseDetail';
import CourseLessons from './learning/CourseLessons';
import CoursePage from './learning/CoursePage';
import Courses from './learning/Courses';
import DonateAccounts from './learning/DonateAccounts';
import Students from './learning/Students';
import { LiveSchedules } from './live-schedules/LiveSchedules';
import AllOrder from './orders/AllOrder';
import CancelledOrder from './orders/CancelledOrder';
import CompletedOrder from './orders/CompletedOrder';
import OrderDetail from './orders/OrderDetail';
import PendingOrder from './orders/PendingOrder';
import QuizConfig from './quiz/QuizConfig';
import QuizFilter from './quiz/QuizConfig';
import Surveys from './surveys/Surveys';
import { ImportLearner } from './tools/ImportLearner';
import ManagerList from './users/ManagerList';
import UserList from './users/UserList';
import { UserPage } from './users/UserPage';
import { BlogCategories } from './blog/BlogCategories';
import Posts from './blog/Posts';
import { Banners } from './appearance/Banners';

const AdminHome = React.lazy(() => import('./AdminHome'));
const Categories = React.lazy(() => import('./learning/Categories'));

const routes = [
  { path: '/admin', exact: true, name: 'Trang chủ', component: DashBoard , roles: ['ADMIN', 'OPERATOR', 'TEACHER'] },
  { path: '/admin/courses/categories', name: 'Quản lý danh mục', component: Categories , roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/courses/category-groups', name: 'Quản lý nhóm danh mục', component: CategoryGroups , roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/courses/create', name: 'Thêm', component: CourseCreate , roles: ['ADMIN', 'OPERATOR'] },
  // { path: '/admin/courses/:id/lessons', name: 'Chi tiết bài học', component: CourseLessons , roles: ['ADMIN', 'OPERATOR', 'TEACHER'] },
  // { path: '/admin/courses/:id/students', name: 'Quản lý học viên', component: Students , roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/courses/:id', name: 'Chi tiết', component: CoursePage , roles: ['ADMIN', 'OPERATOR', 'TEACHER'] },
  { path: '/admin/courses', name: 'Quản lý khóa học', component: Courses , roles: ['ADMIN', 'OPERATOR', 'TEACHER'] },
  { path: '/admin/donate-accounts', name: 'Khóa học', component: DonateAccounts , roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/orders/pending', name: 'ĐH Chờ thanh toán', component: PendingOrder , roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/orders/completed', name: 'ĐH Đã hoàn thành', component: CompletedOrder , roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/orders/cancelled', name: 'ĐH Đã hủy', component: CancelledOrder , roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/orders/:id', name: 'Chi tiết đơn hàng', component: OrderDetail , roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/orders', name: 'Tất cả đơn hàng', component: AllOrder , roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/quiz', name: 'Cấu hình Quiz', component: QuizConfig , roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/quiz-results', name: 'Kết quả Quiz', component: QuizConfig , roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/users/managers', name: 'Quản trị viên', component: ManagerList, roles: ['ADMIN'] },
  { path: '/admin/users/:id/*', name: 'Thông tin users', component: UserPage , roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/users', name: 'Danh sách users', component: UserList, exact: true , roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/tools/import', name: 'Nhập học viên', component: ImportLearner , roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/content-pages', name: 'Quản lý nội dung', component: ContentPageList , roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/dashboard', name: 'DashBoard', component: DashBoard , roles: ['ADMIN', 'OPERATOR', 'TEACHER'] },
  { path: '/admin/live-schedules', name: 'Danh sách live', component: LiveSchedules, roles: ['ADMIN', 'OPERATOR'] },
  { path: '/admin/blog-categories', name: 'Danh mục', component: BlogCategories , roles: ['ADMIN', 'OPERATOR']},
  { path: '/admin/posts', name: 'Danh mục', component: Posts , roles: ['ADMIN', 'OPERATOR']},
  { path: '/admin/appearance/banners', name: 'banner', component: Banners , roles: ['ADMIN', 'OPERATOR']},
];

export default routes;
