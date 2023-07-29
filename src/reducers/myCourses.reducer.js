import { myCoursesConstants } from '../constants';
import { types } from "react-alert";

export function myCourses(state = { courses: null }, action) {
  switch (action.type) {
    case myCoursesConstants.SUCCESS:
      return {
        courses: action.courses
      };
    case myCoursesConstants.NEW:
      var { courses } = state;
      var newCourse = action.course;
      // if (!courses.findIndex(r => r.course.id == newCourse.course.id))
        courses.push(newCourse);
      return {
        courses: courses
      };
    case myCoursesConstants.UPDATE:
      var { courses } = state;
      var newCourse = action.course;
      var course = courses.find(r => r.course.id == newCourse.course.id)
      if (course) {
        course.userCourse.progress = newCourse.userCourse.progress;
      }
      return {
        courses: courses
      };
    case myCoursesConstants.CLEAR:
      return {
        courses: null
      };
    default:
      return state
  }
}