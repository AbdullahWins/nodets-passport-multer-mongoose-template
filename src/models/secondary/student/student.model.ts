import { Schema } from "mongoose";
import { IStudent } from "../../../interfaces";

// Define the Student schema
export const studentSchema = new Schema<IStudent>({
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
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now(),
  },
});

// Export model name for dynamic usage
export const STUDENT_MODEL_NAME = "Student";
