import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";

export default function ModulesDao() {
  const findModulesForCourse = async (courseId) => {
    const course = await model.findById(courseId);
    return course?.modules || [];
  };

  const createModule = async (courseId, module) => {
    const newModule = { ...module, _id: uuidv4() };
    await model.updateOne(
      { _id: courseId },
      { $push: { modules: newModule } }
    );
    return newModule;
  };

  const deleteModule = async (courseId, moduleId) => {
    const status = await model.updateOne(
      { _id: courseId },
      { $pull: { modules: { _id: moduleId } } }
    );
    return status;
  };

  const updateModule = async (courseId, moduleId, moduleUpdates) => {
    const course = await model.findById(courseId);
    const module = course.modules.id(moduleId);
    Object.assign(module, moduleUpdates);
    await course.save();
    return module;
  };

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
}