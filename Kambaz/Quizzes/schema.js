import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: String,
  title: { type: String, default: "Untitled Question" },
  type: { 
    type: String, 
    enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"],
    default: "MULTIPLE_CHOICE"
  },
  points: { type: Number, default: 1 },
  question: { type: String, default: "" },
  choices: [{ 
    _id: String,
    text: String, 
    isCorrect: { type: Boolean, default: false } 
  }],
  correctAnswer: { type: Boolean, default: true },
  blankAnswers: [String],
  blanks: [{
    _id: String,
    answers: [String]
  }],
});

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, default: "Unnamed Quiz" },
    description: { type: String, default: "" },
    course: { type: String, ref: "CourseModel", required: true },
    quizType: { 
      type: String, 
      enum: ["GRADED_QUIZ", "PRACTICE_QUIZ", "GRADED_SURVEY", "UNGRADED_SURVEY"],
      default: "GRADED_QUIZ"
    },
    assignmentGroup: {
      type: String,
      enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"],
      default: "QUIZZES"
    },
    points: { type: Number, default: 0 },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    hasTimeLimit: { type: Boolean, default: true },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "IMMEDIATELY" },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: { type: String, default: "" },
    availableDate: { type: String, default: "" },
    untilDate: { type: String, default: "" },
    published: { type: Boolean, default: false },
    questions: [questionSchema],
  },
  { collection: "quizzes" }
);

export default quizSchema;