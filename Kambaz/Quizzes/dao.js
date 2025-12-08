import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function QuizzesDao() {
  // Find all quizzes for a course
  const findQuizzesForCourse = (courseId) => {
    return model.find({ course: courseId }).sort({ availableDate: 1 });
  };

  // Find a single quiz by ID
  const findQuizById = (quizId) => {
    return model.findById(quizId);
  };

  // Create a new quiz
  const createQuiz = (quiz) => {
    const newQuiz = { 
      ...quiz, 
      _id: uuidv4(),
      questions: [],
      published: false,
      points: 0,
    };
    return model.create(newQuiz);
  };

  // Update a quiz
  const updateQuiz = (quizId, quizUpdates) => {
    return model.updateOne({ _id: quizId }, { $set: quizUpdates });
  };

  // Delete a quiz
  const deleteQuiz = (quizId) => {
    return model.deleteOne({ _id: quizId });
  };

  // Publish/unpublish a quiz
  const publishQuiz = (quizId, published) => {
    return model.updateOne({ _id: quizId }, { $set: { published } });
  };

  // ==================== QUESTIONS ====================

  // Add a question to a quiz
  const addQuestion = async (quizId, question) => {
    const newQuestion = { ...question, _id: uuidv4() };
    await model.updateOne(
      { _id: quizId },
      { $push: { questions: newQuestion } }
    );
    // Recalculate points
    await recalculatePoints(quizId);
    return newQuestion;
  };

  // Update a question
  const updateQuestion = async (quizId, questionId, questionUpdates) => {
    await model.updateOne(
      { _id: quizId, "questions._id": questionId },
      { $set: { "questions.$": { ...questionUpdates, _id: questionId } } }
    );
    // Recalculate points
    await recalculatePoints(quizId);
    return questionUpdates;
  };

  // Delete a question
  const deleteQuestion = async (quizId, questionId) => {
    await model.updateOne(
      { _id: quizId },
      { $pull: { questions: { _id: questionId } } }
    );
    // Recalculate points
    await recalculatePoints(quizId);
    return { deleted: true };
  };

  // Recalculate total points for a quiz
  const recalculatePoints = async (quizId) => {
    const quiz = await model.findById(quizId);
    if (quiz) {
      const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
      await model.updateOne({ _id: quizId }, { $set: { points: totalPoints } });
    }
  };

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    publishQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
}