import React, { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { NumberHelpers } from "../helpers"
import { questionsService } from "../services"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import { CModal, CModalBody, CModalHeader } from "@coreui/react"

const QuizStatistics = ({ course, chapters, lessons }) => {
    let courseId = course.id
    const queryClient = useQueryClient()
    let { data: courseQuestionsResult } = useQuery(['courseQuestions', courseId],
        () => questionsService.getQuestionsByCourse(courseId))
    let questions = courseQuestionsResult?.data ?? []

    let { data: userQuestionsResult } = useQuery(['userQuestions', courseId],
        () => questionsService.getUserQuestionsByCourse(courseId))
    let userQuestions = userQuestionsResult?.data ?? []
    let totalPoint = userQuestions.reduce((total, r) => total + (r.right ? r.point : 0), 0)
    let hasMedal = course.medals && course.medals.length > 0
    let medalIndex = course.medals.findIndex(r => totalPoint >= r.point)
    return (
        <div className='d-flex flex-column text-dark'>
            <div className='font-weight-bold mb-2'>Tổng điểm: {NumberHelpers.toDefautFormat(totalPoint)}</div>
            {hasMedal &&
                <div className='row mb-2'>
                    <div className='col-4 d-flex flex-column justify-content-center'>
                        <div className={medalIndex == 0 ? 'text-purple d-flex' : 'opacity-30 d-flex'}>
                            <FontAwesomeIcon className='m-auto' icon={allIcon.faAward} size='3x' />
                        </div>
                        <div className='text-dark d-flex'>
                            <span className='m-auto'>Huy chương tím ({NumberHelpers.toDefautFormat(course.medals[0].point)} điểm)</span>
                        </div>
                    </div>

                    <div className='col-4 d-flex flex-column justify-content-center'>
                        <div className={medalIndex == 1 ? 'text-gold d-flex' : 'opacity-30 d-flex'}>
                            <FontAwesomeIcon className='m-auto' icon={allIcon.faAward} size='3x' />
                        </div>
                        <div className='text-dark d-flex'>
                            <span className='m-auto'>Huy chương vàng ({NumberHelpers.toDefautFormat(course.medals[1].point)} điểm)</span>
                        </div>
                    </div>

                    <div className='col-4 d-flex flex-column justify-content-center'>
                        <div className={medalIndex == 2 ? 'text-silver d-flex' : 'opacity-30 d-flex'}>
                            <FontAwesomeIcon className='m-auto' icon={allIcon.faAward} size='3x' />
                        </div>
                        <div className='text-dark d-flex'>
                            <span className='m-auto'>Huy chương bạc ({NumberHelpers.toDefautFormat(course.medals[2].point)} điểm)</span>
                        </div>
                    </div>
                </div>
            }

            <table className="table table-striped table-borderless">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {chapters.map(chapter => (
                        <React.Fragment key={chapter.id}>
                            {lessons.filter(l => l.chapterId == chapter.id).map(lesson => (
                                <LessonRow key={lesson.id} lesson={lesson}
                                    chapter={chapter}
                                    questions={questions}
                                    userQuestions={userQuestions} />
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div >
    )
}

const LessonRow = ({ chapter, lesson, questions, userQuestions }) => {
    let lessonQuestions = questions.filter(r => r.lessonId == lesson.id)
    let userLessonQuestions = userQuestions.filter(r => r.lessonId == lesson.id && r.right)
    let totalPoint = userLessonQuestions.reduce((total, r) => total + (r.right ? r.point : 0), 0)
    return (
        <tr>
            <td>
                {chapter.name} - {lesson.name}
            </td>
            {lessonQuestions.length > 0 ?
                <td className='text-right'>({userLessonQuestions.length}/{lessonQuestions.length}) {NumberHelpers.toDefautFormat(totalPoint)} điểm</td>
                :
                <td className='text-right'>--------</td>
            }
        </tr>
    )
}

const QuizStatisticsButton = ({ course, chapters, lessons }) => {
    let [showModal, setShowModel] = useState(false)

    return (
        <>
            <div className="mr-3 hover-pointer" onClick={() => setShowModel(true)}>
                <FontAwesomeIcon icon={allIcon.faPoll} className="fa-w-16" />
                <span className='d-none d-sm-inline-block ml-1'>Tổng kết</span>
            </div>
            {showModal &&
                <CModal show={showModal}
                    scrollable
                    size='lg'
                    onClose={() => setShowModel(false)}>
                    <CModalHeader closeButton className='text-dark font-weight-bold h3'>
                        Tổng kết
                    </CModalHeader>
                    <CModalBody>
                        <QuizStatistics course={course} chapters={chapters} lessons={lessons} />
                    </CModalBody>
                </CModal>
            }
        </>
    )
}

export { QuizStatistics, QuizStatisticsButton }