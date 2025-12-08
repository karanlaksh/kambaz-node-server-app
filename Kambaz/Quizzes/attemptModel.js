import mongoose from "mongoose";
import attemptSchema from "./attemptSchema.js";

const model = mongoose.model("AttemptModel", attemptSchema);

export default model;