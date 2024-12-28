//src/models/teacher/teacher.model.ts
import moment from "moment";
import { Schema } from "mongoose";
import { ITeacher } from "../../../interfaces";

export const TeacherSchema = new Schema<ITeacher>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  image: {
    type: String,
    required: [true, "Image is required."],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  createdAt: {
    type: Number,
    default: () => moment().utc().unix(),
  },
  updatedAt: {
    type: Number,
    default: () => moment().utc().unix(),
  },
});

// Export model name for dynamic usage
export const TEACHER_MODEL_NAME = "Teacher";
