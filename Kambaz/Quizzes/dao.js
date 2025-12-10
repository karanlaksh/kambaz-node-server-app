import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import attemptModel from "./attemptModel.js";

export default function QuizzesDao() {
  const findQuizzesForCourse = (courseId) => {
    return model.find({ course: courseId }).sort({ availableDate: 1 });
  };

  const findQuizById = (quizId) => {
    return model.findById(quizId);
  };

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

  const updateQuiz = (quizId, quizUpdates) => {
    return model.updateOne({ _id: quizId }, { $set: quizUpdates });
  };

  const deleteQuiz = (quizId) => {
    return model.deleteOne({ _id: quizId });
  };

  const publishQuiz = (quizId, published) => {
    return model.updateOne({ _id: quizId }, { $set: { published } });
  };

  const addQuestion = async (quizId, question) => {
    const newQuestion = { ...question, _id: uuidv4() };
    await model.updateOne(
      { _id: quizId },
      { $push: { questions: newQuestion } }
    );
    await recalculatePoints(quizId);
    return newQuestion;
  };

  const updateQuestion = async (quizId, questionId, questionUpdates) => {
    await model.updateOne(
      { _id: quizId, "questions._id": questionId },
      { $set: { "questions.$": { ...questionUpdates, _id: questionId } } }
    );
    await recalculatePoints(quizId);
    return questionUpdates;
  };

  const deleteQuestion = async (quizId, questionId) => {
    await model.updateOne(
      { _id: quizId },
      { $pull: { questions: { _id: questionId } } }
    );
    await recalculatePoints(quizId);
    return { deleted: true };
  };

  const recalculatePoints = async (quizId) => {
    const quiz = await model.findById(quizId);
    if (quiz) {
      const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
      await model.updateOne({ _id: quizId }, { $set: { points: totalPoints } });
    }
  };

  const findAttemptsForQuiz = (quizId, userId) => {
    return attemptModel.find({ quiz: quizId, user: userId }).sort({ submittedAt: -1 });
  };

  const findLatestAttempt = async (quizId, userId) => {
    const attempts = await attemptModel.find({ quiz: quizId, user: userId }).sort({ submittedAt: -1 }).limit(1);
    return attempts[0] || null;
  };

  const countAttempts = (quizId, userId) => {
    return attemptModel.countDocuments({ quiz: quizId, user: userId });
  };

  const submitAttempt = async (quizId, userId, answers) => {
    const quiz = await model.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");

    let score = 0;
    const gradedAnswers = answers.map((ans) => {
      const question = quiz.questions.find((q) => q._id === ans.questionId);
      if (!question) return { ...ans, isCorrect: false, pointsEarned: 0 };

      let isCorrect = false;
      
      if (question.type === "MULTIPLE_CHOICE") {
        const correctChoice = question.choices.find((c) => c.isCorrect);
        isCorrect = correctChoice && ans.answer === correctChoice._id;
      } else if (question.type === "TRUE_FALSE") {
        isCorrect = ans.answer === question.correctAnswer;
      } else if (question.type === "FILL_IN_BLANK") {
        if (question.blanks && question.blanks.length > 0 && Array.isArray(ans.answer)) {
          isCorrect = question.blanks.every((blank, index) => {
            const studentAnswer = ans.answer[index] || "";
            return blank.answers.some(
              (correct) => correct.toLowerCase().trim() === String(studentAnswer).toLowerCase().trim()
            );
          });
        } else if (question.blankAnswers && question.blankAnswers.length > 0) {
          isCorrect = question.blankAnswers.some(
            (correct) => correct.toLowerCase().trim() === String(ans.answer).toLowerCase().trim()
          );
        }
      }

      const pointsEarned = isCorrect ? question.points : 0;
      score += pointsEarned;

      return { ...ans, isCorrect, pointsEarned };
    });

    const attemptCount = await countAttempts(quizId, userId);

    const attempt = {
      _id: uuidv4(),
      quiz: quizId,
      user: userId,
      answers: gradedAnswers,
      score,
      totalPoints: quiz.points,
      attemptNumber: attemptCount + 1,
      submittedAt: new Date(),
    };

    return attemptModel.create(attempt);
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
    findAttemptsForQuiz,
    findLatestAttempt,
    countAttempts,
    submitAttempt,
  };
}