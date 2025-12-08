import mongoose from "mongoose";

// Question Schema (embedded in Quiz)
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
  // For MULTIPLE_CHOICE: array of { text, isCorrect }
  // For TRUE_FALSE: correctAnswer is boolean
  // For FILL_IN_BLANK: array of acceptable answers
  choices: [{ 
    _id: String,
    text: String, 
    isCorrect: { type: Boolean, default: false } 
  }],
  correctAnswer: { type: Boolean, default: true }, // For TRUE_FALSE
  blankAnswers: [String], // For FILL_IN_BLANK - acceptable answers
});

// Quiz Schema
const quizSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, default: "Unnamed Quiz" },
    description: { type: String, default: "" },
    course: { type: String, ref: "CourseModel", required: true },
    
    // Quiz settings
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
    
    // Points (calculated from questions, but can be stored)
    points: { type: Number, default: 0 },
    
    // Options
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 }, // in minutes
    hasTimeLimit: { type: Boolean, default: true },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "IMMEDIATELY" }, // IMMEDIATELY, AFTER_DUE, NEVER
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    
    // Dates
    dueDate: { type: String, default: "" },
    availableDate: { type: String, default: "" },
    untilDate: { type: String, default: "" },
    
    // Status
    published: { type: Boolean, default: false },
    
    // Embedded questions
    questions: [questionSchema],
  },
  { collection: "quizzes" }
);

export default quizSchema;