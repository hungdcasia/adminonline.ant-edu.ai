import { learningExcercisesConstants } from '../constants';

export const learningExcercisesActions = {
    doExcercises,
    clear
};

function doExcercises(lesson, course, excerciseId) {
    return { type: learningExcercisesConstants.DO_EXCERCISE, course, lesson, excerciseId };
}

function clear() {
    return { type: learningExcercisesConstants.CLEAR };
}