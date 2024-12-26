//src/models/teacher/teacher.model.ts
import moment from "moment";
import { Schema, model } from "mongoose";
import { ITeacher, ITeacherDocument, ITeacherModel } from "../../../interfaces";

const TeacherSchema = new Schema<ITeacherDocument>({
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

// checking is teacher found with the id
TeacherSchema.statics.isTeacherExistsById = async function (
  teacherId: string,
  select: string
): Promise<ITeacher | null> {
  const teacher = await this.findById(teacherId).select(select).lean();
  return teacher;
};

// checking is teacher found with the email
TeacherSchema.statics.isTeacherExistsByName = async function (
  name: string,
  select: string
): Promise<ITeacher | null> {
  const teacher = await this.findOne({ name }).select(select).lean();
  return teacher;
};

const Teacher = model<ITeacherDocument, ITeacherModel>(
  "Teacher",
  TeacherSchema
);
export default Teacher;
