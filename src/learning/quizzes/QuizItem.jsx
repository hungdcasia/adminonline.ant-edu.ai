import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { CModal, CModalBody, CModalHeader } from "@coreui/react";
import QuizView from "./QuizView";
import ReactDOM from 'react-dom'

const QuizItem = ({ quiz, userQuizzes, refresh }) => {
  const [showModalQuiz, setShowModalQuiz] = useState(false)
  const lastUserQuiz = userQuizzes[0];

  const onQuizClick = () => {
    setShowModalQuiz(true);
  }
  return (
    <div key={quiz.id} className='learn-item'>
      <div className={`Playlist_lessonItem Playlist_parent`} >
        <div className="Playlist_indexWrapper">
          {lastUserQuiz != null ?
            <button className='bg-transparent' disabled><FontAwesomeIcon icon={allIcon.faCheck} className='fa-w-16 Playlist_icon' /></button> :
            <button className='bg-transparent'>
              <FontAwesomeIcon icon={allIcon.faCheck} className='fa-w-16 Playlist_icon text-secondary opacity-25' />
            </button>
          }
        </div>
        <div className="Playlist_infoWrapper" onClick={onQuizClick}>
          <h3 className="Playlist_relatedTitle">
            <FontAwesomeIcon icon={allIcon.faAddressCard} />
            &nbsp;
            {quiz.title}
          </h3>
        </div>
      </div>
      {showModalQuiz && ReactDOM.createPortal(
        <CModal show={showModalQuiz}
          className={"QuizzesModal"}
          closeOnBackdrop={false}
          scrollable
          size='xl'
          onClose={() => setShowModalQuiz(false)}>
          <CModalHeader closeButton className='font-weight-bold h3'>
            {quiz.title}
          </CModalHeader>
          <CModalBody>
            <QuizView quiz={quiz} userQuizzes={userQuizzes} onSuccess={() => { setShowModalQuiz(false); refresh() }} />
          </CModalBody>
        </CModal>, document.querySelector('body'))
      }
    </div>
  )
}

export default QuizItem;