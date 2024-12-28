import moment from "moment";
import { Schema } from "mongoose";
import { IStudent } from "../../../interfaces";

// Define the Student schema
export const StudentSchema = new Schema<IStudent>({
  school_uid: {
    type: String,
    required: [true, "School UID is required"],
  },
  student_name: {
    type: String,
    required: [true, "Name is required"],
  },
  student_password: {
    type: String,
    required: [true, "Password is required"],
  },
  student_email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  student_image: {
    type: String,
    required: [true, "Image is required"],
  },
  student_address: {
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
export const STUDENT_MODEL_NAME = "Student";
