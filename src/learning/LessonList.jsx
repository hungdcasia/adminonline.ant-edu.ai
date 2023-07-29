import React, { Component, useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import * as allIconBrand from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { NumberHelpers } from "../helpers/index";
import { courseService, } from "../services";
import Moment from 'react-moment';
import moment from 'moment';
import { alertActions, learningExcercisesActions, modalActions } from "../actions";
import { connect } from 'react-redux';
import { LearningContext } from './LearningContext';
import { useForceUpdate } from '../helpers/useForceUpdate';
import QuizItem from './quizzes/QuizItem';

const LessonList = React.memo(function LessonList(props) {
    let { chapters, lessons, lessonId, refresh, quizzes, userQuizzes } = props;
    return (
        <div className="Playlist_body Playlist_newScroll">
            <div>
                {chapters.map((chapter, chapterIndex) =>
                    <ChapterItem currentLessonId={lessonId}
                        chapter={chapter}
                        lessons={lessons.filter(r => r.chapterId === chapter.id)}
                        quizzes={quizzes.filter(q => lessons.filter(l => l.chapterId === chapter.id).some(p => p.id === q.lessonId ))}
                        userQuizzes={userQuizzes}
                        chapterIndex={chapterIndex}
                        key={chapterIndex}
                        refresh={refresh}
                    />
                )}
            </div>
        </div>
    )
})

function ChapterItem(props) {
    const { chapter, chapterIndex, lessons, currentLessonId, quizzes, userQuizzes, refresh } = props;
    const [expanded, setExpanded] = useState(chapter.expanded);
    useEffect(() => {
        if (lessons.some(r => r.id == currentLessonId)) {
            setExpanded(true);
        }
    }, [currentLessonId]);

    const toggleChapter = () => {
        chapter.expanded = chapter.expanded != true
        setExpanded(chapter.expanded);
    }
    let timeLength = 0;
    timeLength = lessons.map(r => r.timeLength).reduce((a, b) => a + b, 0)
    let completeCount = lessons.filter(r => r.completed).length

    return (
        <div className={"chapter-" + chapterIndex}>
            <div className={`Playlist_groupTitleWrapper ${expanded ? "Playlist_groupTitleWrapper_active" : ""}`} onClick={() => toggleChapter()}>
                <h3 className="Playlist_groupTitle">{chapter.name}</h3>
                <span className="Playlist_completed">{completeCount}/{lessons.length} | {moment.duration(timeLength, 'seconds').format("hh:mm:ss")}</span>
                <span className="Playlist_cheronIcon">
                    <FontAwesomeIcon icon={expanded ? allIcon.faChevronDown : allIcon.faChevronUp} className='fa-w-14 Playlist_icon' />
                </span>
            </div>
            <div className={`Playlist_listItem Playlist_groupList ${expanded ? ' Playlist_opened' : ''}`}>
                {expanded &&
                    <div>
                        {lessons.map((lesson, lessionIndex) =>
                            <div key={lessionIndex}>
                                <LessonItem
                                    lesson={lesson}
                                    quizzes={quizzes.filter(p => p.lessonId === lesson.id)}
                                    userQuizzes={userQuizzes.filter(p => p.lessonId === lesson.id)}
                                    currentLessonId={currentLessonId}
                                    chapter={chapter}
                                    refresh={refresh}
                                />
                            </div>
                        )}
                    </div>
                }
            </div>
        </div>
    );
}

function LessonItem(props) {
    var context = useContext(LearningContext)
    const { lesson, currentLessonId, chapter, quizzes, userQuizzes, refresh } = props;
    const { completed, locked } = lesson
    const isCurrent = lesson.id == currentLessonId;
    const completedClicked = () => {
        if (!lesson.locked)
            context.setCompleteLesson(lesson.id)
    }
    const lessonClicked = () => {
        if (lesson.locked) {
            alertActions.error('Bạn cần hoàn thành các bài học trước để mở khóa bài học!!!');
            return
        }

        context.changePlayingLesson(lesson, chapter)
    }

    return (
        <>
            <div className="learn-item">
                <div className={`Playlist_lessonItem Playlist_parent ${isCurrent ? 'Playlist_active' : ''}`} >
                    <div className="Playlist_indexWrapper">
                        {completed ?
                            <button className='bg-transparent' disabled><FontAwesomeIcon icon={allIcon.faCheck} className='fa-w-16 Playlist_icon' /></button> :
                            <button className='bg-transparent' onClick={completedClicked}>
                                <FontAwesomeIcon icon={locked ? allIcon.faLock : allIcon.faCheck} className='fa-w-16 Playlist_icon text-secondary opacity-25' />
                            </button>
                        }
                    </div>
                    <div className="Playlist_infoWrapper" onClick={lessonClicked}>
                        <h3 className="Playlist_relatedTitle">{lesson.name}</h3>
                        <p className={`Playlist_description ${isCurrent && 'Playlist_playing'}`}>
                            {lesson.type === 'video' &&
                                <FontAwesomeIcon icon={allIcon.faPlayCircle} className={`fa-w-16 Playlist_videoIcon ${isCurrent && 'Playlist_playing'}`} />
                            }
                            {lesson.type === 'video' && moment.duration(lesson.timeLength, 'seconds').format("hh:mm:ss")
                            }

                            {lesson.type === 'pdf' &&
                                <FontAwesomeIcon icon={allIcon.faFilePdf} className='fa-w-12 Playlist_videoIcon' />
                            }
                            {lesson.type === 'pdf' && moment.duration(lesson.timeLength, 'seconds').format("mm") + ' phút đọc'
                            }
                        </p>
                    </div>
                </div>
            </div>
            {
                quizzes.map(quiz => <QuizItem key={quiz.id} quiz={quiz} refresh={refresh} userQuizzes={userQuizzes.filter(p => p.quizId === quiz.id)}/>)
            }
        </>
    );
}

export { LessonList };
