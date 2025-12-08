import model from "./model.js";

export default function EnrollmentsDao() {
  const findAllEnrollments = () => {
    return model.find();
  };

  const findCoursesForUser = async (userId) => {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  };

  const findUsersForCourse = async (courseId) => {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
  };

  const enrollUserInCourse = (userId, courseId) => {
    return model.create({
      _id: `${userId}-${courseId}`,
      user: userId,
      course: courseId,
      enrollmentDate: new Date(),
    });
  };

  const unenrollUserFromCourse = (userId, courseId) => {
    return model.deleteOne({ user: userId, course: courseId });
  };

  const unenrollAllUsersFromCourse = (courseId) => {
    return model.deleteMany({ course: courseId });
  };

  return {
    findAllEnrollments,
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
  };
}