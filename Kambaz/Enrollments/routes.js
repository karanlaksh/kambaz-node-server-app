import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  const getAllEnrollments = (req, res) => {
    const enrollments = dao.findAllEnrollments();
    res.json(enrollments);
  };

  const enrollInCourse = (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    dao.enrollUserInCourse(userId, courseId);
    res.sendStatus(200);
  };

  const unenrollFromCourse = (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    dao.unenrollUserFromCourse(userId, courseId);
    res.sendStatus(200);
  };

  app.get("/api/enrollments", getAllEnrollments);
  app.post("/api/users/:userId/courses/:courseId/enroll", enrollInCourse);
  app.delete("/api/users/:userId/courses/:courseId/unenroll", unenrollFromCourse);
}