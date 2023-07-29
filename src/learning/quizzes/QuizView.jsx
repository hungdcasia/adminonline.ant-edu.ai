import { alertActions } from "../../actions";
import { lessonService } from "../../admin/services";
import { string_isNullOrEmpty } from "../../helpers";
import { useState } from "react";
import { courseService } from "../../services";

const QuestionType = {
    SingleChoice: 'SingleChoice',
    MutipleChoice: 'MutipleChoice',
    FreeText: 'FreeText'
}

const QuizView = ({ quiz, userQuizzes, onSuccess }) => {
    const lastUserQuiz = userQuizzes[0];
    let [questions, setQuestions] = useState(JSON.parse(lastUserQuiz != null ? lastUserQuiz.content : quiz.content));
    let [isCompleted, setIsCompleted] = useState(lastUserQuiz != null);
    let [error, setError] = useState('')

    const validate = () => {
        for (let index = 0; index < questions.length; index++) {
            const question = questions[index];
            if (question.type == QuestionType.FreeText)
                question.error = string_isNullOrEmpty(question.answerText)
            else
                question.error = !question.answers.some(r => r.isChecked)
        }

        return !questions.some(r => r.error);
    }

    const onSubmit = () => {

        if (!validate()) {
            setQuestions([...questions])
            setError('Vui lòng hoàn thành tất cả câu hỏi trong bài.')
            return
        }

        setQuestions([...questions])
        setError('')
        let model = {
            quizId: quiz.id,
            content: JSON.stringify(questions)
        }

        courseService.submitQuiz(model)
            .then(res => {
                if (res.isSuccess) {
                    alertActions.success("Trả lời thành công!")
                    onSuccess?.call()
                }
            })
    }

    const onRedoQuiz = () => {
        courseService.getQuizById(quiz.id)
            .then(res => {
                console.log("RedoQuizResponse:", res)
                if(res.isSuccess){ 
                    setQuestions(JSON.parse(res.data.content))
                    setIsCompleted(false);
                } else {
                    alertActions.error("Có lỗi trong quá trình làm lại")
                }
            })
    }

    const checkboxClicked = (question, answerId) => {
        let answers = question.answers
        answers.forEach(item => {
            if (item.id === answerId) {
                item.isChecked = !item.isChecked;
            }
        });
        setQuestions([...questions])
    }

    const radioClicked = (question, answerId) => {
        let answers = question.answers
        answers.forEach(item => {
            item.isChecked = item.id === answerId;
        });
        setQuestions([...questions])
    }

    const onTextBoxChange = (question, value) => {
        question.answerText = value
    }

    return (
        <div className="survey-quiz-container pb-5">
            {questions.map((question, index) => (
                <div className="question-detail w-100" key={index}>
                    <div className="w-100">
                        <div className="quiz-title">
                            <h3>Câu {index + 1}: {question.title}</h3>
                        </div>
                        <div className="pl-2 quiz-content font-italic">
                            <h5>{question.content}</h5>
                        </div>
                    </div>
                    <div className="quiz-answers">
                        {question.type === QuestionType.SingleChoice &&
                            question.answers.map(answer =>
                                <Radio answer={answer} key={answer.id} onClicked={(answerId) => { radioClicked(question, answerId) }} error={ !isCompleted ? null : answer.right ? false : answer.isChecked ? true : null} />
                            )
                        }
                        {question.type === QuestionType.MutipleChoice &&
                            question.answers.map(answer =>
                                <CheckBox answer={answer} key={answer.id} onClicked={(answerId) => { checkboxClicked(question, answerId) }} error={ !isCompleted ? null : answer.right ? false : answer.isChecked ? true : null} />
                            )
                        }

                        {question.type === QuestionType.FreeText &&
                            <div className="answer-item">
                                <textarea className={`Input_input Input_m ${question.error ? 'border-danger' : ''}`}
                                    placeholder='Nhập câu trả lời'
                                    onChange={(e) => { onTextBoxChange(question, e.target.value) }} />
                            </div>
                        }
                    </div>
                </div>
            ))}


            <div className="quiz-actions flex-column">
                <label className='text-danger'>{error}</label>
                {
                    isCompleted
                        ? (<button className="ranks_primary base_button sizes_l quiz-submit"
                            type="button"
                            onClick={onRedoQuiz}>
                            <div className="base_inner sizes_inner"><span className="base_text">Làm lại</span></div>
                        </button>)
                        : (<button className="ranks_primary base_button sizes_l quiz-submit"
                            type="button"
                            onClick={onSubmit}>
                            <div className="base_inner sizes_inner"><span className="base_text">Gửi kết quả</span></div>
                        </button>)
                }
            </div>

            
        </div >
    )
}

const CheckBox = ({ answer, onClicked, error }) => {
    return (
        <div className="answer-item" onClick={() => onClicked(answer.id)}>
            <label className="Checkbox_checkboxLabel">
                <input type="checkbox"
                    className="Checkbox_input"
                    checked={answer.isChecked ?? false}
                    value={answer.id} disabled />
                <div className={`Checkbox_box ${error ? 'border-danger' : ''}`}>
                    <svg className="Checkbox_tick" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M13.579 2.593a.988.988 0 0 0-1.376.243l-5.759 8.225-2.756-2.756a.987.987 0 1 0-1.397 1.397l3.52 3.52a.978.978 0 0 0 .62.353.985.985 0 0 0 1.032-.519l6.362-9.085a.988.988 0 0 0-.243-1.376z"></path>
                    </svg>
                </div>
                <span className="Checkbox_text"></span>
            </label>
            <div className="Quiz_body">
                <div className={`${error == null ? "" : !!error ? 'btn-danger' : 'btn-success'}`}>{answer.content}</div>
            </div>
        </div>
    )
}


const Radio = ({ answer, onClicked, error }) => {
    return (
        <div className="answer-item" onClick={() => onClicked(answer.id)}>
            <label className="Radio_checkboxLabel">
                <input type="checkbox"
                    className="Radio_input"
                    checked={answer.isChecked ?? false}
                    value={answer.id} disabled />
                <div className={`Radio_box ${error ? 'border-danger' : ''}`}>
                    <svg className="Radio_tick" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M13.579 2.593a.988.988 0 0 0-1.376.243l-5.759 8.225-2.756-2.756a.987.987 0 1 0-1.397 1.397l3.52 3.52a.978.978 0 0 0 .62.353.985.985 0 0 0 1.032-.519l6.362-9.085a.988.988 0 0 0-.243-1.376z"></path>
                    </svg>
                </div>
                <span className="Radio_text"></span>
            </label>
            <div className="Quiz_body">
                <div className={`${error == null ? "" : !!error ? 'btn-danger' : 'btn-success'}`}>{answer.content}</div>
            </div>
        </div>
    )
}
export default QuizView 