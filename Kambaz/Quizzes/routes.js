import QuizzesDao from "./dao.js";

export default function QuizzesRoutes(app) {
  const dao = QuizzesDao();

  // ==================== QUIZ ROUTES ====================

  // Get all quizzes for a course
  const findQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await dao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  };

  // Get a single quiz by ID
  const findQuizById = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.findQuizById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.json(quiz);
  };

  // Create a new quiz for a course
  const createQuiz = async (req, res) => {
    const { courseId } = req.params;
    const quiz = { ...req.body, course: courseId };
    const newQuiz = await dao.createQuiz(quiz);
    res.json(newQuiz);
  };

  // Update a quiz
  const updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const quizUpdates = req.body;
    const status = await dao.updateQuiz(quizId, quizUpdates);
    res.json(status);
  };

  // Delete a quiz
  const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    const status = await dao.deleteQuiz(quizId);
    res.json(status);
  };

  // Publish/unpublish a quiz
  const publishQuiz = async (req, res) => {
    const { quizId } = req.params;
    const { published } = req.body;
    const status = await dao.publishQuiz(quizId, published);
    res.json(status);
  };

  // ==================== QUESTION ROUTES ====================

  // Add a question to a quiz
  const addQuestion = async (req, res) => {
    const { quizId } = req.params;
    const question = req.body;
    const newQuestion = await dao.addQuestion(quizId, question);
    res.json(newQuestion);
  };

  // Update a question
  const updateQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const questionUpdates = req.body;
    const status = await dao.updateQuestion(quizId, questionId, questionUpdates);
    res.json(status);
  };

  // Delete a question
  const deleteQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const status = await dao.deleteQuestion(quizId, questionId);
    res.json(status);
  };

  // ==================== ATTEMPT ROUTES ====================

  // Get attempts for current user on a quiz
  const findAttemptsForQuiz = async (req, res) => {
    const { quizId } = req.params;
    const userId = req.session?.currentUser?._id;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const attempts = await dao.findAttemptsForQuiz(quizId, userId);
    res.json(attempts);
  };

  // Get latest attempt for current user on a quiz
  const findLatestAttempt = async (req, res) => {
    const { quizId } = req.params;
    const userId = req.session?.currentUser?._id;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const attempt = await dao.findLatestAttempt(quizId, userId);
    res.json(attempt);
  };

  // Get attempt count for current user on a quiz
  const countAttempts = async (req, res) => {
    const { quizId } = req.params;
    const userId = req.session?.currentUser?._id;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const count = await dao.countAttempts(quizId, userId);
    res.json({ count });
  };

  // Submit a quiz attempt
  const submitAttempt = async (req, res) => {
    const { quizId } = req.params;
    const userId = req.session?.currentUser?._id;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const { answers } = req.body;
    try {
      const attempt = await dao.submitAttempt(quizId, userId, answers);
      res.json(attempt);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // ==================== REGISTER ROUTES ====================

  // Quiz routes
  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.post("/api/courses/:courseId/quizzes", createQuiz);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.put("/api/quizzes/:quizId/publish", publishQuiz);

  // Question routes
  app.post("/api/quizzes/:quizId/questions", addQuestion);
  app.put("/api/quizzes/:quizId/questions/:questionId", updateQuestion);
  app.delete("/api/quizzes/:quizId/questions/:questionId", deleteQuestion);

  // Attempt routes
  app.get("/api/quizzes/:quizId/attempts", findAttemptsForQuiz);
  app.get("/api/quizzes/:quizId/attempts/latest", findLatestAttempt);
  app.get("/api/quizzes/:quizId/attempts/count", countAttempts);
  app.post("/api/quizzes/:quizId/attempts", submitAttempt);
}