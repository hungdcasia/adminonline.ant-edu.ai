import { useState } from "react";
import ReactPlayer from 'react-player/lazy';

const state = {
    pip: false,
    playing: true,
    controls: true,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false
};

const Preview = (props) => {
    const { onClose, url, course } = props;

    return (
        <section className="row d-flex justify-content-center">
            <section className="col-12 p-0">
                <div className="PreviewCourse_body my-0">
                    <div className="PreviewCourse_closeBtn" onClick={onClose}>×</div>
                    <h3>Giới thiệu khóa học</h3>
                    <h2>{course.name}</h2>
                    <div className="video-wrapper">
                        <ReactPlayer
                            className='react-player'
                            width='100%'
                            height='100%'
                            url={url}
                            pip={state.pip}
                            playing={state.playing}
                            controls={state.controls}
                            light={state.light}
                            loop={state.loop}
                            playbackRate={state.playbackRate}
                            volume={state.volume}
                            muted={state.muted}
                        />
                    </div>
                </div>
            </section>
        </section>
    );
}

export { Preview };