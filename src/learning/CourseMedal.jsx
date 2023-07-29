import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { useQuery, useQueryClient } from "react-query"
import { NumberHelpers } from "../helpers"
import { courseService, questionsService } from "../services"
import * as allIcon from '@fortawesome/free-solid-svg-icons';

const CourseMedal = ({ course, userCourse }) => {
    let courseId = course.id
    const queryClient = useQueryClient()
    let { data: courseQuestionsResult } = useQuery(['courseQuestions', courseId],
        () => questionsService.getQuestionsByCourse(courseId))
    let questions = courseQuestionsResult?.data ?? []

    let { data: userQuestionsResult } = useQuery(['userQuestions', courseId],
        () => questionsService.getUserQuestionsByCourse(courseId))
    let userQuestions = userQuestionsResult?.data ?? []
    let totalPoint = userQuestions.reduce((total, r) => total + (r.right ? r.point : 0), 0)

    let medalIndex = course.medals.findIndex(r => totalPoint >= r.point)

    return (
        <div className='d-flex flex-column text-dark'>
            <div className='font-weight-bold'>Tổng điểm: {NumberHelpers.toDefautFormat(totalPoint)}</div>
            <table className="table table-borderless">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr className={medalIndex == 0 ? 'text-purple':'opacity-30'}>
                        <td><FontAwesomeIcon icon={allIcon.faAward} size='3x' /></td>
                        <td className='text-dark'>Huy chương tím ({NumberHelpers.toDefautFormat(course.medals[0].point)} điểm)</td>
                    </tr>
                    <tr className={medalIndex == 1 ? 'text-gold':'opacity-30'}>
                        <td><FontAwesomeIcon icon={allIcon.faAward} size='3x' /></td>
                        <td className='text-dark'>Huy chương vàng ({NumberHelpers.toDefautFormat(course.medals[1].point)} điểm)</td>
                    </tr>
                    <tr className={medalIndex == 2 ? 'text-silver':'opacity-30'}>
                        <td><FontAwesomeIcon icon={allIcon.faAward} size='3x' /></td>
                        <td className='text-dark'>Huy chương bạc ({NumberHelpers.toDefautFormat(course.medals[2].point)} điểm)</td>
                    </tr>
                </tbody>
            </table>
        </div >
    )
}

export { CourseMedal }