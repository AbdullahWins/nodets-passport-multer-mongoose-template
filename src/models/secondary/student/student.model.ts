//src/models/student/student.model.ts
import moment from "moment";
import { Schema, model } from "mongoose";
import { IStudent, IStudentDocument, IStudentModel } from "../../../interfaces";

const StudentSchema = new Schema<IStudentDocument>({
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

// checking is student found with the id
StudentSchema.statics.isStudentExistsById = async function (
  studentId: string,
  select: string
): Promise<IStudent | null> {
  const student = await this.findById(studentId).select(select).lean();
  return student;
};

// checking is student found with the email
StudentSchema.statics.isStudentExistsByName = async function (
  name: string,
  select: string
): Promise<IStudent | null> {
  const student = await this.findOne({ name }).select(select).lean();
  return student;
};

const Student = model<IStudentDocument, IStudentModel>("Student", StudentSchema);
export default Student;
