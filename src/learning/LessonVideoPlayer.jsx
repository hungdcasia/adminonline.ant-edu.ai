import React, { Component, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { NumberHelpers } from "../helpers/index";
import { courseService, questionsService } from "../services";
import Moment from 'react-moment';
import moment from 'moment';
import { history } from "../helpers";
import ReactPlayer from 'react-player/lazy'
import { settingKeysConstant } from '../constants';
import { LearningContext } from './LearningContext';
import { AzureMP } from '../libs/azure-mp';
import Countdown from "react-countdown"


class LessonVideoPlayer extends Component {
    constructor(props) {
        super(props);
        let { url } = props;
        this.Auto_Play = localStorage.getItem(settingKeysConstant.AUTO_PLAY) != "false";
        this.Auto_Next = localStorage.getItem(settingKeysConstant.AUTO_NEXT_LESSON) != "false";
        this.isSeeking = false
        this.isEnded = false
        this.state = {
            url: url,
            pip: false,
            playing: this.Auto_Play,
            controls: true,
            light: false,
            volume: 0.8,
            muted: false,
            played: 0,
            loaded: 0,
            duration: 0,
            playbackRate: 1.0,
            loop: false,
            isYoutubeVideo: this.isYoutubeVideo(url),
            questions: [],
            currentQuestion: null,
            showOverlayEndControl: false
        };

        this.play = this.play.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let { url } = nextProps;
        this.isSeeking = false
        if (url != this.props.url) {
            this.playedSeconds = 0;
            this.setState({
                url: url,
                questions: [],
                playing: this.Auto_Play,
                showOverlayEndControl: false,
                isYoutubeVideo: this.isYoutubeVideo(url)
            });
        }
    }

    play() {
        this.player.handleClickPreview();
    }

    isYoutubeVideo(url) {
        if (url == null || url == '') return false;
        let domain = (new URL(url));
        domain = domain.hostname;
        return domain.includes('youtube') || domain.includes('youtu.be');
    }

    ref = player => {
        this.player = player
    }

    handlePlay = () => {
        // console.log('onPlay')
        this.setState({ playing: true })
        this.isEnded = false
    }

    handleBuffer = () => {
        // console.log('onBuffer')
    }

    handleEnablePIP = () => {
        // console.log('onEnablePIP')
        this.setState({ pip: true })
    }

    handleDisablePIP = () => {
        // console.log('onDisablePIP')
        this.setState({ pip: false })
    }

    handlePause = () => {
        // console.log('onPause')
        if (this.state.isYoutubeVideo)
            setTimeout(() => { this.setState({ playing: false }) }, 100)
        else
            this.setState({ playing: false })
    }

    handleProgress = state => {
        // console.log('onProgress', state, this.isSeeking)
        if (!this.isSeeking) {
            this.setState(state)
            if (!this.isEnded)
                this.savePosition(state.played ?? 0)
        }

        let shouldPlayQuestion = this.state.questions
            .find(r => !r.right && !r.showed
                && r.displayTime >= this.playedSeconds
                && r.displayTime <= state.playedSeconds
                && state.playedSeconds - r.displayTime < 5);
        this.playedSeconds = state.playedSeconds;
        if (shouldPlayQuestion) {
            this.handleShowQuestion(shouldPlayQuestion);
        }
    }

    handleShowQuestion(question) {
        question.showed = true;
        this.setState({
            playing: false,
            currentQuestion: question
        });
    }

    handleEnded = () => {
        this.isEnded = true
        this.removePosition()
        this.setState({ playing: false, showOverlayEndControl: true });
        let { questions } = this.state
        let { currentLesson } = this.props
        let totalPoint = questions.filter(r => r.isRight).reduce((a, b) => a + b.point, 0)
        let requiredPoint = currentLesson.requirePoint
        let canNext = currentLesson.completed || !currentLesson.checkpoint || requiredPoint <= totalPoint
        if (canNext)
            this.context.setCompleteLesson(this.props.currentLessonId);
    }

    handleReplay = () => {
        this.setState({ playing: true, showOverlayEndControl: false });
        this.getQuestions()
    }

    handleNextLesson = () => {
        this.setState({ showOverlayEndControl: false });
        this.context.handleNextLesson();
    }

    handleDuration = (duration) => {
        let savedPoint = this.getSavedPosition()
        // console.log('onDuration', duration, savedPoint, this.Auto_Play)
        if (savedPoint > 0) {
            this.isSeeking = true
            this.player.seekTo(this.getSavedPosition())
            setTimeout(() => {
                this.isSeeking = false
            }, 5000)
        }
        this.setState({ duration });
    }

    getSavedPosition = () => {
        let lessonId = this.props.currentLessonId
        const played = parseFloat(localStorage.getItem('v-' + lessonId) ?? 0);
        return played >= 1 ? 0 : played;
    }

    savePosition = (played) => {
        let lessonId = this.props.currentLessonId
        localStorage.setItem('v-' + lessonId, played)
    }

    removePosition = () => {
        let lessonId = this.props.currentLessonId
        localStorage.removeItem('v-' + lessonId)
    }

    onReady = () => {
        // console.log('onReady')
        this.getQuestions().then((res) => {
            if (res.data && res.data.length > 0)
                this.getUserQuestions()
        });
    }

    getQuestions = () => {
        let lessonId = this.props.currentLessonId
        return questionsService.getQuestions(lessonId)
            .then(res => {
                this.setState({
                    questions: res.data
                });

                return res
            });
    }

    getUserQuestions = () => {
        let lessonId = this.props.currentLessonId
        return questionsService.getUserQuestionsByLesson(lessonId)
            .then(res => {
                let questions = this.state.questions
                let userQuestion = res?.data ?? []
                questions.forEach(r => r.right = userQuestion.some(q => q.questionId == r.id && q.right))
            });
    }

    onQuestionFinish = () => {
        this.setState({
            playing: true,
            currentQuestion: null
        });
    }

    onSeek = (e) => {
        // console.log('onSeek', e)
    }

    isAzureMediaUrl = () => {
        var url = this.state.url;
        return url != null && url.includes('streaming.media.azure.net');
    }

    render() {
        const { url, playing, controls, volume, muted, loop, playbackRate, pip, isYoutubeVideo, currentQuestion, showOverlayEndControl, questions } = this.state
        const { currentLesson } = this.props
        return (
            <div className='video-container'>
                {this.isAzureMediaUrl() ?
                    <AzureMP
                        className='w-100'
                        skin="amp-flush"
                        playing={playing}
                        src={[{ src: url, type: "application/vnd.ms-sstr+xml" }]}
                        onDuration={this.handleDuration}
                        onProgress={this.handleProgress}
                        onEnded={this.handleEnded}
                        onSeek={this.onSeek}
                        onReady={this.onReady}
                        progressInterval={3000}
                        ref={this.ref}
                    /> :
                    <div id="learn-active-video" className={`video-wrapper ActiveVideo_player`}>
                        <div className={(!playing && isYoutubeVideo) ? 'ActiveVideo_hideRelated' : ''}>
                            <ReactPlayer
                                ref={this.ref}
                                className='react-player'
                                width='100%'
                                height='100%'
                                url={url}
                                pip={pip}
                                playing={playing}
                                controls={controls}
                                light={false}
                                loop={loop}
                                playbackRate={playbackRate}
                                volume={volume}
                                muted={muted}
                                progressInterval={3000}
                                onReady={this.onReady}
                                // onStart={() => console.log('onStart')}
                                onPlay={this.handlePlay}
                                onEnablePIP={this.handleEnablePIP}
                                onDisablePIP={this.handleDisablePIP}
                                onPause={this.handlePause}
                                onBuffer={this.handleBuffer}
                                onSeek={this.onSeek}
                                onEnded={this.handleEnded}
                                // onError={e => console.log('onError', e)}
                                onProgress={this.handleProgress}
                                onDuration={this.handleDuration}
                                config={{
                                    file: {
                                        attributes: {
                                            controlsList: 'nodownload'
                                        }
                                    },
                                }}
                            />

                        </div>
                    </div>
                }

                {showOverlayEndControl &&
                    <EndOverlay handleReplay={this.handleReplay}
                        handleNextLesson={this.handleNextLesson}
                        Auto_Next={this.Auto_Next}
                        currentLesson={currentLesson}
                        questions={questions} />
                }

                {currentQuestion &&
                    <Quiz question={currentQuestion} onFinish={this.onQuestionFinish} />
                }
            </div>
        )
    }
}

LessonVideoPlayer.contextType = LearningContext

const Quiz = props => {
    let { question, onFinish } = props;
    let [answers, setAnswers] = useState(JSON.parse(question.answers));
    let [isRight, setIsRight] = useState(false);
    let [isSubmit, setIsSubmit] = useState(false);
    const onSubmit = () => {
        var userSelect = answers.filter(r => r.isChecked).map(r => r.Id);
        if (userSelect.length == 0) {
            return;
        }

        questionsService.questionSubmit(question.id, userSelect)
            .then(res => {
                setIsSubmit(true);
                if (res.data) {
                    question.isRight = true;
                    setIsRight(true);
                }
            })
            .finally(() => {

            });
    }

    const checkboxClicked = (id) => {
        answers.forEach(item => {
            if (item.Id === id) {
                item.isChecked = !item.isChecked;
            }
        });
        setAnswers(answers.map(item => item));
    }

    const radioClicked = (id) => {
        answers.forEach(item => {
            item.isChecked = item.Id === id;
        });
        setAnswers(answers.map(item => item));
    }

    return (
        <div className="learning-quiz-container overflow-auto pb-5">
            <div className="quiz-detail" style={isSubmit ? { display: 'none' } : {}}>
                <div className="quiz-heading">
                    <div className="quiz-title">
                        <h3>{question.title}</h3>
                    </div>
                    <div className="quiz-content font-italic">
                        <h5>{question.content}</h5>
                    </div>
                </div>
                <div className="quiz-answers">
                    {question.type == 'SingleChoice' &&
                        answers.map(answer =>
                            <Radio answer={answer} key={answer.Id} onClicked={radioClicked} />
                        )
                    }
                    {question.type == 'MutipleChoice' &&
                        answers.map(answer =>
                            <CheckBox answer={answer} key={answer.Id} onClicked={checkboxClicked} />
                        )
                    }
                </div>
                <div className="quiz-actions">
                    <button className="ranks_primary base_button sizes_l quiz-submit"
                        type="button"
                        onClick={onSubmit}>
                        <div className="base_inner sizes_inner"><span className="base_text">Trả lời</span></div>
                    </button>
                </div>
            </div>
            {isSubmit &&
                < div className='quiz-result'>
                    <div className="quiz-result-tilte"><h1>{isRight ? `Chính xác. Bạn đã nhận được ${question.point} điểm.` : "Tiếc quá, bạn chưa nhận được điểm câu này rồi."}</h1></div>
                    <div className="quiz-result-action">
                        <button className="ranks_primary base_button sizes_l quiz-result-btn quiz-continue"
                            type="button"
                            onClick={onFinish}>
                            <div className="base_inner sizes_inner">
                                <span className="base_text">Tiếp tục học</span>
                                <Countdown date={Date.now() + 6000}
                                    onComplete={onFinish}
                                    renderer={(props) => {
                                        return <span className='ml-1'>...{props.seconds}s</span>;
                                    }} />
                            </div>
                        </button>
                        {/* } */}
                    </div>
                </div>
            }
        </div >
    )
}

const EndOverlay = (props) => {
    let { currentLesson, questions } = props
    let totalPoint = questions.filter(r => r.isRight).reduce((a, b) => a + b.point, 0)
    let requiredPoint = currentLesson.requirePoint
    let canNext = currentLesson.completed || !currentLesson.checkpoint || requiredPoint <= totalPoint
    return (
        <div className='learning-quiz-container pb-5'>
            < div className='quiz-result'>
                <div className="quiz-result-tilte">
                    {canNext ?
                        <h1>Bạn đã hoàn thành bài học</h1> :
                        <h1>Yêu cầu đạt được {requiredPoint} điểm để hoàn thành bài học này. Điểm của bạn {totalPoint}</h1>
                    }
                </div>
                <div className="quiz-result-action">
                    <button className="ranks_primary base_button sizes_l quiz-result-btn quiz-continue"
                        type="button"
                        onClick={props.handleReplay}>
                        <div className="base_inner sizes_inner">
                            <FontAwesomeIcon icon={allIcon.faSyncAlt} />
                            <span className="base_text">&nbsp; Xem lại</span>
                        </div>
                    </button>
                    {canNext &&
                        <button className="ranks_primary base_button sizes_l quiz-result-btn quiz-continue"
                            type="button"
                            onClick={props.handleNextLesson}>
                            <div className="base_inner sizes_inner">
                                <FontAwesomeIcon icon={allIcon.faStepForward} />
                                <span className="base_text">&nbsp; Bài tiếp theo</span>
                                {props.Auto_Next &&
                                    <Countdown date={Date.now() + 6000}
                                        onComplete={props.handleNextLesson}
                                        renderer={(props) => {
                                            return <span className='ml-1'>...{props.seconds}s</span>;
                                        }} />
                                }
                            </div>
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

const CheckBox = props => {
    const { answer, onClicked } = props;
    return (
        <div className="answer-item" onClick={() => onClicked(answer.Id)}>
            <label className="Checkbox_checkboxLabel Quiz_select">
                <input type="checkbox"
                    className="Checkbox_input"
                    checked={answer.isChecked ?? false}
                    value={answer.Id} disabled />
                <div className="Checkbox_box">
                    <svg className="Checkbox_tick" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M13.579 2.593a.988.988 0 0 0-1.376.243l-5.759 8.225-2.756-2.756a.987.987 0 1 0-1.397 1.397l3.52 3.52a.978.978 0 0 0 .62.353.985.985 0 0 0 1.032-.519l6.362-9.085a.988.988 0 0 0-.243-1.376z"></path>
                    </svg>
                </div>
                <span className="Checkbox_text"></span>
            </label>
            <div className="Quiz_body">
                <div className="Quiz_title">{answer.Content}</div>
            </div>
        </div>
    )
}

const Radio = props => {
    const { answer, onClicked } = props;
    return (
        <div className="answer-item" onClick={() => onClicked(answer.Id)}>
            <label className="Radio_checkboxLabel Quiz_select">
                <input type="checkbox"
                    className="Radio_input"
                    checked={answer.isChecked ?? false}
                    value={answer.Id} disabled />
                <div className="Radio_box">
                    <svg className="Radio_tick" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M13.579 2.593a.988.988 0 0 0-1.376.243l-5.759 8.225-2.756-2.756a.987.987 0 1 0-1.397 1.397l3.52 3.52a.978.978 0 0 0 .62.353.985.985 0 0 0 1.032-.519l6.362-9.085a.988.988 0 0 0-.243-1.376z"></path>
                    </svg>
                </div>
                <span className="Radio_text"></span>
            </label>
            <div className="Quiz_body">
                <div className="Quiz_title">{answer.Content}</div>
            </div>
        </div>
    )
}

export { LessonVideoPlayer }