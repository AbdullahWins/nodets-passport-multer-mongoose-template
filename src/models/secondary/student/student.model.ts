import moment from "moment";
import { Schema } from "mongoose";
import { IStudent } from "../../../interfaces";

// Define the Student schema
export const StudentSchema = new Schema<IStudent>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  image: {
    type: String,
    required: [true, "Image is required"],
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
export const STUDENT_MODEL_NAME = "Student";
