import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    description: String,
    course: { type: String, ref: "CourseModel" },
    points: Number,
    due: String,
    available: String,
    until: String,
    group: String,
    displayGrade: String,
    submissionType: String,
    assignedTo: String,
  },
  { collection: "assignments" }
);

export default assignmentSchema;