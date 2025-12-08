import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function CoursesDao() {
  const findAllCourses = () => {
    return model.find({}, { name: 1, description: 1, number: 1, img: 1 });
  };

  const findCourseById = (courseId) => {
    return model.findById(courseId);
  };

  const createCourse = (course) => {
    const newCourse = { ...course, _id: uuidv4(), modules: [] };
    return model.create(newCourse);
  };

  const deleteCourse = (courseId) => {
    return model.deleteOne({ _id: courseId });
  };

  const updateCourse = (courseId, courseUpdates) => {
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
  };

  return {
    findAllCourses,
    findCourseById,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}