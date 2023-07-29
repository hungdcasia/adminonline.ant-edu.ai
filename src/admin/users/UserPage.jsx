import { useQuery, useQueryClient } from "react-query"
import { Route, Switch, useParams } from "react-router"
import { userService } from "../services"
import { Tab, TabLinkItem } from "../../shared/tabs/TabComponent"
import { UserForm } from "./UserForm"
import UserCourses from "./UserCourses"
import { useEffect } from "react"
import { PageToolBar } from "../shared"

const UserPage = (props) => {
    let { id } = useParams();
    const queryClient = useQueryClient()
    const { isLoading, error, data: userResult } = useQuery(['userDetail', id], () => userService.getDetail(id))

    useEffect(() => {
        return () => {
            queryClient.removeQueries('allCourses')
            queryClient.removeQueries(['userCourses', id])
        }
    }, [])

    return (
        <div className='container-fluid px-0'>
            <div className='row'>
                <div className='col-12'>
                    <PageToolBar><span className='h3'></span></PageToolBar>
                </div>
            </div>
            <div className='row'>
                <div className='col-12'>
                    <Tab>
                        <TabLinkItem to={`/admin/users/${id}/info`} label='Thông tin người dùng' />
                        <TabLinkItem to={`/admin/users/${id}/courses`} label='Khóa học' />
                    </Tab>
                </div>
            </div>
            {(!isLoading && userResult.isSuccess) &&
                <Switch>
                    <Route path='/admin/users/:id/info'>
                        <UserForm item={userResult.data} />
                    </Route>
                    <Route path='/admin/users/:id/courses' component={UserCourses} />
                </Switch>
            }
        </div>
    )
}

export { UserPage }