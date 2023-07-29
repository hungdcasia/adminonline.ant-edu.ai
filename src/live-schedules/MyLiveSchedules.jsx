import { useEffect } from "react"
import { useState } from "react"
import { liveSchedulesService } from "../services"
import { NoData } from "../shared"
import { CommonItem } from "./CommonItem"
import { FeaturedItem } from "./FeaturedItem"

const MyLiveSchedules = () => {
    let [schedules, setSchedules] = useState([])

    useEffect(() => {
        liveSchedulesService.myList()
            .then(res => {
                if (res.isSuccess)
                    setSchedules(res.data)
            })
    }, [])

    if (schedules.length == 0) {
        return (
            <div className='row'>
                <NoData message='Bạn chưa đăng ký tham gia.' />
            </div>
        )
    }

    return (
        <>
            <div className='row'>
                <FeaturedItem item={schedules[0]} />
            </div>
            <div className='row mt-5 d-flex'>
                {schedules.filter((item, index) => index != 0).map(item => (
                    <div className='col-lg-4 align-self-stretch' key={item.id}>
                        <CommonItem item={item} />
                    </div>
                ))}
            </div>
        </>
    )
}

export { MyLiveSchedules }