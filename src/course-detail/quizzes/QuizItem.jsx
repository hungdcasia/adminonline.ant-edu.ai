import * as allIcon from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

const QuizItem  = ({quiz, userQuizzes}) => {
  const questions = quiz.content ? JSON.parse(quiz.content) : [];
  const lastUserQuiz = userQuizzes[0]
  return (
    <div className="CurriculumOfCourse_lessonItem" >
      <span className="CurriculumOfCourse_floatLeft CurriculumOfCourse_iconLink">
        {quiz?.isCompleted ?
          <FontAwesomeIcon icon={allIcon.faCheck} className='fa-w-16 CurriculumOfCourse_icon CurriculumOfCourse_video' /> :
          <FontAwesomeIcon icon={allIcon.faAddressCard} className="fa-w-16 CurriculumOfCourse_icon CurriculumOfCourse_video" />
        }
        <div className="CurriculumOfCourse_lessonName">{quiz?.title}</div>
      </span>
      <span className="CurriculumOfCourse_floatRight">{quiz.time ? moment.duration(quiz.time, 'seconds').format("hh:mm:ss") : "N/A"}</span>
      <span className="CurriculumOfCourse_action CurriculumOfCourse_floatRight">
        <div>{lastUserQuiz ? `Điểm: ${lastUserQuiz.points} / ${questions.length}` : "N/A"}</div>
      </span>
    </div>
  )
}

export default QuizItem;