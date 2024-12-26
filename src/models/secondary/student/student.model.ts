//src/models/student/student.model.ts
import moment from "moment";
import { Schema, model } from "mongoose";
import { IStudentDocument, IStudentModel } from "../../../interfaces";

const StudentSchema = new Schema<IStudentDocument>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
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

const Student = model<IStudentDocument, IStudentModel>(
  "Student",
  StudentSchema
);
export default Student;
