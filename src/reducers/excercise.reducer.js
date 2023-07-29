import { learningExcercisesConstants } from '../constants';

const initialState = { lesson: null, course: null, excerciseId: null };
export function learningExcercises(state = initialState, action) {
    switch (action.type) {
        case learningExcercisesConstants.DO_EXCERCISE:
            return {
                lesson: action.lesson,
                course: action.course,
                excerciseId: action.excerciseId
            };
        case learningExcercisesConstants.CLEAR:
            return {
                lesson: null,
                course: null,
                excerciseId: null
            };
        default:
            return state
    }
}