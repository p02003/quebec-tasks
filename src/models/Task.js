import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);
