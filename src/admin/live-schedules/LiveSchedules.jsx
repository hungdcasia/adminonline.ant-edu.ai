import { Route, Switch } from "react-router"
import Page404 from "../views/pages/page404/Page404"
import LiveScheduleRegisters from "./LiveScheduleRegisters"
import LiveSchedulesList from "./LiveSchedulesList"
import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query';

const LiveSchedules = () => {
    const queryClient = useQueryClient()
    useEffect(() => {
        return () => {
            queryClient.removeQueries('LiveSchedules')
        }
    }, [])

    return (
        <Switch>
            <Route path='/admin/live-schedules/:id/registers' component={LiveScheduleRegisters} />
            <Route path='/admin/live-schedules' component={LiveSchedulesList} exact />
            <Route path='' component={Page404} />
        </Switch>
    )
}

export { LiveSchedules }