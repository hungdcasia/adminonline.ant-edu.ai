import React from "react";

const LearningContext = React.createContext({
    onLearnedCurrentLesson: null,
    setCompleteLesson: null,
    changePlayingLesson: null,
});

export { LearningContext }