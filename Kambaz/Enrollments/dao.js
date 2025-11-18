import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  function findAllEnrollments() {
    return db.enrollments;
  }

  function enrollUserInCourse(userId, courseId) {
    const { enrollments } = db;
    enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
  }

  function unenrollUserFromCourse(userId, courseId) {
    const { enrollments } = db;
    db.enrollments = enrollments.filter(
      (enrollment) =>
        !(
          enrollment.user === userId &&
          (enrollment.course === courseId || enrollment.course === `CS${courseId}`)
        )
    );
  }

  return { findAllEnrollments, enrollUserInCourse, unenrollUserFromCourse };
}